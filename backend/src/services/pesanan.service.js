// Service untuk manajemen pesanan dan integrasi Midtrans
const prisma = require('../config/database');
const snapClient = require('../config/midtrans');
const crypto = require('crypto');

/**
 * Buat pesanan baru dan inisialisasi transaksi Midtrans Snap
 * @param {string} penggunaId - ID pengguna yang melakukan checkout
 * @param {Object} data - Data checkout: items, alamat_id, kurir, ongkir, catatan
 * @returns {Object} Data pesanan tersimpan beserta Midtrans token dan redirect_url
 */
const buatPesanan = async (penggunaId, data) => {
  const { items, alamat_id, kurir, ongkir, catatan } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Items pesanan tidak boleh kosong');
  }

  if (!alamat_id) {
    throw new Error('Alamat pengiriman wajib dipilih');
  }

  // Validasi alamat milik pengguna ini
  const alamat = await prisma.alamat.findFirst({
    where: { id: alamat_id, pengguna_id: penggunaId },
  });
  if (!alamat) {
    throw new Error('Alamat tidak ditemukan');
  }

  // Ambil data pengguna untuk detail customer Midtrans
  const pengguna = await prisma.pengguna.findUnique({
    where: { id: penggunaId },
  });

  // Validasi dan kalkulasi total produk
  let totalProduk = 0;
  const detailItemPesanan = [];
  const itemMidtrans = [];

  for (const item of items) {
    const produk = await prisma.produk.findUnique({
      where: { id: item.produk_id },
    });

    if (!produk) {
      throw new Error(`Produk dengan ID ${item.produk_id} tidak ditemukan`);
    }
    if (!produk.is_aktif) {
      throw new Error(`Produk "${produk.nama}" sudah tidak aktif`);
    }
    if (produk.stok < item.jumlah) {
      throw new Error(`Stok produk "${produk.nama}" tidak mencukupi`);
    }

    const hargaSatuan = Number(produk.harga);
    const subtotal = hargaSatuan * item.jumlah;
    totalProduk += subtotal;

    detailItemPesanan.push({
      produk_id: produk.id,
      nama_produk: produk.nama,
      harga_satuan: hargaSatuan,
      jumlah: item.jumlah,
      subtotal: subtotal,
    });

    itemMidtrans.push({
      id: produk.id,
      price: hargaSatuan,
      quantity: item.jumlah,
      name: produk.nama.substring(0, 50), // Midtrans max 50 chars
    });
  }

  const ongkirNominal = Number(ongkir) || 0;
  const totalPembayaran = totalProduk + ongkirNominal;

  // Generate nomor pesanan unik
  const nomorPesanan = `ORDER-${Date.now()}-${penggunaId.substring(0, 8).toUpperCase()}`;

  // Simpan pesanan ke database menggunakan transaction Prisma
  const pesananBaru = await prisma.$transaction(async (tx) => {
    // Buat record Pesanan
    const pesanan = await tx.pesanan.create({
      data: {
        nomor_pesanan: nomorPesanan,
        pengguna_id: penggunaId,
        alamat_id: alamat_id,
        total_produk: totalProduk,
        ongkir: ongkirNominal,
        total_pembayaran: totalPembayaran,
        status: 'MENUNGGU_PEMBAYARAN',
        catatan: catatan || null,
      },
    });

    // Buat semua ItemPesanan
    await tx.itemPesanan.createMany({
      data: detailItemPesanan.map((item) => ({
        pesanan_id: pesanan.id,
        ...item,
      })),
    });

    // Kurangi stok produk
    for (const item of items) {
      await tx.produk.update({
        where: { id: item.produk_id },
        data: { stok: { decrement: item.jumlah } },
      });
    }

    // Buat record Pembayaran awal
    const pembayaran = await tx.pembayaran.create({
      data: {
        pesanan_id: pesanan.id,
        metode_pembayaran: kurir || 'midtrans',
        jumlah: totalPembayaran,
        status: 'PENDING',
        midtrans_order_id: nomorPesanan,
      },
    });

    return { pesanan, pembayaran };
  });

  // Tambah ongkir sebagai item Midtrans jika ada
  if (ongkirNominal > 0) {
    itemMidtrans.push({
      id: 'ONGKIR',
      price: ongkirNominal,
      quantity: 1,
      name: `Ongkos Kirim (${kurir || 'Ekspedisi'})`,
    });
  }

  // Inisialisasi transaksi Midtrans Snap
  const parameterMidtrans = {
    transaction_details: {
      order_id: nomorPesanan,
      gross_amount: totalPembayaran,
    },
    item_details: itemMidtrans,
    customer_details: {
      first_name: pengguna.nama,
      email: pengguna.email,
      phone: pengguna.nomor_telepon || '',
      shipping_address: {
        first_name: alamat.nama_penerima,
        phone: alamat.nomor_telepon,
        address: alamat.alamat_lengkap,
        city: alamat.kota,
        postal_code: alamat.kode_pos,
        country_code: 'IDN',
      },
    },
  };

  const transaksiMidtrans = await snapClient.createTransaction(parameterMidtrans);

  // Simpan token Midtrans ke record Pembayaran
  await prisma.pembayaran.update({
    where: { pesanan_id: pesananBaru.pesanan.id },
    data: {
      midtrans_token: transaksiMidtrans.token,
      url_pembayaran: transaksiMidtrans.redirect_url,
    },
  });

  return {
    pesanan: pesananBaru.pesanan,
    pembayaran: {
      ...pesananBaru.pembayaran,
      midtrans_token: transaksiMidtrans.token,
      url_pembayaran: transaksiMidtrans.redirect_url,
    },
    snap_token: transaksiMidtrans.token,
    redirect_url: transaksiMidtrans.redirect_url,
  };
};

/**
 * Proses notifikasi webhook dari Midtrans dan update status pesanan
 * @param {Object} notifikasi - Payload notifikasi dari Midtrans
 * @returns {Object} Status update yang berhasil diproses
 */
const prosesWebhookMidtrans = async (notifikasi) => {
  const {
    order_id,
    transaction_status,
    fraud_status,
    signature_key,
    gross_amount,
    status_code,
  } = notifikasi;

  // Verifikasi signature key untuk memastikan notifikasi berasal dari Midtrans
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const hashString = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const expectedSignature = crypto.createHash('sha512').update(hashString).digest('hex');

  if (signature_key !== expectedSignature) {
    throw new Error('Signature key tidak valid - notifikasi ditolak');
  }

  // Tentukan status pesanan dan pembayaran berdasarkan transaction_status
  let statusPesanan;
  let statusPembayaran;
  let tanggalBayar = null;

  if (transaction_status === 'capture' || transaction_status === 'settlement') {
    if (fraud_status === 'accept' || transaction_status === 'settlement') {
      statusPesanan = 'DIBAYAR';
      statusPembayaran = 'BERHASIL';
      tanggalBayar = new Date();
    }
  } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
    statusPesanan = 'DIBATALKAN';
    statusPembayaran = 'GAGAL';
  } else if (transaction_status === 'expire') {
    statusPesanan = 'DIBATALKAN';
    statusPembayaran = 'EXPIRED';
  } else if (transaction_status === 'pending') {
    statusPesanan = 'MENUNGGU_PEMBAYARAN';
    statusPembayaran = 'PENDING';
  }

  if (!statusPesanan) {
    return { pesan: `Status ${transaction_status} tidak memerlukan update` };
  }

  // Cari pesanan berdasarkan midtrans_order_id
  const pembayaran = await prisma.pembayaran.findFirst({
    where: { midtrans_order_id: order_id },
    include: { pesanan: true },
  });

  if (!pembayaran) {
    throw new Error(`Pesanan dengan order_id ${order_id} tidak ditemukan`);
  }

  // Update status Pesanan dan Pembayaran secara bersamaan
  await prisma.$transaction([
    prisma.pesanan.update({
      where: { id: pembayaran.pesanan_id },
      data: { status: statusPesanan },
    }),
    prisma.pembayaran.update({
      where: { id: pembayaran.id },
      data: {
        status: statusPembayaran,
        ...(tanggalBayar && { tanggal_bayar: tanggalBayar }),
      },
    }),
  ]);

  return {
    order_id,
    status_pesanan: statusPesanan,
    status_pembayaran: statusPembayaran,
  };
};

/**
 * Ambil riwayat pesanan milik pengguna
 * @param {string} penggunaId - ID pengguna
 * @returns {Array} Daftar pesanan beserta item dan pembayaran
 */
const getRiwayatPesanan = async (penggunaId) => {
  const daftarPesanan = await prisma.pesanan.findMany({
    where: { pengguna_id: penggunaId },
    include: {
      item: {
        include: {
          produk: {
            select: { id: true, nama: true, gambar_url: true },
          },
        },
      },
      pembayaran: true,
      alamat: true,
    },
    orderBy: { dibuat_pada: 'desc' },
  });

  return daftarPesanan;
};

/**
 * Ambil detail satu pesanan milik pengguna
 * @param {string} penggunaId - ID pengguna
 * @param {string} pesananId - ID pesanan
 * @returns {Object} Detail pesanan lengkap
 */
const getDetailPesanan = async (penggunaId, pesananId) => {
  const pesanan = await prisma.pesanan.findFirst({
    where: { id: pesananId, pengguna_id: penggunaId },
    include: {
      item: {
        include: {
          produk: {
            select: { id: true, nama: true, gambar_url: true, harga: true },
          },
        },
      },
      pembayaran: true,
      alamat: true,
    },
  });

  if (!pesanan) {
    throw new Error('Pesanan tidak ditemukan');
  }

  return pesanan;
};

module.exports = {
  buatPesanan,
  prosesWebhookMidtrans,
  getRiwayatPesanan,
  getDetailPesanan,
};

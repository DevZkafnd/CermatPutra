// Service untuk manajemen produk
const prisma = require('../config/database');

/**
 * Ambil semua produk dengan filter, pencarian, dan pagination
 * @param {Object} opsiQuery - Opsi query dan pagination
 * @param {string} [opsiQuery.kueri] - Kata kunci pencarian berdasarkan nama produk
 * @param {string} [opsiQuery.kategori] - Slug kategori untuk filter produk
 * @param {number} [opsiQuery.halaman=1] - Nomor halaman (default: 1)
 * @param {number} [opsiQuery.batas=10] - Jumlah item per halaman (default: 10)
 * @returns {Object} Objek berisi array data produk dan metadata pagination
 * @returns {Array} return.data - Array produk beserta relasi kategori
 * @returns {Object} return.meta - Metadata pagination
 * @returns {number} return.meta.total_item - Total item yang cocok dengan filter
 * @returns {number} return.meta.total_halaman - Total halaman
 * @returns {number} return.meta.halaman_saat_ini - Nomor halaman saat ini
 * @returns {number} return.meta.batas_per_halaman - Jumlah item per halaman
 */
const getAllProduk = async ({ kueri, kategori, halaman = 1, batas = 10 } = {}) => {
  // Hitung nilai skip untuk pagination
  const skip = (parseInt(halaman) - 1) * parseInt(batas);

  // Bangun kondisi pencarian secara dinamis
  const kondisiPencarian = {};

  if (kueri) {
    kondisiPencarian.nama = {
      contains: kueri,
      mode: 'insensitive',
    };
  }

  if (kategori) {
    kondisiPencarian.kategori = {
      slug: kategori,
    };
  }

  // Jalankan query data dan count secara paralel untuk performa optimal
  const [dataProduk, totalItem] = await Promise.all([
    prisma.produk.findMany({
      where: kondisiPencarian,
      skip: skip,
      take: parseInt(batas),
      orderBy: { dibuat_pada: 'desc' },
      include: {
        kategori: {
          select: {
            id: true,
            nama: true,
            slug: true,
          },
        },
      },
    }),
    prisma.produk.count({
      where: kondisiPencarian,
    }),
  ]);

  // Hitung total halaman
  const totalHalaman = Math.ceil(totalItem / parseInt(batas));

  return {
    data: dataProduk,
    meta: {
      total_item: totalItem,
      total_halaman: totalHalaman,
      halaman_saat_ini: parseInt(halaman),
      batas_per_halaman: parseInt(batas),
    },
  };
};

/**
 * Ambil detail produk berdasarkan ID beserta relasi kategori dan ulasan
 * @param {string} id - ID produk yang dicari
 * @returns {Object} Data produk lengkap beserta kategori dan array ulasan dengan nama pengguna
 * @throws {Error} Melempar error jika produk tidak ditemukan
 */
const getProdukById = async (id) => {
  // Ambil data produk beserta relasi kategori dan ulasan
  const dataProduk = await prisma.produk.findUnique({
    where: { id },
    include: {
      kategori: {
        select: {
          id: true,
          nama: true,
          slug: true,
        },
      },
      ulasan: {
        orderBy: { dibuat_pada: 'desc' },
        select: {
          id: true,
          rating: true,
          komentar: true,
          dibuat_pada: true,
          pengguna: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
  });

  // Lempar error jika produk tidak ditemukan
  if (!dataProduk) {
    throw new Error('Produk tidak ditemukan');
  }

  return dataProduk;
};

/**
 * Tambah produk baru ke database
 * @param {Object} payload - Data produk yang akan disimpan
 * @param {string} payload.kategoriId - ID kategori produk
 * @param {string} payload.nama - Nama produk
 * @param {string} [payload.deskripsi] - Deskripsi produk
 * @param {number} payload.harga - Harga produk
 * @param {number} payload.stok - Jumlah stok produk
 * @param {string} [payload.sku] - Stock Keeping Unit produk
 * @param {string} [payload.gambarUrl] - URL gambar produk
 * @returns {Object} Data produk yang baru dibuat
 * @throws {Error} Melempar error jika data wajib tidak lengkap atau kategori tidak ditemukan
 */
const tambahProduk = async ({ kategoriId, nama, deskripsi, harga, berat_gram, stok, gambarUrl }) => {
  // Validasi field wajib
  if (!kategoriId || !nama || !harga || !berat_gram || !stok) {
    throw new Error('Data wajib produk tidak lengkap');
  }

  // Validasi keberadaan kategori
  const kategoriAda = await prisma.kategoriProduk.findUnique({
    where: { id: kategoriId },
  });

  if (!kategoriAda) {
    throw new Error('Kategori tidak ditemukan');
  }

  // Generate slug unik berdasarkan nama produk dengan timestamp
  const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

  // Simpan produk baru ke database
  const produkBaru = await prisma.produk.create({
    data: {
      kategori_id: kategoriId,
      nama,
      slug,
      deskripsi,
      harga: parseInt(harga),
      berat_gram: parseInt(berat_gram),
      stok: parseInt(stok),
      gambar_url: gambarUrl,
    },
  });

  return produkBaru;
};

/**
 * Update data produk berdasarkan ID
 * @param {string} id - ID produk yang akan diperbarui
 * @param {Object} payload - Data produk yang akan diperbarui
 * @param {string} [payload.kategoriId] - ID kategori produk baru
 * @param {string} [payload.nama] - Nama produk baru
 * @param {string} [payload.deskripsi] - Deskripsi produk baru
 * @param {number} [payload.harga] - Harga produk baru
 * @param {number} [payload.berat_gram] - Berat produk baru dalam gram
 * @param {number} [payload.stok] - Jumlah stok produk baru
 * @param {string} [payload.gambarUrl] - URL gambar produk baru
 * @param {boolean} [payload.is_aktif] - Status aktif produk
 * @returns {Object} Data produk yang telah diperbarui
 * @throws {Error} Melempar error jika produk atau kategori tidak ditemukan
 */
const updateProduk = async (id, { kategoriId, nama, deskripsi, harga, berat_gram, stok, gambarUrl, is_aktif }) => {
  // Cek keberadaan produk
  const produkAda = await prisma.produk.findUnique({
    where: { id },
  });

  if (!produkAda) {
    throw new Error('Produk tidak ditemukan');
  }

  // Validasi kategori jika disertakan dalam payload
  if (kategoriId) {
    const kategoriAda = await prisma.kategoriProduk.findUnique({
      where: { id: kategoriId },
    });

    if (!kategoriAda) {
      throw new Error('Kategori tidak ditemukan');
    }
  }

  // Bangun objek data update secara dinamis
  const dataUpdate = {};

  if (kategoriId) dataUpdate.kategori_id = kategoriId;
  if (nama) {
    dataUpdate.nama = nama;
    dataUpdate.slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
  }
  if (deskripsi) dataUpdate.deskripsi = deskripsi;
  if (harga) dataUpdate.harga = parseInt(harga);
  if (berat_gram) dataUpdate.berat_gram = parseInt(berat_gram);
  if (stok) dataUpdate.stok = parseInt(stok);
  if (gambarUrl) dataUpdate.gambar_url = gambarUrl;
  if (is_aktif !== undefined) dataUpdate.is_aktif = is_aktif;

  // Perbarui data produk di database
  const produkDiperbarui = await prisma.produk.update({
    where: { id },
    data: dataUpdate,
  });

  return produkDiperbarui;
};

/**
 * Hapus produk berdasarkan ID
 * @param {string} id - ID produk yang akan dihapus
 * @returns {Object} Data produk yang telah dihapus
 * @throws {Error} Melempar error jika produk tidak ditemukan
 */
const hapusProduk = async (id) => {
  // Cek keberadaan produk sebelum menghapus
  const produkAda = await prisma.produk.findUnique({
    where: { id },
  });

  if (!produkAda) {
    throw new Error('Produk tidak ditemukan');
  }

  // Hapus produk dari database
  const produkDihapus = await prisma.produk.delete({
    where: { id },
  });

  return produkDihapus;
};

module.exports = {
  getAllProduk,
  getProdukById,
  tambahProduk,
  updateProduk,
  hapusProduk,
};

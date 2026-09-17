// Service untuk manajemen keranjang belanja
const prisma = require('../config/database');

/**
 * Ambil keranjang belanja milik pengguna beserta item dan kalkulasi total harga
 * @param {string} penggunaId - ID pengguna yang sedang login
 * @returns {Object} Data keranjang beserta array item dan totalHarga
 */
const getKeranjang = async (penggunaId) => {
  let keranjang = await prisma.keranjang.findFirst({
    where: { pengguna_id: penggunaId },
    include: {
      item: {
        include: { produk: true },
      },
    },
  });

  // Jika belum punya keranjang, buatkan baru
  if (!keranjang) {
    keranjang = await prisma.keranjang.create({
      data: { pengguna_id: penggunaId },
      include: {
        item: { include: { produk: true } },
      },
    });
  }

  // Kalkulasi total harga otomatis
  const totalHarga = keranjang.item.reduce((total, itemKeranjang) => {
    return total + (itemKeranjang.jumlah * Number(itemKeranjang.produk.harga));
  }, 0);

  return { ...keranjang, totalHarga };
};

/**
 * Tambah produk ke dalam keranjang belanja
 * @param {string} penggunaId - ID pengguna
 * @param {string} produkId - ID produk yang akan ditambahkan
 * @param {number} jumlah - Jumlah item yang ditambahkan
 * @returns {Object} Data item keranjang yang ditambahkan atau diperbarui
 */
const tambahItem = async (penggunaId, produkId, jumlah) => {
  // Cek atau buat keranjang pengguna
  let keranjang = await prisma.keranjang.findFirst({
    where: { pengguna_id: penggunaId },
  });

  if (!keranjang) {
    keranjang = await prisma.keranjang.create({
      data: { pengguna_id: penggunaId },
    });
  }

  // Cek ketersediaan produk dan stok
  const produk = await prisma.produk.findUnique({ where: { id: produkId } });
  if (!produk) throw new Error('Produk tidak ditemukan');
  if (produk.stok < jumlah) throw new Error('Stok produk tidak mencukupi');

  // Cek apakah item sudah ada di keranjang
  const itemSudahAda = await prisma.itemKeranjang.findFirst({
    where: { keranjang_id: keranjang.id, produk_id: produkId },
  });

  if (itemSudahAda) {
    const jumlahBaru = itemSudahAda.jumlah + jumlah;
    if (produk.stok < jumlahBaru) throw new Error('Stok produk tidak mencukupi untuk tambahan ini');

    return prisma.itemKeranjang.update({
      where: { id: itemSudahAda.id },
      data: { jumlah: jumlahBaru },
    });
  }

  // Jika item baru
  return prisma.itemKeranjang.create({
    data: {
      keranjang_id: keranjang.id,
      produk_id: produkId,
      jumlah,
    },
  });
};

/**
 * Update jumlah item di keranjang
 * @param {string} penggunaId - ID pengguna
 * @param {string} itemId - ID item keranjang
 * @param {number} jumlah - Jumlah baru
 * @returns {Object} Data item yang diperbarui
 */
const updateJumlahItem = async (penggunaId, itemId, jumlah) => {
  const keranjang = await prisma.keranjang.findFirst({
    where: { pengguna_id: penggunaId },
  });
  if (!keranjang) throw new Error('Keranjang tidak ditemukan');

  const item = await prisma.itemKeranjang.findFirst({
    where: { id: itemId, keranjang_id: keranjang.id },
    include: { produk: true },
  });

  if (!item) throw new Error('Item tidak ditemukan di keranjang');

  // Hapus jika jumlah <= 0
  if (jumlah <= 0) return hapusItem(penggunaId, itemId);

  if (item.produk.stok < jumlah) throw new Error('Stok produk tidak mencukupi');

  return prisma.itemKeranjang.update({
    where: { id: itemId },
    data: { jumlah },
  });
};

/**
 * Hapus item dari keranjang belanja
 * @param {string} penggunaId - ID pengguna
 * @param {string} itemId - ID item keranjang yang akan dihapus
 * @returns {Object} Data item yang dihapus
 */
const hapusItem = async (penggunaId, itemId) => {
  const keranjang = await prisma.keranjang.findFirst({
    where: { pengguna_id: penggunaId },
  });
  if (!keranjang) throw new Error('Keranjang tidak ditemukan');

  const item = await prisma.itemKeranjang.findFirst({
    where: { id: itemId, keranjang_id: keranjang.id },
  });

  if (!item) throw new Error('Item tidak ditemukan di keranjang');

  return prisma.itemKeranjang.delete({
    where: { id: itemId },
  });
};

module.exports = {
  getKeranjang,
  tambahItem,
  updateJumlahItem,
  hapusItem,
};

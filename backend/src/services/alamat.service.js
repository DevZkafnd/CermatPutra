// Service untuk manajemen alamat pengiriman pengguna
const prisma = require('../config/database');

/**
 * Tambah alamat baru untuk pengguna
 * @param {string} penggunaId - ID pengguna
 * @param {Object} data - Data alamat baru
 * @returns {Object} Data alamat yang baru dibuat
 */
const tambahAlamat = async (penggunaId, data) => {
  // Cek apakah pengguna sudah punya alamat
  const jumlahAlamat = await prisma.alamat.count({
    where: { pengguna_id: penggunaId },
  });

  // Jika belum ada alamat, paksa is_utama menjadi true
  const isUtama = jumlahAlamat === 0 ? true : (data.is_utama || false);

  // Jika alamat baru akan menjadi utama, reset semua alamat lain milik pengguna ini
  if (isUtama) {
    await prisma.alamat.updateMany({
      where: { pengguna_id: penggunaId },
      data: { is_utama: false },
    });
  }

  const alamatBaru = await prisma.alamat.create({
    data: {
      pengguna_id: penggunaId,
      label: data.label,
      nama_penerima: data.nama_penerima,
      nomor_telepon: data.nomor_telepon,
      alamat_lengkap: data.alamat_lengkap,
      kota: data.kota,
      provinsi: data.provinsi,
      kode_pos: data.kode_pos,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      is_utama: isUtama,
    },
  });

  return alamatBaru;
};

/**
 * Ambil semua alamat milik pengguna, alamat utama di urutan pertama
 * @param {string} penggunaId - ID pengguna
 * @returns {Array} Daftar alamat pengguna
 */
const getAlamatPengguna = async (penggunaId) => {
  const daftarAlamat = await prisma.alamat.findMany({
    where: { pengguna_id: penggunaId },
    orderBy: { is_utama: 'desc' },
  });

  return daftarAlamat;
};

/**
 * Update data alamat pengguna
 * @param {string} penggunaId - ID pengguna
 * @param {string} alamatId - ID alamat yang akan diperbarui
 * @param {Object} data - Data baru untuk alamat
 * @returns {Object} Data alamat yang telah diperbarui
 */
const updateAlamat = async (penggunaId, alamatId, data) => {
  // Cek keberadaan alamat milik pengguna ini
  const alamatAda = await prisma.alamat.findFirst({
    where: { id: alamatId, pengguna_id: penggunaId },
  });

  if (!alamatAda) {
    throw new Error('Alamat tidak ditemukan');
  }

  // Jika diupdate menjadi utama, reset semua alamat lain milik pengguna ini terlebih dahulu
  if (data.is_utama === true) {
    await prisma.alamat.updateMany({
      where: { pengguna_id: penggunaId, id: { not: alamatId } },
      data: { is_utama: false },
    });
  }

  const dataUpdate = {};
  if (data.label !== undefined) dataUpdate.label = data.label;
  if (data.nama_penerima !== undefined) dataUpdate.nama_penerima = data.nama_penerima;
  if (data.nomor_telepon !== undefined) dataUpdate.nomor_telepon = data.nomor_telepon;
  if (data.alamat_lengkap !== undefined) dataUpdate.alamat_lengkap = data.alamat_lengkap;
  if (data.kota !== undefined) dataUpdate.kota = data.kota;
  if (data.provinsi !== undefined) dataUpdate.provinsi = data.provinsi;
  if (data.kode_pos !== undefined) dataUpdate.kode_pos = data.kode_pos;
  if (data.latitude !== undefined) dataUpdate.latitude = data.latitude ? parseFloat(data.latitude) : null;
  if (data.longitude !== undefined) dataUpdate.longitude = data.longitude ? parseFloat(data.longitude) : null;
  if (data.is_utama !== undefined) dataUpdate.is_utama = data.is_utama;

  const alamatDiperbarui = await prisma.alamat.update({
    where: { id: alamatId },
    data: dataUpdate,
  });

  return alamatDiperbarui;
};

/**
 * Hapus alamat pengguna, promosikan alamat tertua sebagai utama jika yang dihapus adalah utama
 * @param {string} penggunaId - ID pengguna
 * @param {string} alamatId - ID alamat yang akan dihapus
 * @returns {Object} Data alamat yang dihapus
 */
const hapusAlamat = async (penggunaId, alamatId) => {
  // Cek keberadaan alamat milik pengguna ini
  const alamatAda = await prisma.alamat.findFirst({
    where: { id: alamatId, pengguna_id: penggunaId },
  });

  if (!alamatAda) {
    throw new Error('Alamat tidak ditemukan');
  }

  // Hapus alamat dari database
  const alamatDihapus = await prisma.alamat.delete({
    where: { id: alamatId },
  });

  // Jika alamat yang dihapus adalah utama, jadikan alamat tertua berikutnya sebagai utama
  if (alamatAda.is_utama) {
    const alamatTertua = await prisma.alamat.findFirst({
      where: { pengguna_id: penggunaId },
      orderBy: { dibuat_pada: 'asc' },
    });

    if (alamatTertua) {
      await prisma.alamat.update({
        where: { id: alamatTertua.id },
        data: { is_utama: true },
      });
    }
  }

  return alamatDihapus;
};

module.exports = {
  tambahAlamat,
  getAlamatPengguna,
  updateAlamat,
  hapusAlamat,
};

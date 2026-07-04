// Service untuk autentikasi pengguna
const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/bcrypt.util');
const { generateToken } = require('../utils/jwt.util');

/**
 * Registrasi pengguna baru
 * @param {Object} dataPendaftaran - Data pendaftaran pengguna
 * @param {string} dataPendaftaran.nama - Nama lengkap pengguna
 * @param {string} dataPendaftaran.email - Alamat email pengguna
 * @param {string} dataPendaftaran.kataSandi - Password plain text
 * @param {string} dataPendaftaran.nomorTelepon - Nomor telepon pengguna
 * @returns {Object} Data pengguna tanpa kata_sandi
 */
const registerPengguna = async ({ nama, email, kataSandi, nomorTelepon }) => {
  // Cek apakah email sudah terdaftar
  const penggunaSudahAda = await prisma.pengguna.findUnique({
    where: { email },
  });

  if (penggunaSudahAda) {
    throw new Error('Email sudah terdaftar');
  }

  // Hash password sebelum disimpan
  const kataSandiTerhash = await hashPassword(kataSandi);

  // Simpan pengguna baru ke database
  const penggunaBaru = await prisma.pengguna.create({
    data: {
      nama,
      email,
      kata_sandi: kataSandiTerhash,
      nomor_telepon: nomorTelepon,
      role: 'PELANGGAN',
    },
  });

  // Hapus kata_sandi dari objek sebelum dikembalikan
  const { kata_sandi, ...dataPenggunaBersih } = penggunaBaru;

  return dataPenggunaBersih;
};

/**
 * Login pengguna
 * @param {Object} dataLogin - Data login pengguna
 * @param {string} dataLogin.email - Alamat email pengguna
 * @param {string} dataLogin.kataSandi - Password plain text
 * @returns {Object} Token JWT dan data pengguna tanpa kata_sandi
 */
const loginPengguna = async ({ email, kataSandi }) => {
  // Cari pengguna berdasarkan email
  const penggunaAda = await prisma.pengguna.findUnique({
    where: { email },
  });

  if (!penggunaAda) {
    throw new Error('Email atau kata sandi salah');
  }

  // Cocokkan kata sandi input dengan hash di database
  const kataSandiCocok = await comparePassword(kataSandi, penggunaAda.kata_sandi);

  if (!kataSandiCocok) {
    throw new Error('Email atau kata sandi salah');
  }

  // Buat JWT token dengan payload id dan role
  const token = generateToken({
    id: penggunaAda.id,
    role: penggunaAda.role,
  });

  // Hapus kata_sandi dari objek sebelum dikembalikan
  const { kata_sandi, ...dataPenggunaBersih } = penggunaAda;

  return {
    token,
    pengguna: dataPenggunaBersih,
  };
};

/**
 * Ambil profil pengguna berdasarkan ID
 * @param {string} idPengguna - ID pengguna
 * @returns {Object} Data pengguna tanpa kata_sandi
 */
const ambilProfilPengguna = async (idPengguna) => {
  // Cari pengguna berdasarkan ID
  const penggunaAda = await prisma.pengguna.findUnique({
    where: { id: idPengguna },
  });

  if (!penggunaAda) {
    throw new Error('Pengguna tidak ditemukan');
  }

  // Hapus kata_sandi dari objek sebelum dikembalikan
  const { kata_sandi, ...dataPenggunaBersih } = penggunaAda;

  return dataPenggunaBersih;
};

module.exports = {
  registerPengguna,
  loginPengguna,
  ambilProfilPengguna,
};

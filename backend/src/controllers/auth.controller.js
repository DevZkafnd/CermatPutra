// Controller untuk autentikasi pengguna
const { registerPengguna, loginPengguna, ambilProfilPengguna } = require('../services/auth.service');
const { responseSuccess, responseError } = require('../utils/response.util');

/**
 * Registrasi pengguna baru
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
  try {
    const { nama, email, kata_sandi, nomor_telepon } = req.body;

    // Validasi field wajib
    if (!nama || !email || !kata_sandi) {
      return responseError(res, 'Nama, email, dan kata sandi wajib diisi', 400);
    }

    const dataPengguna = await registerPengguna({
      nama,
      email,
      kataSandi: kata_sandi,
      nomorTelepon: nomor_telepon,
    });

    return responseSuccess(res, dataPengguna, 'Registrasi berhasil', 201);
  } catch (error) {
    return responseError(res, error.message, 400);
  }
};

/**
 * Login pengguna
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, kata_sandi } = req.body;

    // Validasi field wajib
    if (!email || !kata_sandi) {
      return responseError(res, 'Email dan kata sandi wajib diisi', 400);
    }

    const hasilLogin = await loginPengguna({
      email,
      kataSandi: kata_sandi,
    });

    return responseSuccess(res, hasilLogin, 'Login berhasil', 200);
  } catch (error) {
    return responseError(res, error.message, 401);
  }
};

/**
 * Ambil profil pengguna yang sedang login
 * GET /api/v1/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const idPengguna = req.pengguna.id;

    const dataPengguna = await ambilProfilPengguna(idPengguna);

    return responseSuccess(res, dataPengguna, 'Berhasil mendapatkan profil', 200);
  } catch (error) {
    return responseError(res, error.message, 400);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};

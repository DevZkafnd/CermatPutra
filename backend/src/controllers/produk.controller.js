// Controller untuk manajemen produk
const { getAllProduk, getProdukById, tambahProduk, updateProduk, hapusProduk } = require('../services/produk.service');
const { responseSuccess, responseError } = require('../utils/response.util');

/**
 * Ambil semua produk dengan filter, pencarian, dan pagination
 * GET /api/v1/produk
 */
const getAll = async (req, res) => {
  try {
    const { kueri, kategori, halaman, batas } = req.query;

    const hasil = await getAllProduk({ kueri, kategori, halaman, batas });

    return responseSuccess(res, hasil, 'Berhasil mengambil daftar produk', 200);
  } catch (error) {
    return responseError(res, error.message, 500);
  }
};

/**
 * Ambil detail produk berdasarkan ID dari parameter URL
 * GET /api/v1/produk/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const dataProduk = await getProdukById(id);

    return responseSuccess(res, dataProduk, 'Berhasil mengambil detail produk', 200);
  } catch (error) {
    if (error.message === 'Produk tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    return responseError(res, error.message, 500);
  }
};

/**
 * Tambah produk baru (Admin Only)
 * POST /api/v1/produk
 */
const tambah = async (req, res) => {
  try {
    const { kategoriId, nama, deskripsi, harga, berat_gram, stok } = req.body;
    const gambarUrl = req.file ? req.file.path : null;

    const payload = { kategoriId, nama, deskripsi, harga, berat_gram, stok, gambarUrl };

    const produkBaru = await tambahProduk(payload);

    return responseSuccess(res, produkBaru, 'Berhasil menambahkan produk baru', 201);
  } catch (error) {
    if (error.message === 'Data wajib produk tidak lengkap') {
      return responseError(res, error.message, 400);
    }
    if (error.message === 'Kategori tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    return responseError(res, error.message, 500);
  }
};

/**
 * Update data produk berdasarkan ID (Admin Only)
 * PUT /api/v1/produk/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { kategoriId, nama, deskripsi, harga, berat_gram, stok, is_aktif } = req.body;
    const gambarUrl = req.file ? req.file.path : undefined;

    const payload = { kategoriId, nama, deskripsi, harga, berat_gram, stok, gambarUrl, is_aktif };

    const produkDiupdate = await updateProduk(id, payload);

    return responseSuccess(res, produkDiupdate, 'Berhasil memperbarui data produk', 200);
  } catch (error) {
    if (error.message === 'Produk tidak ditemukan' || error.message === 'Kategori tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    return responseError(res, error.message, 500);
  }
};

/**
 * Hapus produk berdasarkan ID (Admin Only)
 * DELETE /api/v1/produk/:id
 */
const hapus = async (req, res) => {
  try {
    const { id } = req.params;

    await hapusProduk(id);

    return responseSuccess(res, null, 'Berhasil menghapus produk', 200);
  } catch (error) {
    if (error.message === 'Produk tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    return responseError(res, error.message, 500);
  }
};

module.exports = {
  getAll,
  getById,
  tambah,
  update,
  hapus,
};

// Controller untuk manajemen keranjang belanja
const keranjangService = require('../services/keranjang.service');
const { responseSuccess, responseError } = require('../utils/response.util');

/**
 * Ambil keranjang belanja milik pengguna yang sedang login
 * GET /api/v1/keranjang
 */
const getKeranjang = async (req, res) => {
  try {
    // JWT middleware menyimpan data pengguna di req.pengguna
    const penggunaId = req.pengguna.id;
    const keranjang = await keranjangService.getKeranjang(penggunaId);

    return responseSuccess(res, keranjang, 'Berhasil mengambil data keranjang', 200);
  } catch (error) {
    return responseError(res, error.message, 500);
  }
};

/**
 * Tambah produk ke dalam keranjang belanja
 * POST /api/v1/keranjang
 */
const tambahItem = async (req, res) => {
  try {
    const penggunaId = req.pengguna.id;
    const { produkId, jumlah } = req.body;

    const item = await keranjangService.tambahItem(penggunaId, produkId, jumlah || 1);

    return responseSuccess(res, item, 'Berhasil menambahkan item ke keranjang', 201);
  } catch (error) {
    if (error.message === 'Produk tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    if (error.message.includes('Stok')) {
      return responseError(res, error.message, 400);
    }
    return responseError(res, error.message, 500);
  }
};

/**
 * Update jumlah item di keranjang
 * PUT /api/v1/keranjang/:itemId
 */
const updateItem = async (req, res) => {
  try {
    const penggunaId = req.pengguna.id;
    const { itemId } = req.params;
    const { jumlah } = req.body;

    const item = await keranjangService.updateJumlahItem(penggunaId, itemId, jumlah);

    return responseSuccess(res, item, 'Berhasil mengupdate jumlah item', 200);
  } catch (error) {
    if (error.message.includes('tidak ditemukan')) {
      return responseError(res, error.message, 404);
    }
    if (error.message.includes('Stok')) {
      return responseError(res, error.message, 400);
    }
    return responseError(res, error.message, 500);
  }
};

/**
 * Hapus item dari keranjang belanja
 * DELETE /api/v1/keranjang/:itemId
 */
const hapusItem = async (req, res) => {
  try {
    const penggunaId = req.pengguna.id;
    const { itemId } = req.params;

    await keranjangService.hapusItem(penggunaId, itemId);

    return responseSuccess(res, null, 'Berhasil menghapus item dari keranjang', 200);
  } catch (error) {
    if (error.message.includes('tidak ditemukan')) {
      return responseError(res, error.message, 404);
    }
    return responseError(res, error.message, 500);
  }
};

module.exports = {
  getKeranjang,
  tambahItem,
  updateItem,
  hapusItem,
};

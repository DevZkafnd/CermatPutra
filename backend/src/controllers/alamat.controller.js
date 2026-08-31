// Controller untuk manajemen alamat dan kalkulasi ongkos kirim
const alamatService = require('../services/alamat.service');
const ongkirService = require('../services/ongkir.service');
const { responseSuccess, responseError } = require('../utils/response.util');

/**
 * Ambil semua alamat milik pengguna yang sedang login
 * GET /api/v1/alamat
 */
const getAlamat = async (req, res, next) => {
  try {
    const penggunaId = req.pengguna.id;
    const daftarAlamat = await alamatService.getAlamatPengguna(penggunaId);

    return responseSuccess(res, daftarAlamat, 'Berhasil mengambil daftar alamat', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Tambah alamat baru untuk pengguna yang sedang login
 * POST /api/v1/alamat
 */
const tambahAlamat = async (req, res, next) => {
  try {
    const penggunaId = req.pengguna.id;
    const alamatBaru = await alamatService.tambahAlamat(penggunaId, req.body);

    return responseSuccess(res, alamatBaru, 'Berhasil menambahkan alamat baru', 201);
  } catch (error) {
    return responseError(res, error.message, 400);
  }
};

/**
 * Update alamat berdasarkan ID
 * PUT /api/v1/alamat/:id
 */
const updateAlamat = async (req, res, next) => {
  try {
    const penggunaId = req.pengguna.id;
    const { id } = req.params;

    const alamatDiperbarui = await alamatService.updateAlamat(penggunaId, id, req.body);

    return responseSuccess(res, alamatDiperbarui, 'Berhasil memperbarui alamat', 200);
  } catch (error) {
    if (error.message === 'Alamat tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    return responseError(res, error.message, 400);
  }
};

/**
 * Hapus alamat berdasarkan ID
 * DELETE /api/v1/alamat/:id
 */
const hapusAlamat = async (req, res, next) => {
  try {
    const penggunaId = req.pengguna.id;
    const { id } = req.params;

    await alamatService.hapusAlamat(penggunaId, id);

    return responseSuccess(res, null, 'Berhasil menghapus alamat', 200);
  } catch (error) {
    if (error.message === 'Alamat tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Verifikasi apakah lokasi tujuan masuk dalam radius COD
 * POST /api/v1/alamat/cod/verifikasi
 */
const cekJarakCOD = async (req, res, next) => {
  try {
    const { destLat, destLng } = req.body;

    if (!destLat || !destLng) {
      return responseError(res, 'destLat dan destLng wajib diisi', 400);
    }

    const hasilVerifikasi = ongkirService.verifikasiCOD(
      parseFloat(destLat),
      parseFloat(destLng)
    );

    return responseSuccess(res, hasilVerifikasi, 'Berhasil memverifikasi jarak COD', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Dapatkan daftar tarif pengiriman dari Biteship API
 * POST /api/v1/alamat/ongkir/biteship
 */
const cekOngkirBiteship = async (req, res, next) => {
  try {
    const { originAreaId, destinationAreaId, couriers, items } = req.body;

    if (!originAreaId || !destinationAreaId || !couriers || !items) {
      return responseError(res, 'originAreaId, destinationAreaId, couriers, dan items wajib diisi', 400);
    }

    const daftarTarif = await ongkirService.hitungOngkirEkspedisi(
      originAreaId,
      destinationAreaId,
      couriers,
      items
    );

    return responseSuccess(res, daftarTarif, 'Berhasil mengambil tarif pengiriman', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlamat,
  tambahAlamat,
  updateAlamat,
  hapusAlamat,
  cekJarakCOD,
  cekOngkirBiteship,
};

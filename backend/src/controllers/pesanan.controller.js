// Controller untuk manajemen pesanan dan checkout
const pesananService = require('../services/pesanan.service');
const { responseSuccess, responseError } = require('../utils/response.util');

/**
 * Proses checkout dan buat pesanan baru
 * POST /api/v1/pesanan/checkout
 */
const checkout = async (req, res, next) => {
  try {
    const penggunaId = req.pengguna.id;
    const hasil = await pesananService.buatPesanan(penggunaId, req.body);

    return responseSuccess(res, hasil, 'Berhasil membuat pesanan', 201);
  } catch (error) {
    if (
      error.message.includes('tidak ditemukan') ||
      error.message.includes('tidak aktif')
    ) {
      return responseError(res, error.message, 404);
    }
    if (
      error.message.includes('kosong') ||
      error.message.includes('wajib') ||
      error.message.includes('tidak mencukupi')
    ) {
      return responseError(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Terima notifikasi webhook dari Midtrans
 * POST /api/v1/pesanan/webhook
 * Endpoint ini publik - tidak memerlukan JWT (Midtrans yang menembak langsung)
 */
const webhookMidtrans = async (req, res, next) => {
  try {
    const hasil = await pesananService.prosesWebhookMidtrans(req.body);

    return res.status(200).json({
      sukses: true,
      pesan: 'Notifikasi berhasil diproses',
      data: hasil,
    });
  } catch (error) {
    if (error.message.includes('Signature key tidak valid')) {
      return res.status(403).json({
        sukses: false,
        pesan: error.message,
        data: null,
      });
    }
    next(error);
  }
};

/**
 * Ambil riwayat pesanan pengguna yang sedang login
 * GET /api/v1/pesanan
 */
const getRiwayatPesanan = async (req, res, next) => {
  try {
    const penggunaId = req.pengguna.id;
    const daftarPesanan = await pesananService.getRiwayatPesanan(penggunaId);

    return responseSuccess(res, daftarPesanan, 'Berhasil mengambil riwayat pesanan', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Ambil detail satu pesanan milik pengguna
 * GET /api/v1/pesanan/:id
 */
const getDetailPesanan = async (req, res, next) => {
  try {
    const penggunaId = req.pengguna.id;
    const { id } = req.params;

    const pesanan = await pesananService.getDetailPesanan(penggunaId, id);

    return responseSuccess(res, pesanan, 'Berhasil mengambil detail pesanan', 200);
  } catch (error) {
    if (error.message === 'Pesanan tidak ditemukan') {
      return responseError(res, error.message, 404);
    }
    next(error);
  }
};

module.exports = {
  checkout,
  webhookMidtrans,
  getRiwayatPesanan,
  getDetailPesanan,
};

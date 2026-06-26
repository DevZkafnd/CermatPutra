// Routes untuk pesanan
const express = require('express');
const router = express.Router();

// Import middlewares
// const { verifikasiToken } = require('../middlewares/auth.middleware');

// Import controllers (akan dibuat nanti)
// const pesananController = require('../controllers/pesanan.controller');

// Semua route pesanan memerlukan autentikasi
// router.use(verifikasiToken);

// POST /api/v1/pesanan - Buat pesanan baru
// router.post('/', pesananController.buatPesanan);

// GET /api/v1/pesanan - List pesanan user
// router.get('/', pesananController.listPesanan);

// GET /api/v1/pesanan/:id - Detail pesanan
// router.get('/:id', pesananController.detailPesanan);

// PUT /api/v1/pesanan/:id/batal - Batalkan pesanan
// router.put('/:id/batal', pesananController.batalkanPesanan);

module.exports = router;

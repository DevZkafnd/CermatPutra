// Routes untuk produk
const express = require('express');
const router = express.Router();

// Import middlewares
// const { verifikasiToken, periksaRole } = require('../middlewares/auth.middleware');

// Import controllers (akan dibuat nanti)
// const produkController = require('../controllers/produk.controller');

// Routes Public
// GET /api/v1/produk - List semua produk
// router.get('/', produkController.listProduk);

// GET /api/v1/produk/:id - Detail produk
// router.get('/:id', produkController.detailProduk);

// Routes Protected (Admin)
// POST /api/v1/produk - Tambah produk baru
// router.post('/', verifikasiToken, periksaRole('ADMIN', 'SUPER_ADMIN'), produkController.tambahProduk);

// PUT /api/v1/produk/:id - Update produk
// router.put('/:id', verifikasiToken, periksaRole('ADMIN', 'SUPER_ADMIN'), produkController.updateProduk);

// DELETE /api/v1/produk/:id - Hapus produk
// router.delete('/:id', verifikasiToken, periksaRole('ADMIN', 'SUPER_ADMIN'), produkController.hapusProduk);

module.exports = router;

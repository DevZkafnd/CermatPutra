// Routes untuk manajemen pesanan dan checkout
const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesanan.controller');
const { verifikasiToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /pesanan/checkout:
 *   post:
 *     summary: Proses checkout dan buat pesanan baru dengan Midtrans Snap
 *     tags: [Pesanan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - alamat_id
 *               - ongkir
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produk_id:
 *                       type: string
 *                       format: uuid
 *                       example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *                     jumlah:
 *                       type: integer
 *                       example: 2
 *               alamat_id:
 *                 type: string
 *                 format: uuid
 *                 example: b2c3d4e5-f6a7-8901-bcde-f12345678901
 *               kurir:
 *                 type: string
 *                 example: jne
 *               ongkir:
 *                 type: integer
 *                 example: 18000
 *               catatan:
 *                 type: string
 *                 example: Tolong dibungkus rapi
 *     responses:
 *       201:
 *         description: Berhasil membuat pesanan dan mendapatkan Midtrans token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Data pesanan tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       401:
 *         description: Unauthorized - Token tidak valid/ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       404:
 *         description: Produk atau alamat tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.post('/checkout', verifikasiToken, pesananController.checkout);

/**
 * @swagger
 * /pesanan/webhook:
 *   post:
 *     summary: Endpoint webhook untuk menerima notifikasi status pembayaran dari Midtrans
 *     tags: [Pesanan]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payload notifikasi standar dari Midtrans
 *     responses:
 *       200:
 *         description: Notifikasi berhasil diproses
 *       403:
 *         description: Signature key tidak valid
 */
router.post('/webhook', pesananController.webhookMidtrans);

/**
 * @swagger
 * /pesanan:
 *   get:
 *     summary: Mengambil riwayat pesanan milik pengguna yang sedang login
 *     tags: [Pesanan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat pesanan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       401:
 *         description: Unauthorized - Token tidak valid/ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.get('/', verifikasiToken, pesananController.getRiwayatPesanan);

/**
 * @swagger
 * /pesanan/{id}:
 *   get:
 *     summary: Mengambil detail pesanan berdasarkan ID
 *     tags: [Pesanan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID unik pesanan
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail pesanan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       401:
 *         description: Unauthorized - Token tidak valid/ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       404:
 *         description: Pesanan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.get('/:id', verifikasiToken, pesananController.getDetailPesanan);

module.exports = router;

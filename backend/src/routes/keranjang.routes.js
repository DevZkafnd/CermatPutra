// Routes untuk keranjang belanja
const express = require('express');
const router = express.Router();
const keranjangController = require('../controllers/keranjang.controller');
const { verifikasiToken } = require('../middlewares/auth.middleware');

// Terapkan middleware autentikasi ke semua route keranjang
router.use(verifikasiToken);

/**
 * @swagger
 * /keranjang:
 *   get:
 *     summary: Mendapatkan keranjang belanja milik pengguna yang sedang login
 *     tags: [Keranjang]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil keranjang beserta kalkulasi total harga
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
router.get('/', keranjangController.getKeranjang);

/**
 * @swagger
 * /keranjang:
 *   post:
 *     summary: Menambahkan produk ke dalam keranjang belanja
 *     tags: [Keranjang]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produkId
 *             properties:
 *               produkId:
 *                 type: string
 *                 format: uuid
 *                 example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *               jumlah:
 *                 type: integer
 *                 default: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Berhasil menambahkan item ke keranjang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Stok produk tidak mencukupi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       404:
 *         description: Produk tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.post('/', keranjangController.tambahItem);

/**
 * @swagger
 * /keranjang/{itemId}:
 *   put:
 *     summary: Mengubah jumlah item di keranjang
 *     tags: [Keranjang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID item keranjang
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jumlah
 *             properties:
 *               jumlah:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Berhasil mengupdate jumlah item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Stok produk tidak mencukupi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       404:
 *         description: Item tidak ditemukan di keranjang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.put('/:itemId', keranjangController.updateItem);

/**
 * @swagger
 * /keranjang/{itemId}:
 *   delete:
 *     summary: Menghapus item dari keranjang
 *     tags: [Keranjang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID item keranjang
 *     responses:
 *       200:
 *         description: Berhasil menghapus item dari keranjang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       404:
 *         description: Item tidak ditemukan di keranjang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.delete('/:itemId', keranjangController.hapusItem);

module.exports = router;

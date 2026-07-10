// Routes untuk produk
const express = require('express');
const router = express.Router();
const { getAll, getById, tambah, update, hapus } = require('../controllers/produk.controller');
const { verifikasiToken, periksaRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Routes Public
/**
 * @swagger
 * /produk:
 *   get:
 *     summary: Mendapatkan semua daftar produk dengan pagination dan filter
 *     tags: [Produk]
 *     security: []
 *     parameters:
 *       - name: kueri
 *         in: query
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian produk
 *       - name: kategori
 *         in: query
 *         schema:
 *           type: string
 *         description: Slug kategori untuk filter
 *       - name: halaman
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - name: batas
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
// GET /api/v1/produk - List semua produk
router.get('/', getAll);

// GET /api/v1/produk/:id - Detail produk
/**
 * @swagger
 * /produk/{id}:
 *   get:
 *     summary: Mendapatkan detail produk beserta ulasan berdasarkan ID
 *     tags: [Produk]
 *     security: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID unik produk
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       404:
 *         description: Produk tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.get('/:id', getById);

// Routes Protected (Admin)
/**
 * @swagger
 * /produk:
 *   post:
 *     summary: Menambahkan produk baru (Admin Only)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - kategoriId
 *               - nama
 *               - harga
 *               - berat_gram
 *               - stok
 *             properties:
 *               kategoriId:
 *                 type: string
 *                 format: uuid
 *                 example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *               nama:
 *                 type: string
 *                 example: Laptop Gaming Pro X
 *               deskripsi:
 *                 type: string
 *                 example: Laptop gaming dengan performa tinggi
 *               harga:
 *                 type: integer
 *                 example: 15000000
 *               berat_gram:
 *                 type: integer
 *                 example: 1500
 *               stok:
 *                 type: integer
 *                 example: 50
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar produk (jpg/png/jpeg/webp)
 *     responses:
 *       201:
 *         description: Berhasil menambahkan produk baru
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Data wajib produk tidak lengkap
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
 *       403:
 *         description: Forbidden - Anda tidak memiliki akses ke resource ini
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       404:
 *         description: Kategori tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
// POST /api/v1/produk - Tambah produk baru (Admin Only)
router.post('/', verifikasiToken, periksaRole('ADMIN', 'SUPER_ADMIN'), upload.single('gambar'), tambah);

// PUT /api/v1/produk/:id - Update produk (Admin Only)
/**
 * @swagger
 * /produk/{id}:
 *   put:
 *     summary: Memperbarui data produk (Admin Only)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID unik produk
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               kategoriId:
 *                 type: string
 *                 format: uuid
 *                 example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *               nama:
 *                 type: string
 *                 example: Laptop Gaming Pro X Updated
 *               deskripsi:
 *                 type: string
 *                 example: Deskripsi produk yang diperbarui
 *               harga:
 *                 type: integer
 *                 example: 14500000
 *               berat_gram:
 *                 type: integer
 *                 example: 1600
 *               stok:
 *                 type: integer
 *                 example: 45
 *               is_aktif:
 *                 type: boolean
 *                 example: true
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar produk baru (opsional)
 *     responses:
 *       200:
 *         description: Berhasil memperbarui data produk
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
 *       403:
 *         description: Forbidden - Anda tidak memiliki akses ke resource ini
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       404:
 *         description: Produk atau Kategori tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.put('/:id', verifikasiToken, periksaRole('ADMIN', 'SUPER_ADMIN'), upload.single('gambar'), update);

// DELETE /api/v1/produk/:id - Hapus produk (Admin Only)
/**
 * @swagger
 * /produk/{id}:
 *   delete:
 *     summary: Menghapus produk (Admin Only)
 *     tags: [Produk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID unik produk
 *     responses:
 *       200:
 *         description: Berhasil menghapus produk
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
 *       403:
 *         description: Forbidden - Anda tidak memiliki akses ke resource ini
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
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.delete('/:id', verifikasiToken, periksaRole('ADMIN', 'SUPER_ADMIN'), hapus);

module.exports = router;

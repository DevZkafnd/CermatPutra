// Routes untuk manajemen alamat, verifikasi COD, dan tarif pengiriman Biteship
const express = require('express');
const router = express.Router();
const alamatController = require('../controllers/alamat.controller');
const { verifikasiToken } = require('../middlewares/auth.middleware');

// Terapkan middleware autentikasi ke semua route alamat
router.use(verifikasiToken);

/**
 * @swagger
 * /alamat:
 *   get:
 *     summary: Mengambil semua alamat pengiriman milik pengguna yang sedang login
 *     tags: [Alamat & Ongkir]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar alamat
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
router.get('/', alamatController.getAlamat);

/**
 * @swagger
 * /alamat:
 *   post:
 *     summary: Menambahkan alamat pengiriman baru untuk pengguna
 *     tags: [Alamat & Ongkir]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - nama_penerima
 *               - nomor_telepon
 *               - alamat_lengkap
 *               - kota
 *               - provinsi
 *               - kode_pos
 *             properties:
 *               label:
 *                 type: string
 *                 example: Rumah
 *               nama_penerima:
 *                 type: string
 *                 example: Budi Santoso
 *               nomor_telepon:
 *                 type: string
 *                 example: "081234567890"
 *               alamat_lengkap:
 *                 type: string
 *                 example: Jl. Sudirman No. 10, RT 01/RW 02
 *               kota:
 *                 type: string
 *                 example: Bandung
 *               provinsi:
 *                 type: string
 *                 example: Jawa Barat
 *               kode_pos:
 *                 type: string
 *                 example: "40115"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: -6.917464
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 107.619123
 *               is_utama:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Berhasil menambahkan alamat baru
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Data alamat tidak lengkap atau tidak valid
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
 */
router.post('/', alamatController.tambahAlamat);

/**
 * @swagger
 * /alamat/cod/verifikasi:
 *   post:
 *     summary: Verifikasi apakah lokasi tujuan masuk dalam radius COD (maks 50 km dari gudang)
 *     tags: [Alamat & Ongkir]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destLat
 *               - destLng
 *             properties:
 *               destLat:
 *                 type: number
 *                 format: float
 *                 example: -6.917464
 *                 description: Latitude koordinat tujuan pengiriman
 *               destLng:
 *                 type: number
 *                 format: float
 *                 example: 107.619123
 *                 description: Longitude koordinat tujuan pengiriman
 *     responses:
 *       200:
 *         description: Hasil verifikasi jarak COD
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Parameter koordinat tidak lengkap
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
 */
router.post('/cod/verifikasi', alamatController.cekJarakCOD);

/**
 * @swagger
 * /alamat/ongkir/biteship:
 *   post:
 *     summary: Mendapatkan daftar tarif pengiriman dari berbagai kurir via Biteship API
 *     tags: [Alamat & Ongkir]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originAreaId
 *               - destinationAreaId
 *               - couriers
 *               - items
 *             properties:
 *               originAreaId:
 *                 type: string
 *                 example: IDNP22IDNC1536IDND31IDNS1471
 *                 description: ID area asal pengiriman (Biteship area ID)
 *               destinationAreaId:
 *                 type: string
 *                 example: IDNP4IDNC43IDND363IDNS4049
 *                 description: ID area tujuan pengiriman (Biteship area ID)
 *               couriers:
 *                 type: string
 *                 example: jne,jnt,sicepat
 *                 description: Kode kurir dipisahkan koma
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Laptop Gaming Pro X
 *                     value:
 *                       type: integer
 *                       example: 15000000
 *                     weight:
 *                       type: integer
 *                       example: 1500
 *                       description: Berat dalam gram
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar tarif pengiriman
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Parameter tidak lengkap atau Biteship API error
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
 */
router.post('/ongkir/biteship', alamatController.cekOngkirBiteship);

/**
 * @swagger
 * /alamat/{id}:
 *   put:
 *     summary: Memperbarui alamat pengiriman berdasarkan ID
 *     tags: [Alamat & Ongkir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID unik alamat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: Kantor
 *               nama_penerima:
 *                 type: string
 *                 example: Budi Santoso
 *               nomor_telepon:
 *                 type: string
 *                 example: "081234567890"
 *               alamat_lengkap:
 *                 type: string
 *                 example: Jl. Asia Afrika No. 5
 *               kota:
 *                 type: string
 *                 example: Bandung
 *               provinsi:
 *                 type: string
 *                 example: Jawa Barat
 *               kode_pos:
 *                 type: string
 *                 example: "40111"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: -6.921400
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 107.607000
 *               is_utama:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Berhasil memperbarui alamat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSukses'
 *       400:
 *         description: Data tidak valid
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
 *         description: Alamat tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.put('/:id', alamatController.updateAlamat);

/**
 * @swagger
 * /alamat/{id}:
 *   delete:
 *     summary: Menghapus alamat pengiriman berdasarkan ID
 *     tags: [Alamat & Ongkir]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID unik alamat
 *     responses:
 *       200:
 *         description: Berhasil menghapus alamat
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
 *         description: Alamat tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
router.delete('/:id', alamatController.hapusAlamat);

module.exports = router;

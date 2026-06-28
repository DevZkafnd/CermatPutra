const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - email
 *               - kata_sandi
 *             properties:
 *               nama:
 *                 type: string
 *                 example: Skye Tester
 *               email:
 *                 type: string
 *                 format: email
 *                 example: skye@contoh.com
 *               kata_sandi:
 *                 type: string
 *                 format: password
 *                 example: passwordSuperAman123
 *               nomor_telepon:
 *                 type: string
 *                 example: "081234567890"
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil
 *                 data:
 *                   $ref: '#/components/schemas/Pengguna'
 *       400:
 *         description: Validasi gagal atau email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *             examples:
 *               emailTerdaftar:
 *                 summary: Email sudah terdaftar
 *                 value:
 *                   status: error
 *                   message: Email sudah terdaftar
 *               validasiGagal:
 *                 summary: Field wajib kosong
 *                 value:
 *                   status: error
 *                   message: Nama, email, dan kata sandi wajib diisi
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - kata_sandi
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: skye@contoh.com
 *               kata_sandi:
 *                 type: string
 *                 format: password
 *                 example: passwordSuperAman123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     pengguna:
 *                       $ref: '#/components/schemas/Pengguna'
 *       400:
 *         description: Field wajib kosong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *             example:
 *               status: error
 *               message: Email dan kata sandi wajib diisi
 *       401:
 *         description: Email atau kata sandi salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 *             example:
 *               status: error
 *               message: Email atau kata sandi salah
 */
router.post('/login', login);

module.exports = router;

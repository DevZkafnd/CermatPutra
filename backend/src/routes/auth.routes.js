// Routes untuk autentikasi
const express = require('express');
const router = express.Router();

// Import controllers (akan dibuat nanti)
// const authController = require('../controllers/auth.controller');

// Routes
// POST /api/v1/auth/register - Registrasi pengguna baru
// router.post('/register', authController.register);

// POST /api/v1/auth/login - Login pengguna
// router.post('/login', authController.login);

// POST /api/v1/auth/logout - Logout pengguna
// router.post('/logout', authController.logout);

// GET /api/v1/auth/profile - Dapatkan profil pengguna
// router.get('/profile', verifikasiToken, authController.getProfile);

module.exports = router;

// Middleware untuk autentikasi JWT
const jwt = require('jsonwebtoken');

/**
 * Middleware untuk memverifikasi JWT token
 * Saya menggunakan ini untuk melindungi route yang memerlukan autentikasi
 */
const verifikasiToken = (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak ditemukan'
      });
    }
    
    const token = authHeader.substring(7); // Hapus 'Bearer '
    
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Simpan data user di request object
    req.pengguna = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token sudah expired'
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat verifikasi token'
    });
  }
};

/**
 * Middleware untuk memeriksa role pengguna
 * @param {Array} roleYangDiizinkan - Array role yang diperbolehkan akses
 */
const periksaRole = (...roleYangDiizinkan) => {
  return (req, res, next) => {
    if (!req.pengguna) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }
    
    if (!roleYangDiizinkan.includes(req.pengguna.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki akses ke resource ini'
      });
    }
    
    next();
  };
};

module.exports = {
  verifikasiToken,
  periksaRole
};

// Middleware untuk validasi input
// Saya menggunakan express-validator untuk validasi

const { validationResult } = require('express-validator');

/**
 * Middleware untuk memeriksa hasil validasi
 * Gunakan setelah validation rules di routes
 */
const periksaValidasi = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validasi gagal',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  periksaValidasi
};

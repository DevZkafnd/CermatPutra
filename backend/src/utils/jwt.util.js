// Utility untuk JWT token
// Saya menggunakan ini untuk generate dan verify token

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - Data yang akan di-encode dalam token
 * @param {String} expiresIn - Waktu expired (default: 24h)
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn
  });
};

/**
 * Verify JWT token
 * @param {String} token - Token yang akan diverifikasi
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

/**
 * Decode JWT token tanpa verifikasi
 * @param {String} token - Token yang akan di-decode
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};

// Utility untuk hashing password
// Saya menggunakan bcrypt untuk keamanan password

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hash password
 * @param {String} password - Password plain text
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password dengan hash
 * @param {String} password - Password plain text
 * @param {String} hash - Hashed password dari database
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};

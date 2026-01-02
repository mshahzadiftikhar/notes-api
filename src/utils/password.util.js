const bcrypt = require('bcrypt');

// SALT_ROUNDS defines the bcrypt cost factor (hashing complexity).
// Higher value = more secure but slower. bcrypt generates and stores the salt automatically.
const SALT_ROUNDS = 5;

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};
const { User } = require('../models');
const { hashPassword } = require('../utils/password.util');

const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
};

module.exports = {
  registerUser
};
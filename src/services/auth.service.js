const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/token.util');

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

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    userId: user.id
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};
const validateRegistration = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'email and password are required'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: 'password must be at least 8 characters long'
    });
  }

  next();
};

module.exports = {
  validateRegistration
};
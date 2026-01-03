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

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'email and password are required'
    });
  }

  next();
};

const validateNote = (req, res, next) => {
  const { title, content } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateNote
};
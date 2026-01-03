const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Authenticated user:', payload);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token: ' + err.message });
  }
};

module.exports = { authenticate };
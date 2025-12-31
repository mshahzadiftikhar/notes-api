const express = require('express');
const registerRoutes = require('./routes');

const app = express();

/**
 * Global Middlewares
 */
app.use(express.json());

/**
 * Routes
 */
registerRoutes(app);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
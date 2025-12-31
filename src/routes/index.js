const healthRoutes = require('./health.routes');

const registerRoutes = (app) => {
  app.use('/', healthRoutes);
};

module.exports = registerRoutes;
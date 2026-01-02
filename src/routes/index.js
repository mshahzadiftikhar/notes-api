const healthRoutes = require('./health.routes');
const authRoutes = require('./user.register.route');

const registerRoutes = (app) => {
  app.use('/', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
};

module.exports = registerRoutes;
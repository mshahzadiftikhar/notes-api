const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.route');
const notesRoutes = require('./notes.routes');

const registerRoutes = (app) => {
  app.use('/', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/notes', notesRoutes);
};

module.exports = registerRoutes;
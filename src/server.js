require('dotenv').config();

const app = require('./app');
const getSequelize = require('./config/database');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

if (!process.env.JWT_SECRET) {
  console.error('Missing required env: JWT_SECRET');
  process.exit(1);
}

const startServer = async () => {
  try {
    const sequelize = getSequelize();

    await sequelize.authenticate();
    console.log('Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
    });

    // graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      await sequelize.close();
      server.close(() => {
        console.log('Server closed');
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Error: ', error);
    process.exit(1);
  }
};

startServer();
const { Sequelize } = require('sequelize');

let sequelize;

const createSequelizeInstance = () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false, // disable SQL logs for now
      }
    );
  }

  return sequelize;
};

module.exports = createSequelizeInstance;
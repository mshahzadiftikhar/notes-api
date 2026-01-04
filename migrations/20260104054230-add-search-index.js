// add-fulltext-index-to-notes.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE notes
      ADD FULLTEXT INDEX notes_fulltext_idx (title, content)
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE notes
      DROP INDEX notes_fulltext_idx
    `);
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('note_versions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      note_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'notes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('note_versions', ['note_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('note_versions');
  }
};
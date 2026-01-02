const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Note extends Model {}

  Note.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'notes',
    modelName: 'Note',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  return Note;
};
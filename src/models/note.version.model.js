const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class NoteVersion extends Model {}

  NoteVersion.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    note_id: {
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
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'note_versions',
    modelName: 'NoteVersion',
    timestamps: false,
    underscored: true
  });

  return NoteVersion;
};
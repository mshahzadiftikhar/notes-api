const getSequelize = require('../config/database');
const sequelize = getSequelize();
const { Sequelize } = require('sequelize');

const User = require('./user.model')(sequelize);
const Note = require('./note.model')(sequelize);
const NoteVersion = require('./note.version.model')(sequelize);

// Associations
User.hasMany(Note, { foreignKey: 'user_id' });
Note.belongsTo(User, { foreignKey: 'user_id' });

Note.hasMany(NoteVersion, { foreignKey: 'note_id' });
NoteVersion.belongsTo(Note, { foreignKey: 'note_id' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Note,
  NoteVersion
};
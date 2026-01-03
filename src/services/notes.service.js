const { Note, NoteVersion } = require('../models');

const createNote = async ({ userId, title, content }) => {
  // Create note (models use snake_case column names: user_id)
  const note = await Note.create({
    user_id: userId,
    title,
    content
  });

  // Create first version (note_versions uses note_id)
  await NoteVersion.create({
    note_id: note.id,
    version: 1,
    title,
    content
  });

  return note;
};

const getAllNotes = async (userId, fields = ['id', 'title', 'content']) => {
    return await Note.findAll({
        where: { user_id: userId },
        attributes: fields,
        order: [['updatedAt', 'DESC']]
    });
};

module.exports = { createNote, getAllNotes };
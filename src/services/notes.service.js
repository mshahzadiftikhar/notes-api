const { Note, NoteVersion, Sequelize } = require('../models');

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

const getAllNotes = async (userId, fields = ['id', 'title', 'content', 'version']) => {
    return await Note.findAll({
        where: { user_id: userId, deleted_at: null },
        attributes: fields,
        order: [['updatedAt', 'DESC']]
    });
};

const getNoteById = async ({ noteId, userId }) => {
  // Fetch note and ensure it exists (soft delete check)
  const note = await Note.findOne({
    where: {
      id: noteId,
      user_id: userId,
      deleted_at: null
    }
  });

  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }

  // Fetch all versions
  const versions = await NoteVersion.findAll({
    where: { note_id: noteId },
    order: [['version', 'DESC']]
  });

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    userId: note.userId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    versions: versions.map(v => ({
      version: v.version,
      title: v.title,
      content: v.content,
    }))
  };
};

const softDeleteNote = async ({ noteId, userId }) => {
    const note = await Note.findOne({
        where: { id: noteId, user_id: userId, deleted_at: null }
    });

    if (!note) {
        const error = new Error('Note not found');
        error.statusCode = 404;
        throw error;
    }

    await note.destroy(); // Soft delete because we have set paranoid to true in model

    return { message: 'Note deleted successfully' };
};

const searchNotesByKeyword = async ({ userId, keyword }) => {
  return await Note.findAll({
    where: {
      user_id: userId,
      deleted_at: null,
      [Sequelize.Op.and]: Sequelize.literal(
        `MATCH (title, content) AGAINST (:keyword IN NATURAL LANGUAGE MODE)`
      )
    },
    replacements: { keyword },
    order: [['updated_at', 'DESC']]
  });
};

const updateNote = async ({ noteId, userId, title, content, version }) => {
  const note = await Note.findOne({ where: { id: noteId, user_id: userId, deletedAt: null } });

  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }

  // Check optimistic lock (version)
  if (note.version !== version) {
    const error = new Error('Concurrent update detected. Please refresh and try again.');
    error.statusCode = 409;
    throw error;
  }

    // Merge fields: only update what is provided
  if (title === undefined)
     title = note.title;

  if (content === undefined)
    content = note.content;

  const newVersion = note.version + 1;

  // Update note
  note.title = title;
  note.content = content;
  note.version = newVersion;
  await note.save();

  // Insert into version history
  await NoteVersion.create({
    note_id: note.id,
    title,
    content,
    version: newVersion
  });

  return note;
};

module.exports = { createNote, getAllNotes, getNoteById, softDeleteNote, searchNotesByKeyword, updateNote };
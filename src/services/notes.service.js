const { Note, NoteVersion, Sequelize } = require('../models');
const redis = require('../config/redis')();

// Cache TTL (time to live) in seconds
const CACHE_TTL = process.env.CACHE_TTL || 120;

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

  await invalidateCache(userId);

  return note;
};

const getAllNotes = async (userId, fields = ['id', 'title', 'content', 'version', 'createdAt', 'updatedAt']) => {

    const cacheKey = `notes:user:${userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const notes = await Note.findAll({
        where: { user_id: userId, deleted_at: null },
        attributes: fields,
        order: [['updatedAt', 'DESC']]
    });

    await redis.set(cacheKey, JSON.stringify(notes), 'EX', CACHE_TTL);
    return notes;
};

const getNoteById = async ({ noteId, userId }) => {
  const cacheKey = `note:${noteId}:user:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

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

  const versions = await NoteVersion.findAll({
    where: { note_id: noteId },
    order: [['version', 'DESC']]
  });

  const response = {
    id: note.id,
    title: note.title,
    content: note.content,
    userId: note.user_id,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    versions: versions.map(v => ({
      version: v.version,
      title: v.title,
      content: v.content
    }))
  };

  await redis.set(
    cacheKey,
    JSON.stringify(response),
    'EX',
    CACHE_TTL
  );

  return response;
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

    await invalidateCache(userId, noteId);

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

  await invalidateCache(userId, noteId);

  return note;
};

const revertNote = async ({ noteId, userId, targetVersion, currentVersion }) => {
  const note = await Note.findOne({
    where: { id: noteId, user_id: userId, deletedAt: null }
  });

  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }

  if (note.version !== currentVersion) {
    const error = new Error('Concurrent update detected');
    error.statusCode = 409;
    throw error;
  }

  const versionToRevert = await NoteVersion.findOne({
    where: { note_id: noteId, version: targetVersion }
  });

  if (!versionToRevert) {
    const error = new Error('Requested version not found');
    error.statusCode = 404;
    throw error;
  }

  const newVersion = note.version + 1;

  note.title = versionToRevert.title;
  note.content = versionToRevert.content;
  note.version = newVersion;

  await note.save();

  await NoteVersion.create({
    note_id: note.id,
    title: note.title,
    content: note.content,
    version: newVersion
  });

  await invalidateCache(userId, noteId);

  return note;
};

async function invalidateCache(userId, noteId) {
  if (noteId) {
    await redis.del(`note:${noteId}:user:${userId}`);
  }
  await redis.del(`notes:user:${userId}`);
}

module.exports = { createNote, getAllNotes, getNoteById, softDeleteNote, searchNotesByKeyword, updateNote, revertNote, invalidateCache };
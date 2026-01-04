const { createNote, getAllNotes, getNoteById, softDeleteNote, searchNotesByKeyword } = require('../services/notes.service');

const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await createNote({
      userId: req.user.id,
      title,
      content
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const notes = await getAllNotes(req.user.id);
    res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const note = await getNoteById({
      noteId: req.params.id,
      userId: req.user.id
    });
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};


const deleteNote = async (req, res, next) => {
  try {
    const result = await softDeleteNote({
      noteId: req.params.id,
      userId: req.user.id
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const searchNotes = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: `Search 'query' is required. Example: /api/v1/notes/search?query=meeting`
      });
    }

    const notes = await searchNotesByKeyword({
      userId: req.user.id,
      keyword: query
    });

    res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, deleteNote, searchNotes };
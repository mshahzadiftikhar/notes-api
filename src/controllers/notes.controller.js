const { createNote, getAllNotes } = require('../services/notes.service');

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

module.exports = { create, getAll };
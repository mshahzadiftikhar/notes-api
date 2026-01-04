const express = require('express');
const router = express.Router();
const { create, getAll, getById, deleteNote, searchNotes, update, revert } = require('../controllers/notes.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateNote } = require('../middlewares/validation.middleware');

router.post('/', authenticate, validateNote, create);
router.get('/', authenticate, getAll);
router.get('/search', authenticate, searchNotes);
router.get('/:id', authenticate, getById);
router.delete('/:id', authenticate, deleteNote);
router.put('/:id', authenticate, update);
router.post('/:id/revert', authenticate, revert);

module.exports = router;
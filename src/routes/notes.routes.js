const express = require('express');
const router = express.Router();
const { create, getAll, getById } = require('../controllers/notes.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateNote } = require('../middlewares/validation.middleware');

router.post('/', authenticate, validateNote, create);
router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);

module.exports = router;
const express = require('express');
const router = express.Router();
const { create, getAll } = require('../controllers/notes.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateNote } = require('../middlewares/validation.middleware');

router.post('/', authenticate, validateNote, create);
router.get('/', authenticate, getAll);

module.exports = router;
const express = require('express');
const router = express.Router();

const { register } = require('../controllers/user.register.controller');
const { validateRegistration } = require('../middlewares/validation.middleware');

router.post('/register', validateRegistration, register);

module.exports = router;
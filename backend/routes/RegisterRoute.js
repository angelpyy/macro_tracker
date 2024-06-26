const express = require('express');
const router = express.Router();

const { validate, register } = require('../controllers/AuthController');

router.post('/register', validate, register);

module.exports = router;
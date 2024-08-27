const express = require('express');
const router = express.Router();

const { validate, login } = require('../controllers/AuthController');

router.post('/', validate, login);

module.exports = router;
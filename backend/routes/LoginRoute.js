const express = require('express');
const router = express.Router();

const { validate, login } = require('../controllers/AuthController');

router.post('/login', validate, login);


module.exports = router;
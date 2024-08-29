const express = require('express');
const router = express.Router();
const path = require('path');

const authController = require(path.join(__dirname, '..', 'controllers', 'AuthController'));
const userController = require(path.join(__dirname, '..', 'controllers', 'UserController'));
const authMiddleware = require(path.join(__dirname, '..', 'middleware', 'AuthMiddleware'));

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/user', authMiddleware, userController.getUserData);
router.get('/meals', authMiddleware, userController.getUserMeals);

module.exports = router;
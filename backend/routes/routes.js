const express = require('express');
const router = express.Router();
const path = require('path');

const authController = require(path.join(__dirname, '..', 'controllers', 'AuthController'));
const userController = require(path.join(__dirname, '..', 'controllers', 'UserController'));
const authMiddleware = require(path.join(__dirname, '..', 'middleware', 'AuthMiddleware'));

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route get requests
router.get('/user', authMiddleware, userController.getUserData);
router.get('/meals', authMiddleware, userController.getUserMeals);
router.get('/targets', authMiddleware, userController.getUserTargets);

// Protected route post requests
router.post('/meals', authMiddleware, userController.saveUserMeals);

// backend/routes/routes.js
router.put('/meals/:mealId', authMiddleware, userController.updateMealName);

module.exports = router;
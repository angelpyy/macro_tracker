const express = require('express');
const router = express.Router();
const path = require('path');

const authController = require(path.join(__dirname, '..', 'controllers', 'AuthController'));
const userController = require(path.join(__dirname, '..', 'controllers', 'UserController'));
const authMiddleware = require(path.join(__dirname, '..', 'middleware', 'AuthMiddleware'));
const foodController = require(path.join(__dirname, '..', 'controllers', 'FoodController'));

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route get requests
router.get('/user', authMiddleware, userController.getUserData);
router.get('/meals', authMiddleware, userController.getUserMeals);
router.get('/targets', authMiddleware, userController.getUserTargets);

// Protected route post requests
router.post('/meals', authMiddleware, userController.saveUserMeals);
router.post('/targets', authMiddleware, userController.saveUserTargets);

// backend/routes/routes.js
router.put('/meals/:mealId', authMiddleware, userController.updateMealName);

// Food routes ts, control my food ts
router.get('/foods', foodController.getAllFoods);
router.post('/foods', authMiddleware, foodController.addFood);
router.put('/foods/:foodId', authMiddleware, foodController.updateFood);
router.delete('/foods/:foodId', authMiddleware, foodController.deleteFood);

module.exports = router;
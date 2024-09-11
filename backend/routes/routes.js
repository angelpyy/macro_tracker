const express = require('express');
const router = express.Router();
const path = require('path');

const authController = require(path.join(__dirname, '..', 'controllers', 'AuthController'));
const userController = require(path.join(__dirname, '..', 'controllers', 'UserController'));
const authMiddleware = require(path.join(__dirname, '..', 'middleware', 'AuthMiddleware'));
const foodController = require(path.join(__dirname, '..', 'controllers', 'FoodController'));


// Login and Registration Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Get User Data: Username/Password
router.get('/user', authMiddleware, userController.getUserData);

// Get User Macro Targets
// TODD: Consider just slotting this with getUserData
router.get('/targets', authMiddleware, userController.getUserTargets);

// Update the User Macro Targets
router.post('/targets', authMiddleware, userController.saveUserTargets);

// NO ISSUES WITH THIS AS OF YET
// Food routes ts, control my food ts
router.get('/foods', foodController.getAllFoods);
router.post('/foods', authMiddleware, foodController.addFood);
router.put('/foods/:foodId', authMiddleware, foodController.updateFood);
router.delete('/foods/:foodId', authMiddleware, foodController.deleteFood);

// GET user meals
router.get('/fetchMeals', authMiddleware, userController.getUserMeals);

// PUT user meals
router.put('/addMeal', authMiddleware, userController.addMealtoDailyMeals);

module.exports = router;
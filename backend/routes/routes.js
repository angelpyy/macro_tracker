const express = require('express');
const router = express.Router();
const path = require('path');

const authController = require(path.join(__dirname, '..', 'controllers', 'AuthController'));
const userController = require(path.join(__dirname, '..', 'controllers', 'userController'));
const authMiddleware = require(path.join(__dirname, '..', 'controllers', 'authMiddleware'));

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/user', authMiddleware, userController.getUserData);
router.get('/meals', authMiddleware, userController.getUserMeals);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/AuthController');
// const userController = require('../controllers/userController');
// const authMiddleware = require('../controllers/authMiddleware');

// router.post('/register', authController.register);
// router.post('/login', authController.login);

// // protected routes
// router.get('/user', authMiddleware, userController.getUser);
// router.get('/meals', authMiddleware, userController.getMeals);

// module.exports = router;
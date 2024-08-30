const User = require("../models/User");
const DailyMeals = require("../models/DailyMeals");

exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user data', error: error.message });
    }
};

exports.getUserMeals = async (req, res) => {
    try {
        const { date } = req.query;
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);

        const meals = await DailyMeals.findOne({
            user: req.user._id,
            date:{
                $gte: parsedDate,
                $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
            },
        });
        
        console.log('[UserController.js/getUserMeals] | req.user: ', req.user._id, ' | req.query: ', req.query);
        console.log('[UserController.js/getUserMeals] | meals: ', meals);

        res.json(meals ? meals.meals : []);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user meals', error: error.message });
    }
};

exports.getUserTargets = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.macroTargets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user targets', error: error.message });
    }
};

exports.saveUserMeals = async (req, res) => {
    try {
        const { date, meals } = req.body;
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);

        const updateDailyMeals = await DailyMeals.findOneAndUpdate(
            {
                user: req.user._id,
                date: parsedDate,
            },
            {
                $set: { meals:meals }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
        res.status(200).json({ message: 'User meals saved', dailyMeals: updateDailyMeals });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save user meals', error: error.message });
    }
};
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
        const meals = await DailyMeals.find({ user: req.user._id, date });
        res.json(meals || { meals: [] });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user meals', error: error.message });
    }
};
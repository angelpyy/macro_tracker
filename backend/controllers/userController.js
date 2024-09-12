const User = require("../models/User");
const DailyMeals = require("../models/DailyMeals");
const Meal = require("../models/Meal");
const Food = require("../models/Food"); // Make sure to import the Food model

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

        const dailyMeals = await DailyMeals.findOne({
            user: req.user._id,
            date:{
                $gte: parsedDate,
                $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
            },
        }).populate('meals.meal');  // Populate the meal field with the meal document

        const formattedMeals = dailyMeals
        ? dailyMeals.meals.map(mealData => ({
            _id: mealData.meal._id,
            name: mealData.meal.name,
            foods: mealData.meal.foods.map(foodData => ({
                _id: foodData._id,
                food: {
                    _id: foodData.food._id,
                    name: foodData.food.name,
                    nutrients: foodData.food.nutrients
                },
                servings: foodData.servings
            }))
        }))
        : [];

    res.json(formattedMeals);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get user meals', error: error.message });
    }
};

exports.updateMealName = async (req, res) => {
    try {
        const { mealId } = req.params;
        const { name } = req.body;
        const userId = req.user._id;

        const updatedMeal = await DailyMeals.findOneAndUpdate(
            { "meals._id": mealId, user: userId },
            { $set: { "meals.$.name": name } },
            { new: true }
        );

        if (!updatedMeal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        res.json({ message: "Meal name updated successfully", meal: updatedMeal });
    } catch (error) {
        res.status(500).json({ message: "Error updating meal name", error: error.message });
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

exports.saveUserTargets = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { macroTargets: req.body } },
            { new: true }
        );
        res.json(user.macroTargets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save user targets', error: error.message });
    }
};

exports.addMealtoDailyMeals = async (req, res) => {
    try {
        // Get date and user from the request
        const userId = req.user._id;
        const { date, meal } = req.body;
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);

        console.log('attepting findOne', parsedDate, meal, userId);
        console.log('~'.repeat(50));

        // Try to find the corresponding daily meal
        let dailyMeals = await DailyMeals.findOne({
            user: userId,
            date: {
                $gte: parsedDate,   // Greater than or equal to the start of the day
                $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),  // Less than the end of the day
            },
        });
        

        // If the daily meal does not exists, add the meal to it
        if (!dailyMeals) {
            dailyMeals = new DailyMeals({ user: req.user._id, date: parsedDate, meals: [] });
        }

        if (!meal._id) {
            const newMeal = new Meal(meal);
            await newMeal.save();
            meal._id = newMeal._id;
        }

        console.log(dailyMeals);
        console.log('~'.repeat(50));
        console.log(meal);
        console.log('~'.repeat(50));

        dailyMeals.meals.push({ meal: meal._id });
        await dailyMeals.save();
        res.json(dailyMeals);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to add meal to daily meals', error: error.message });
    }
};


const User = require("../models/User");
const DailyMeals = require("../models/DailyMeals");
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
        }).populate({
            path:'meals.foods.food',
            model: Food,
        });

        console.log(dailyMeals);
        res.json(dailyMeals ? dailyMeals.meals : []);
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

        let dailyMeals = await DailyMeals.findOne({ 
            user: req.user._id, 
            date: {
                $gte: parsedDate,
                $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
            }
        });

        if (!dailyMeals) {
            dailyMeals = new DailyMeals({ user: req.user._id, date: parsedDate, meals: [] });
        }

        await dailyMeals.save();   
        res.json(dailyMeals);
    } catch (error) {
        console.log('Error saving meals:', error.message);
        res.status(400).json({ message: 'Error saving meals', error: error.message });
    }
};

exports.pushFoodToMeal = async (req, res) => {
    try {
        const { mealId, foodId, servings, date } = req.body;
        const userId = req.user._id;

        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);

        let dailyMeals = await DailyMeals.findOne({ 
            user: userId, 
            date: {
                $gte: parsedDate,
                $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
            }
        });

        if (!dailyMeals) {
            console.log('Daily meals not found for this date');
            return res.status(404).json({ message: "Daily meals not found for this date" });
        }

        const meal = dailyMeals.meals._id(mealId);
        if (!meal) {
            console.log('Meal not found');
            return res.status(404).json({ message: "Meal not found" });
        }

        meal.foods.push({
            food: foodId,
            servings: servings
        });

        await dailyMeals.save();

        // Populate the food details before sending the response
        await dailyMeals.populate('meals.foods.food');

        res.json(meal);
    } catch (error) {
        console.log('Error adding food to meal:', error.message);
        res.status(500).json({ message: "Error adding food to meal", error: error.message });
    }
};

exports.updateFoodInMeal = async (req, res) => {
    try {
        const { mealId, foodId, servings, date, currentFoodId } = req.body;
        const userId = req.user._id;

        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);

        let dailyMeals = await DailyMeals.findOne({ 
            user: userId, 
            date: {
                $gte: parsedDate,
                $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
            }
        });

        if (!dailyMeals) {
            return res.status(404).json({ message: "Daily meals not found for this date" });
        }

        const meal = dailyMeals.meals.id(mealId);
        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        const foodIndex = meal.foods.findIndex(f => f._id.toString() === currentFoodId);
        if (foodIndex === -1) {
            return res.status(404).json({ message: "Food not found in meal" });
        }

        meal.foods[foodIndex] = {
            food: foodId,
            servings: servings
        };

        await dailyMeals.save();

        // Populate the food details before sending the response
        await dailyMeals.populate('meals.foods.food');

        res.json(meal);
    } catch (error) {
        res.status(500).json({ message: "Error updating food in meal", error: error.message });
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

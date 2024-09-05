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
        const userId = req.user._id;

        let dailyMeals = await DailyMeals.findOne({ user: userId, date });

        if (!dailyMeals) {
            dailyMeals = new DailyMeals({ user: userId, date, meals: [] });
        }

        for (let meal of meals) {
            const newMeal = { name: meal.name, foods: [] };
            for (let foodItem of meal.foods) {
                const food = await Food.findById(foodItem.food);
                if (!food) {
                    return res.status(404).json({ message: `Food not found: ${foodItem.food}` });
                }

                const amount = foodItem.amount;
                const ratio = amount.value / food.servingSize.value;

                const calculatedNutrients = {
                    calories: food.nutrients.calories * ratio,
                    fats: food.nutrients.fats * ratio,
                    carbs: food.nutrients.carbs * ratio,
                    protein: food.nutrients.protein * ratio,
                };

                newMeal.foods.push({
                    food: food._id,
                    amount,
                    calculatedNutrients,
                });
            }
            dailyMeals.meals.push(newMeal);
        }

        await dailyMeals.save();
        res.json(dailyMeals);
    } catch (error) {
        res.status(400).json({ message: 'Error saving meals', error: error.message });
    }
};

exports.updateMealName = async (req, res) => {
    try {
        const { mealId } = req.params;
        const { name } = req.body;
        const userId = req.user._id;

        // debug
        console.log('Updating meal:', req.params.mealId, 'with name:', req.body.name);

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

const mongoose = require('mongoose');

const DailyMealsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    meals: [{
        name: {
            type: String,
            default: "Meal",
        },
        foods: [{
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true,
            },
            amount: {
                value: Number,
                unit: String,
            },
            calculatedNutrients: {
                calories: Number,
                fats: Number,
                carbs: Number,
                protein: Number,
            },
        }]
    }],
});

module.exports = mongoose.model("DailyMeals", DailyMealsSchema);
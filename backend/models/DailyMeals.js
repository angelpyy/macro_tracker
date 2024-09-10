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
            servings: {
                type: Number,
                required: true,
                default: 1,
            },
        }]
    }],
});

module.exports = mongoose.model("DailyMeals", DailyMealsSchema);
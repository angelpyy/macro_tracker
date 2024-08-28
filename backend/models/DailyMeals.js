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
        name: String,
        foods: [{
            name: String,
            calories: Number,
            fats: Number,
            carbs: Number,
            protein: Number,
            servingSize: Number,
            servings: Number,
        }],
    }],
});

module.exports = mongoose.model("DailyMeals", DailyMealsSchema);
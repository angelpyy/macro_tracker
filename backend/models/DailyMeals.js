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
        meal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
    }],
});

module.exports = mongoose.model("DailyMeals", DailyMealsSchema);
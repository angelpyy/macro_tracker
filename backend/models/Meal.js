const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Meal", MealSchema);
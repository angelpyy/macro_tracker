const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    fats: {
        type: Number,
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    servingSize: {
        type: Number,
        required: true,
    },
    servings: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: false,
    },
});

module.exports = mongoose.model('Food', FoodSchema);
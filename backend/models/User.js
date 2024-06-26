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

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    foods: [FoodSchema],  // Use FoodSchema directly here
});

module.exports = {
    Food: mongoose.model('Food', FoodSchema),
    User: mongoose.model('User', UserSchema),
};

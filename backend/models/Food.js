const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        default: "Generic",
    },
    servingSize: {
        value: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
            enum: ["g", "oz", "ml", "fl oz", "cup", "tbsp", "tsp", "mL", "L", "pieces", "serving"],
        },
    },
    nutrients: {
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
    },
});

module.exports = mongoose.model("Food", FoodSchema);
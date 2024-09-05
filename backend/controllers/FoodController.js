const Food = require('../models/Food');

exports.getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching foods', error: error.message });
    }
};

exports.addFood = async (req, res) => {
    try {
        const newFood = new Food(req.body);
        await newFood.save();
        response.status(201).json(newFood);
    } catch (error) {
        res.status(400).json({ message: 'Error adding food', error: error.message });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const updateFood = await Food.findByIdAndUpdate(req.params.foodId, req.body, { new: true });
        res.json(updateFood);
    } catch (error) {
        res.status(400).json({ message: 'Error updating food', error: error.message });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.foodId);
        res.json({ message: 'Food deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting food', error: error.message });
    }
};
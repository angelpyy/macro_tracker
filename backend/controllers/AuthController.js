require('dotenv').config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token  = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Login Failed', error: error.message });
  }
};

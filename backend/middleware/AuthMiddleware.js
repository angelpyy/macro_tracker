require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded.userId);
    
        console.log('[AuthMiddleware.js/authMiddleware] | req.header: ', req.header('Authorization'));
        console.log('[AuthMiddleware.js/authMiddleware] | user: ', user.username, ' | user_id: ', user._id);
        
        if (!user) {
            throw new Error();
        }
    
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate', error: error.message });
    }
};

module.exports = authMiddleware;
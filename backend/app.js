require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;
const URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Use routes
app.use('/', routes);

// Connect to MongoDB
mongoose.connect(URI)
    .then(() => {
        console.log('MongoDB connection established successfully!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });
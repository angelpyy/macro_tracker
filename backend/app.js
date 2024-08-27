require('dotenv').config();
const PORT = process.env.EXPRESS_PORT;
const URI = process.env.MONGO_URI; 
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Import Routes ?
const login = require('./routes/LoginRoute.js');
const register = require('./routes/RegisterRoute.js');

app.use('/login', login);
app.use('/register', register);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// connect to mongodb
const connectionString = URI;
mongoose.connect(connectionString).catch((err) => console.log(err));

mongoose.connection.once('open',() => {
    console.log('MongoDB connection established successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
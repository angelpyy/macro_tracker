const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());

require('dotenv').config();
const PORT = process.env.EXPRESS_PORT;
const URI = process.env.MONGO_URI; 

// connect to mongodb
const connectionString = URI;
mongoose.connect(connectionString).catch((err) => console.log(err));

mongoose.connection.once('open',() => {
    console.log('MongoDB connection established successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})








app.get('/', (req, res) => {
    res.send('Hello, world!');
});
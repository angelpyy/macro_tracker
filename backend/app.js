const express = require('express');
const app = express();
const PORT = 3000; // Use any port appropriate for your setup

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
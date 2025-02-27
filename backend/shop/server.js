const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('frontend/shop'));

app.get('/api/products', (req, res) => {
    fs.readFile('backend/data/products.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(port, () => {
    console.log(`Shop server running at http://localhost:${port}`);
});

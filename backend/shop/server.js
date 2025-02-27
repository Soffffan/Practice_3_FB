const express = require('express');
const fs = require('fs');
const path = require('path');  
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'index.html')));

app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'products.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Shop server running at http://localhost:${port}`);
});

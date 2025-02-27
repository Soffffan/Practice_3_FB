const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.json());

app.get('/api/products', (req, res) => {
    fs.readFile('backend/data/products.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/products', (req, res) => {
    const newProducts = req.body;
    fs.readFile('backend/data/products.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            const products = JSON.parse(data);
            products.push(...newProducts);
            fs.writeFile('backend/data/products.json', JSON.stringify(products, null, 2), err => {
                if (err) {
                    res.status(500).send('Error writing products file');
                } else {
                    res.status(201).send('Products added');
                }
            });
        }
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    fs.readFile('backend/data/products.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            let products = JSON.parse(data);
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = updatedProduct;
                fs.writeFile('backend/data/products.json', JSON.stringify(products, null, 2), err => {
                    if (err) {
                        res.status(500).send('Error writing products file');
                    } else {
                        res.status(200).send('Product updated');
                    }
                });
            } else {
                res.status(404).send('Product not found');
            }
        }
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('backend/data/products.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            let products = JSON.parse(data);
            products = products.filter(p => p.id !== id);
            fs.writeFile('backend/data/products.json', JSON.stringify(products, null, 2), err => {
                if (err) {
                    res.status(500).send('Error writing products file');
                } else {
                    res.status(200).send('Product deleted');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Admin server running at http://localhost:${port}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8080;

app.use(express.json());

// Обслуживание статических файлов из текущей папки
app.use(express.static(path.join(__dirname, '.')));

// Функция для генерации нового ID
function generateNewId(products) {
    return (Math.max(...products.map(p => parseInt(p.id))) + 1).toString();
}

// Маршрут для получения товаров
app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'shop', 'products.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Маршрут для добавления товаров
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    fs.readFile(path.join(__dirname, '..', 'shop', 'products.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            const products = JSON.parse(data);
            newProduct.id = generateNewId(products);
            products.push(newProduct);
            fs.writeFile(path.join(__dirname, '..', 'shop', 'products.json'), JSON.stringify(products, null, 2), err => {
                if (err) {
                    res.status(500).send('Error writing products file');
                } else {
                    res.status(201).send('Product added');
                }
            });
        }
    });
});

// Маршрут для редактирования товара
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    fs.readFile(path.join(__dirname, '..', 'shop', 'products.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            let products = JSON.parse(data);
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = updatedProduct;
                fs.writeFile(path.join(__dirname, '..', 'shop', 'products.json'), JSON.stringify(products, null, 2), err => {
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

// Маршрут для удаления товара
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(path.join(__dirname, '..', 'shop', 'products.json'), (err, data) => {
        if (err) {
            res.status(500).send('Error reading products file');
        } else {
            let products = JSON.parse(data);
            products = products.filter(p => p.id !== id);
            fs.writeFile(path.join(__dirname, '..', 'shop', 'products.json'), JSON.stringify(products, null, 2), err => {
                if (err) {
                    res.status(500).send('Error writing products file');
                } else {
                    res.status(200).send('Product deleted');
                }
            });
        }
    });
});

// Маршрут для отображения панели администратора
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Admin server running at http://localhost:${port}`);
});

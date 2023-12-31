const express = require('express');
const app = express();
const port = 8080;
const productRouter = require('../routes/product.router.js');
const cartRouter = require('../routes/cart.router.js');

const ProductManager = require('../models/ProductManager.js');
const productManager = new ProductManager('./products.json');

app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log("Go to http://localhost:8080/api/products to see all products.");
    console.log("Go to http://localhost:8080/api/carts/:cid to view the contents of a cart.");
});

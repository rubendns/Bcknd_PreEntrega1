const express = require("express");
const productRouter = express.Router();
const ProductManager = require("../models/ProductManager");

const productManager = new ProductManager("../products.json");

productRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = await productManager.getProducts();

        if (limit) {
        products = products.slice(0, limit);
        }

        res.send({ products });
    } catch (error) {
        console.error("Error getting products:", error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
    });

    productRouter.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
    });

    productRouter.post("/", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.send(newProduct);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
    });

    productRouter.put("/:pid", async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(
        req.params.pid,
        req.body
        );
        res.send(updatedProduct);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
    });

    productRouter.delete("/:pid", async (req, res) => {
    try {
        console.log(req.params.pid);
        await productManager.deleteProduct(req.params.pid);
        res.send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

module.exports = productRouter;

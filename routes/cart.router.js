const express = require("express");
const cartsRouter = express.Router();
const CartManager = require("../models/CartManager.js");

const cartManager = new CartManager('../carts.json');

cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.addCart(req.body);
        res.send(newCart);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
    });

    cartsRouter.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.send({ products: cart.products });
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
    });

    cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        res.send(updatedCart);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = cartsRouter;

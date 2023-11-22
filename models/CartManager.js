const fs = require("fs").promises;
const Cart = require("./Cart");

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
        this.loadCarts();
    }

    async loadCarts() {
        try {
        await fs.access(this.path);
        const data = await fs.readFile(this.path, "utf8");
        this.carts = JSON.parse(data);
        console.log("Carts loaded successfully.");
        } catch (error) {
        if (error.code === "ENOENT") {
            console.log("File not found:", this.path);
        } else {
            console.error("Error loading carts:", error.message);
            this.carts = [];
        }
        }
    }

    async saveCarts() {
        const data = JSON.stringify(this.carts, null, 2);
        await fs.writeFile(this.path, data);
    }

    addCart(cartData) {
        const { products } = cartData;
        const id = this.generateUniqueID();
        const newCart = new Cart(id, products);
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(cartId) {
        const cart = this.carts.find((cart) => cart.id == cartId);
        if (!cart) {
        throw new Error("Cart not found");
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId);
        const existingProduct = cart.products.find(
        (product) => product.id === productId
        );

        if (existingProduct) {
        existingProduct.quantity += quantity;
        } else {
        cart.products.push({ id: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }

    generateUniqueID() {
        const maxId = this.carts.reduce(
        (max, cart) => (cart.id > max ? cart.id : max),
        0
        );
        return maxId + 1;
    }
}

module.exports = CartManager;

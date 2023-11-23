const fs = require("fs").promises;
const Product = require("./Products.js");
const path = require("path");

class ProductManager {
    constructor(filePath) {
        this.path = path.join(__dirname, "../products.json");
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
        await fs.access(this.path);
        const data = await fs.readFile(this.path, "utf8");
        this.products = JSON.parse(data);
        } catch (error) {
        if (error.code === "ENOENT") {
            console.log("File not found:", this.path);
        } else {
            console.error("Error loading products:", error.message);
            this.products = [];
        }
        }
    }

    async saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, data);
    }

    addProduct(productData) {
        const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status = true,
        } = productData;

        if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        stock === undefined ||
        isNaN(price) ||
        price <= 0
        ) {
        throw new Error(
            "Invalid product data. Please provide valid information."
        );
        }

        if (this.isProductCodeDuplicate(code)) {
        throw new Error("Product code already exists");
        }

        const id = this.generateUniqueID();
        const newProduct = new Product(
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status
        );
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    isProductCodeDuplicate(code) {
        return this.products.some((product) => product.code === code);
    }

    generateUniqueID() {
        const maxId = this.products.reduce(
        (max, product) => (product.id > max ? product.id : max),
        0
        );
        return maxId + 1;
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const product = this.products.find((product) => product.id == productId);
        if (!product) {
        throw new Error("Product not found");
        }
        return product;
    }

    async updateProduct(id, newProduct) {
        const productId = parseInt(id, 10);
        const productIndex = this.products.findIndex(
        (product) => product.id === productId
        );

        if (productIndex !== -1) {
        const existingProduct = this.products[productIndex];

        if (
            newProduct.code &&
            newProduct.code !== existingProduct.code &&
            this.isProductCodeDuplicate(newProduct.code)
        ) {
            throw new Error("Product code already exists");
        }

        Object.assign(existingProduct, newProduct);
        this.products[productIndex] = existingProduct;
        await this.saveProducts();
        return existingProduct;
        } else {
        throw new Error("Product not found");
        }
    }

    async deleteProduct(productId) {
        const productIdInt = parseInt(productId, 10);

        const index = this.products.findIndex(
        (product) => product.id === productIdInt
        );

        if (index !== -1) {
        this.products.splice(index, 1);
        await this.saveProducts();
        } else {
        throw new Error("Product not found");
        }
    }
}

module.exports = ProductManager;

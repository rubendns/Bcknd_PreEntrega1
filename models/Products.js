class Product {
    constructor(id, title, description, price, thumbnail, code, stock, status=true) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
    }
}

module.exports = Product;

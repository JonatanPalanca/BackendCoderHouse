const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.loadProducts();
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      throw new Error("El código del producto ya está en uso.");
    }

    const newProduct = {
      id: this.getNextProductId(),
      ...product,
    };
    this.products.push(newProduct);

    this.saveProducts();

    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
    };

    this.saveProducts();

    return this.products[productIndex];
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }

    this.products.splice(productIndex, 1);

    this.saveProducts();
  }

  getNextProductId() {
    const maxId = this.products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
  }
}

module.exports = ProductManager;

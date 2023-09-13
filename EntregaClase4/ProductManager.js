const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async addProduct(product) {
    const products = await this.getProducts();

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

    const existingProduct = products.find((p) => p.code === product.code);
    if (existingProduct) {
      throw new Error("El código del producto ya está en uso.");
    }

    const newProduct = {
      id: this.getNextProductId(products),
      ...product,
    };

    products.push(newProduct);

    await this.saveProducts(products);

    return newProduct;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();

    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }

    return product;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updatedFields,
    };

    await this.saveProducts(products);

    return products[productIndex];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }

    products.splice(productIndex, 1);

    await this.saveProducts(products);
  }

  getNextProductId(products) {
    const maxId = products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }

  async saveProducts(products) {
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(products, null, 2)
    );
  }
}

module.exports = ProductManager;

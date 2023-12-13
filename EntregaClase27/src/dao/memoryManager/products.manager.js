export default class ProductsManagerInMemory {
  constructor() {
    this.products = [];
  }

  async getAll() {
    return this.products;
  }

  async getProductById(id) {
    return this.products.find((product) => product._id === id);
  }

  async create(product) {
    this.products.push(product);
    return product;
  }

  async update(pid, updatedFields) {
    const index = this.products.findIndex((product) => product._id === pid);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      return this.products[index];
    }
    throw new Error("Product not found");
  }

  async delete(pid) {
    const index = this.products.findIndex((product) => product._id === pid);
    if (index !== -1) {
      this.products.splice(index, 1);
      return { message: "Product deleted successfully" };
    }
    throw new Error("Product not found");
  }

  async save(product) {
    const productAlreadyExists = this.products.some(
      (existingProduct) => existingProduct.code === product.code
    );
    if (productAlreadyExists) {
      throw new Error("Product with this code already exists");
    }

    this.products.push(product);
    return product;
  }
}

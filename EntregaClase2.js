class ProductManager {
  #productIdCounter = 1;

  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      throw new Error("El código del producto ya está en uso.");
    }

    const newProduct = {
      id: this.#productIdCounter++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Not found");
    }
    return product;
  }
}

// Ejemplo de uso
const productManager = new ProductManager();

try {
  const product1 = productManager.addProduct(
    "Producto 1",
    "Descripción del producto 1",
    100,
    "imagen1.jpg",
    "abc123",
    10
  );
  const product2 = productManager.addProduct(
    "Producto 2",
    "Descripción del producto 2",
    150,
    "imagen2.jpg",
    "def456",
    20
  );

  console.log("Productos:", productManager.getProducts());

  const foundProduct = productManager.getProductById(product1.id);
  console.log("Producto encontrado:", foundProduct);

  const nonExistentProductId = 999;
  productManager.getProductById(nonExistentProductId);
} catch (error) {
  console.error("Error:", error.message);
}

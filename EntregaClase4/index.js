const ProductManager = require("./ProductManager");

const productManager = new ProductManager("./products.json");

try {
  const newProduct = productManager.addProduct({
    title: "Nuevo Producto",
    description: "Descripción del nuevo producto",
    price: 200,
    thumbnail: "imagen3.jpg",
    code: "ghi789",
    stock: 5,
  });
  console.log("Producto agregado:", newProduct);
} catch (error) {
  console.error("Error al agregar producto:", error.message);
}

const products = productManager.getProducts();
console.log("Productos:", products);

import { promises } from "fs";

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async save(product) {
    try {
      const products = await this.getProducts();

      if (products.some((p) => p.code === product.code)) {
        console.error(
          "Error al guardar el producto: Producto con código duplicado"
        );
        return null;
      }

      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;
      }

      products.push(product);

      await promises.writeFile(
        this.filePath,
        JSON.stringify(products, null, 2),
        "utf-8"
      );

      return product;
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      return null;
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    return product;
  }

  async getProducts() {
    try {
      const productsData = await promises.readFile(this.filePath, "utf-8");
      const products = JSON.parse(productsData);
      return products;
    } catch (error) {
      console.error("Error al leer el archivo de productos:", error);
      return [];
    }
  }
}

export default ProductManager;

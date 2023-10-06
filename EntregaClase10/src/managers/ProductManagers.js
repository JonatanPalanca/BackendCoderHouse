import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  addProduct = async (product) => {
    try {
      const allProducts = await this.getProducts();

      product.id =
        allProducts.length === 0
          ? 1
          : allProducts[allProducts.length - 1].id + 1;
      allProducts.push(product);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(allProducts, null, "\t")
      );
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteProduct = async (id) => {
    try {
      const allProducts = await this.getProducts();
      const productIndex = allProducts.findIndex((p) => p.id === id);

      if (productIndex != -1) {
        allProducts.splice(productIndex, 1);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(allProducts, null, "\t")
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ProductManager;

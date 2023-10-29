import { Products } from "../dbManagers/models/products.model.js";

export default class ProductsManager {
  constructor() {
    console.log("Working with Products in DB");
  }

  // Métodos para interactuar con el modelo "Products"
  getAll = async () => {
    try {
      const products = await Products.find();
      return products.map((product) => product.toObject());
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  save = async (productData) => {
    try {
      const product = new Products(productData);
      const result = await product.save();
      return result.toObject();
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  };
}

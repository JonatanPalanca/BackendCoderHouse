import { productsModel } from "../dbManager/models/products.model.js";

export default class ProductsManager {
  constructor() {
    console.log("Working with products from DB");
  }
  async getAll() {
    return await productsModel.find().lean();
  }

  async getProductById(id) {
    return await productsModel.findOne({ _id: id }).lean();
  }

  async create(product) {
    return await productsModel.create(product);
  }

  async update(pid, updatedFields) {
    return await productsModel.updateOne({ _id: pid }, { $set: updatedFields });
  }

  async delete(pid) {
    return await productsModel.deleteOne({ _id: pid });
  }

  async save(product) {
    const productAlreadyExists = await productsModel.findOne({
      code: product.code,
    });

    if (productAlreadyExists) {
      throw new Error("Product with this code already exists");
    }

    return await productsModel.create(product);
  }
}

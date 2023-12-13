import { cartsModel } from "../dbManager/models/carts.model.js";

export default class Carts {
  constructor() {
    console.log("Working with carts from DB");
  }

  getAll = async () => {
    const carts = await cartsModel.find().lean();
    return carts;
  };

  getCartById = async (id) => {
    const cart = await cartsModel.findOne({ _id: id }).lean();
    return cart;
  };

  updateProducts = async (cid, products) => {
    const result = await cartsModel.updateOne({ _id: cid }, { products });
    return result;
  };

  clearProducts = async (cid) => {
    const result = await cartsModel.updateOne({ _id: cid }, { products: [] });
    return result;
  };

  deleteProduct = async (cid, pid) => {
    const result = await cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
    return result;
  };

  create = async () => {
    const result = await cartsModel.create({});
    return result;
  };
}

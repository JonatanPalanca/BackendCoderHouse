import { cartsModel } from "../dbManager/models/carts.model.js";

export default class Carts {
  constructor() {
    console.log("Working with carts from DB");
  }

  getAll = async () => {
    const carts = await cartsModel.find().lean();
    // el .lean() pasa de BSON a POJO:
    return carts;
  };

  getCartById = async (id) => {
    //    const cart = await cartsModel.findOne({_id:id}).populate("products.product").lean();
    const cart = await cartsModel.findOne({ _id: id }).lean();
    return cart;
  };

  update = async (cid, products) => {
    const result = await cartsModel.updateOne({ _id: cid }, products);
    return result;
  };

  delete = async (cid) => {
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

  update = async (cid, updateData) => {
    const result = await cartsModel.updateOne({ _id: cid }, updateData);
    return result;
  };

  save = async () => {
    // const result = await cartsModel.create({"products":[]});
    const result = await cartsModel.create({});
    return result;
  };
}

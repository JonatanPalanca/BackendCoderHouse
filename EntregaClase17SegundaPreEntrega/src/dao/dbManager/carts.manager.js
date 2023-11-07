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
    const result = await cartsModel.updateOne({ _id: cid, products: [] });
    return result;
  };

  deleteProduct = async (cid, pid) => {
    const result = await cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: { _id: pid } } } }
    );
    //$pull es lo contrario de push, saca el elemento del arreglo. Hago el pull dentro del arreglo products, quiero pullear en prodcut el que tiene como _id el pid.
    res.send({ status: "success", payload: result });
  };

  save = async () => {
    // const result = await cartsModel.create({"products":[]});
    const result = await cartsModel.create({});
    return result;
  };
}

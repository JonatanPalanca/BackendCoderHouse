import cartsModel from "./models/carts.model.js";

export default class Carts {
  constructor() {}

  //CRUD

  //READ

  get = async () => {
    return await cartsModel.find();
  };

  getCartById = async (id) => {
    return await cartsModel.findOne({ _id: id });
  };

  //CREATE

  create = async (cart) => {
    return await cartsModel.create(cart);
  };

  //UPDATE

  modify = async (id, cart) => {
    return await cartsModel.findByIdAndUdpate(id, cart);
  };

  //DELETE

  delete = async (id) => {
    return await cartsModel.findByIdAndDelete(id);
  };

  ///////  esto va aca ? /////////////////////
  updateProducts = async (cid, products) => {
    return await cartsModel.updateOne({ _id: cid }, { products });
  };

  clearProducts = async (cid) => {
    return await cartsModel.updateOne({ _id: cid }, { products: [] });
  };

  deleteProduct = async (cid, pid) => {
    return await cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
  };
  /////////////////////////////////
}

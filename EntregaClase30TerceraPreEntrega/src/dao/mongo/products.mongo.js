import productsModel from "./models/products.model.js";

export default class Products {
  constructor() {}

  //CRUD

  //READ

  get = async () => {
    return await productsModel.find();
  };

  getCartById = async (id) => {
    return await productsModel.findOne({ _id: id });
  };

  //CREATE

  create = async (product) => {
    return await productsModel.create(product);
  };

  //UPDATE
  modify = async (pid, updatedFields) => {
    return await productsModel.findByIdAndUpdate(pid, updatedFields);
  };

  //DELETE

  delete = async (pid) => {
    return await productsModel.findByIdAndDelete(pid);
  };

  ////////////////////////
  async save(product) {
    const productAlreadyExists = await productsModel.findOne({
      code: product.code,
    });

    if (productAlreadyExists) {
      throw new Error("Product with this code already exists");
    }

    return await productsModel.create(product);
  }

  //////////////////////////////
}

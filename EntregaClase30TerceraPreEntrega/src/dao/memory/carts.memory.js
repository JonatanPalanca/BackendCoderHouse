import { v4 as uuidv4 } from "uuid";

export default class Carts {
  constructor() {
    this.data = []; // Almacena los carritos en memoria
  }

  //CRUD

  //CREATE

  create = async (cart) => {
    cart._id = uuidv4();
    this.data.push(cart);
    return cart;
  };

  //READ

  get = async () => {
    return this.data;
  };

  getCartById = async (id) => {
    return this.data[{ _id: id }];
  };

  //UPDATE

  modify = async (id, cart) => {
    const index = this.data.findIndex((c) => c._id === id);
    this.data[index] = cart;
    return cart;
  };

  //DELETE

  delete = async (id) => {
    const index = this.data.findIndex((c) => c._id === id);
    this.data.splice(index, 1);
    return { id };
  };

  ///////  esto va aca ? /////////////////////
  updateProducts(cid, products) {
    this.carts[cid].products = products;
    return this.carts[cid];
  }

  clearProducts(cid) {
    this.carts[cid].products = [];
    return this.carts[cid];
  }

  deleteProduct(cid, pid) {
    const cart = this.carts[cid];
    cart.products = cart.products.filter((product) => product.product !== pid);
    return cart;
  }
  /////////////////////////////////
}

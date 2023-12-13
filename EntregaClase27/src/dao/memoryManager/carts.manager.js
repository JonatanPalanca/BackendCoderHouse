export default class CartsManager {
  constructor() {
    this.carts = {}; // Almacena los carritos en memoria
  }

  getCartById(cid) {
    return this.carts[cid];
  }

  createCart() {
    const newCartId = this.generateUniqueId();
    this.carts[newCartId] = { _id: newCartId, products: [] };
    return this.carts[newCartId];
  }

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

  generateUniqueId() {
    // Esta función genera un ID único (para propósitos demostrativos)
    return Math.random().toString(36).substring(7);
  }
}

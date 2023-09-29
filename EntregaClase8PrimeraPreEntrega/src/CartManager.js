import { promises } from "fs";
import { v4 as uuidv4 } from "uuid";

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }
  generateUniqueCartId() {
    return uuidv4();
  }

  async createCart() {
    try {
      const carts = await this.getCarts();

      const newCart = {
        id: this.generateUniqueCartId(),
        products: [],
      };

      carts.push(newCart);

      await promises.writeFile(
        this.filePath,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );

      return newCart;
    } catch (error) {
      console.error("Error al crear un carrito:", error);
      return null;
    }
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === cartId);
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();

    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
      const existingProduct = cart.products.find((p) => p.id === productId);

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      await promises.writeFile(
        this.filePath,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );

      return cart;
    } else {
      return null;
    }
  }

  async getCarts() {
    try {
      const cartsData = await promises.readFile(this.filePath, "utf-8");
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      console.error("Error al leer el archivo de carritos:", error);
      return [];
    }
  }
}

export default CartManager;

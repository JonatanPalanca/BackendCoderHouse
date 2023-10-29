import { Carts } from "../dbManagers/models/carts.model.js";

export default class CartsManager {
  constructor() {
    console.log("Working with Carts in DB");
  }

  // Métodos para interactuar con el modelo "Carts"
  getAll = async () => {
    try {
      const carts = await Carts.find();
      return carts.map((cart) => cart.toObject());
    } catch (error) {
      console.error("Error fetching carts:", error);
      throw error;
    }
  };

  save = async (cartData) => {
    try {
      const cart = new Carts(cartData);
      const result = await cart.save();
      return result.toObject();
    } catch (error) {
      console.error("Error saving cart:", error);
      throw error;
    }
  };
}

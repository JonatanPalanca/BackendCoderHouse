import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(data);
        return carts;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (id_buscada) => {
    try {
      const carts = await this.getCarts();
      const cart_found = carts.find((carrito) => carrito.id === id_buscada);
      return cart_found;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };

  saveCarts = async (carts) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      return res.status(500).send({ status: "error", error: error });
    }
  };
}

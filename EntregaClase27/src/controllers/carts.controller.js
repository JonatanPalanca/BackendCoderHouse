import {
  getCartById,
  createCart,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
} from "../services/carts.service.js";

const CartController = {
  async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await getCartById(cid);
      res.send({ status: "success", payload: cart });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async createCart(req, res) {
    try {
      const result = await createCart();
      res
        .status(201)
        .send({ status: "success", message: "Cart created", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await addProductToCart(cid, pid);
      res.status(201).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async deleteCart(req, res) {
    try {
      const { cid } = req.params;
      const result = await deleteCart(cid);
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await deleteProductFromCart(cid, pid);
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const result = await updateCart(cid, products);
      res.status(201).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async updateProductInCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { amount } = req.body;
      const result = await updateProductInCart(cid, pid, amount);
      res.status(201).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },
};

export {
  getCartById,
  createCart,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
};

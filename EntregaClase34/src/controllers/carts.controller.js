import {
  createCart as createCartService,
  getCart as getCartService,
  updateCart as updateCartService,
  deleteCart as deleteCartService,
  deleteProductFromCart as deleteProductFromCartService,
  updateFullCart as updateFullCartService,
  purchase as purchaseService,
} from "../services/carts.service.js";
import { getProductById as getProductByIdService } from "../services/products.service.js";
import logger from "../utils/logger.js";

export const createCart = async (req, res) => {
  try {
    const result = await createCartService();
    res
      .status(201)
      .send({ status: "success", message: "cart created", payload: result });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await getCartService(cid);
    if (!cart) {
      logger.error("Cart not found");
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    res.send({ status: "success", payload: cart });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await getCartService(cid);
    const product = await getProductByIdService(pid);
    if (!cart) {
      logger.error("Cart not found");
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      logger.error("Product not found");
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    const result = await updateCartService(cid, pid, 1);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await getCartService(cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    const result = await deleteCartService(cid);
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await getCartService(cid);
    const product = await getProductByIdService(pid);
    if (!cart) {
      logger.error("Cart not found"); // Cambia a logger.error
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      logger.error("Product not found"); // Cambia a logger.error
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    const result = await deleteProductFromCartService(cid, pid);
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(error); // Cambia a logger.error
    res.status(500).send({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    const { cid } = req.params;
    if (!products) {
      logger.error("Incomplete values"); // Cambia a logger.error
      return res
        .status(422)
        .send({ status: "error", message: "Incomplete values" });
    }
    const cart = await getCartService(cid);
    if (!cart) {
      logger.error("Cart not found"); // Cambia a logger.error
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    const result = await updateFullCartService(cid, products);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(error); // Cambia a logger.error
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const updateProductInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const amount = req.body;
    const cart = await getCartService(cid);
    const product = await getProductByIdService(pid);
    if (!cart) {
      logger.error("Cart not found"); // Cambia a logger.error
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      logger.error("Product not found"); // Cambia a logger.error
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }

    const result = await updateCartService(cid, pid, amount.quantity);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(error); // Cambia a logger.error
    res.status(500).send({ error: error.message });
  }
};
export const purchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const user = req.user;
    const result = await purchaseService(cid, user);

    res.send({ result });
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

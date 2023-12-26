import { Router } from "express";
import { Carts } from "../dao/factory.js";
import { Tickets } from "../dao/factory.js";

import {
  getCartById,
  createCart,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
  purchase,
} from "../controllers/carts.controller.js";

const router = Router();
const cartsDao = new Carts();
router.get("/", async (req, res) => {
  const data = await cartsDao.get();
  res.json(data);
});

router.post("/", async (req, res) => {
  const { id, cart, product, quantity } = req.body;
  const data = await cartsDao.create({ cart, id, product, quantity });
  res.json(data);
});

router.get("/:cid", getCartById);
router.post("/", createCart);
router.post("/:cid/product/:pid", addProductToCart);
router.delete("/:cid", deleteCart);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateProductInCart);

export default router;

import { Router } from "express";
import {
  getCartById,
  createCart,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/:cid", getCartById);
router.post("/", createCart);
router.post("/:cid/product/:pid", addProductToCart);
router.delete("/:cid", deleteCart);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateProductInCart);

export default router;

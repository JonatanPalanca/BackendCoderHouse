import { Router } from "express";
import {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  deleteProductFromCart,
  addProductToCart,
  updateProductInCart,
  purchase,
} from "../controllers/carts.controller.js";
import {
  updateFullCartSchema,
  getCartByIdSchema,
  productCartSchema,
} from "../schemas/carts.schema.js";
import validator from "../middlewares/validator.js";
import { accessRolesEnum } from "../config/enums.js";
import { authorization } from "../utils.js";

const router = Router();

router.get("/:cid", validator.params(getCartByIdSchema), getCart);

router.post("/", createCart);

router.post(
  "/:cid/product/:pid",
  validator.params(productCartSchema),
  addProductToCart
);

router.delete("/:cid", validator.params(getCartByIdSchema), deleteCart);

router.delete(
  "/:cid/product/:pid",
  validator.params(productCartSchema),
  deleteProductFromCart
);

router.put(
  "/:cid",
  validator.params(getCartByIdSchema),
  validator.body(updateFullCartSchema),
  updateCart
);

router.put(
  "/:cid/product/:pid",
  authorization(accessRolesEnum.USER),
  updateProductInCart
);

router.post("/:cid/purchase", validator.params(getCartByIdSchema), purchase);

export default router;

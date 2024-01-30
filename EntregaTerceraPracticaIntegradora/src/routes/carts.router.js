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
import { authorization } from "../utils.js";
import { accessRolesEnum } from "../config/enums.js";
import validator from "../middlewares/validator.js";
import logger from "../utils/logger.js";

const router = Router();

router.get("/:cid", async (req, res) => {
  try {
    const result = await getCart(req.params.cid);
    logger.info(`GET /${req.params.cid} - Successful`);
    res.send({ status: "ok", data: result });
  } catch (error) {
    logger.error(`GET /${req.params.cid} - Error: ${error.message}`);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await createCart();
    logger.info(`POST / - Successful`);
    res.send({ status: "ok", data: result });
  } catch (error) {
    logger.error(`POST / - Error: ${error.message}`);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await addProductToCart(req.params.cid, req.params.pid);
    logger.info(
      `POST /${req.params.cid}/product/${req.params.pid} - Successful`
    );
    res.send({ status: "ok", data: result });
  } catch (error) {
    logger.error(
      `POST /${req.params.cid}/product/${req.params.pid} - Error: ${error.message}`
    );
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    await deleteCart(req.params.cid);
    logger.info(`DELETE /${req.params.cid} - Successful`);
    res.send({ status: "ok", message: "Cart deleted successfully" });
  } catch (error) {
    logger.error(`DELETE /${req.params.cid} - Error: ${error.message}`);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await deleteProductFromCart(req.params.cid, req.params.pid);
    logger.info(
      `DELETE /${req.params.cid}/product/${req.params.pid} - Successful`
    );
    res.send({ status: "ok", data: result });
  } catch (error) {
    logger.error(
      `DELETE /${req.params.cid}/product/${req.params.pid} - Error: ${error.message}`
    );
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const result = await updateCart(req.params.cid, req.body);
    logger.info(`PUT /${req.params.cid} - Successful`);
    res.send({ status: "ok", data: result });
  } catch (error) {
    logger.error(`PUT /${req.params.cid} - Error: ${error.message}`);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

router.put(
  "/:cid/product/:pid",
  authorization(accessRolesEnum.USER),
  async (req, res) => {
    try {
      const result = await updateProductInCart(req.params.cid, req.params.pid);
      logger.info(
        `PUT /${req.params.cid}/product/${req.params.pid} - Successful`
      );
      res.send({ status: "ok", data: result });
    } catch (error) {
      logger.error(
        `PUT /${req.params.cid}/product/${req.params.pid} - Error: ${error.message}`
      );
      res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
);

router.post("/:cid/purchase", async (req, res) => {
  try {
    const result = await purchase(req.params.cid);
    logger.info(`POST /${req.params.cid}/purchase - Successful`);
    res.send({ status: "ok", data: result });
  } catch (error) {
    logger.error(`POST /${req.params.cid}/purchase - Error: ${error.message}`);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

export default router;

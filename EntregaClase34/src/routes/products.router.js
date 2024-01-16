import { Router } from "express";
import validator from "../middlewares/validator.js";
import {
  getProduct,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import {
  getProductByIdSchema,
  productSchema,
} from "../schemas/products.schema.js";
import { authorization } from "../utils.js";
import { accessRolesEnum } from "../config/enums.js";
import toAsyncRouter from "async-express-decorator";
import logger from "../utils/logger.js";

const router = toAsyncRouter(Router());

router.get("/mockingproducts", (req, res) => {
  try {
    let products = [];

    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }

    res.send({
      status: "ok",
      counter: products.length,
      data: products,
    });
    logger.info(`GET /mockingproducts - Successful`);
  } catch (error) {
    console.error("Error fetching mocking products:", error);
    logger.error(`GET /mockingproducts - Error: ${error.message}`);
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error" });
  }
});

router.get(
  "/:pid",
  validator.params(getProductByIdSchema),
  async (req, res) => {
    try {
      const product = await getProductById(req.params.pid);
      res.send({ status: "ok", data: product });
      logger.info(`GET /${req.params.pid} - Successful`);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      logger.error(`GET /${req.params.pid} - Error: ${error.message}`);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
);

router.delete(
  "/:pid",
  authorization(accessRolesEnum.ADMIN),
  async (req, res) => {
    try {
      await deleteProduct(req.params.pid);
      res.send({ status: "ok", message: "Product deleted successfully" });
      logger.info(`DELETE /${req.params.pid} - Successful`);
    } catch (error) {
      console.error("Error deleting product:", error);
      logger.error(`DELETE /${req.params.pid} - Error: ${error.message}`);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
);

router.put(
  "/:pid",
  authorization(accessRolesEnum.ADMIN),
  validator.params(getProductByIdSchema),
  validator.body(productSchema),
  async (req, res) => {
    try {
      const updatedProduct = await updateProduct(req.params.pid, req.body);
      res.send({ status: "ok", data: updatedProduct });
      logger.info(`PUT /${req.params.pid} - Successful`);
    } catch (error) {
      console.error("Error updating product:", error);
      logger.error(`PUT /${req.params.pid} - Error: ${error.message}`);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const products = await getProduct();
    res.send({ status: "ok", data: products });
    logger.info(`GET / - Successful`);
  } catch (error) {
    console.error("Error fetching products:", error);
    logger.error(`GET / - Error: ${error.message}`);
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error" });
  }
});

router.post(
  "/",
  authorization(accessRolesEnum.ADMIN),
  validator.body(productSchema),
  async (req, res) => {
    try {
      const newProduct = await createProduct(req.body);
      res.send({ status: "ok", data: newProduct });
      logger.info(`POST / - Successful`);
    } catch (error) {
      console.error("Error creating product:", error);
      logger.error(`POST / - Error: ${error.message}`);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
);

export default router;

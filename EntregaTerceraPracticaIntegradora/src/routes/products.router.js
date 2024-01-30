import { Router } from "express";
import validator from "../middlewares/validator.js";
import {
  getProductByIdSchema,
  productSchema,
} from "../schemas/products.schema.js";
import Products from "../dao/dbManager/products.db.js";
import { authorization } from "../utils.js";
import { accessRolesEnum } from "../config/enums.js";
import logger from "../utils/logger.js";

const router = Router();
const productsModel = new Products();

// Ruta para obtener un producto por su ID
router.get(
  "/:pid",
  validator.params(getProductByIdSchema),
  async (req, res) => {
    try {
      const product = await productsModel.getProductById(req.params.pid);
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

// Ruta para eliminar un producto por su ID (requiere rol de ADMIN)
router.delete(
  "/:pid",
  authorization(accessRolesEnum.ADMIN),
  async (req, res) => {
    try {
      await productsModel.delete(req.params.pid);
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

// Ruta para actualizar un producto por su ID (requiere rol de ADMIN)
router.put(
  "/:pid",
  authorization(accessRolesEnum.ADMIN),
  validator.params(getProductByIdSchema),
  validator.body(productSchema),
  async (req, res) => {
    try {
      const updatedProduct = await productsModel.update(
        req.params.pid,
        req.body
      );
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

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productsModel.getAll();
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

// Ruta para crear un nuevo producto (requiere rol de ADMIN o PREMIUM)
router.post(
  "/products",
  authorization([accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM]),
  validator.body(productSchema),
  async (req, res) => {
    try {
      const productData = req.body;
      productData.owner = req.user.email;

      // Realiza la lógica necesaria para guardar el producto en la base de datos
      const createResult = await productsModel.create(productData);

      if (createResult.status === "ok") {
        res.send(createResult);
        logger.info(`POST /products - Successful`);
      } else {
        res.status(500).send(createResult);
        logger.error(`POST /products - Error: ${createResult.message}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
      logger.error(`POST /products - Error: ${error.message}`);
    }
  }
);
export default router;

import CustomError from "../middlewares/errors/CustomError.js";
import EErrors from "../middlewares/errors/enums.js";

import {
  getProduct as getProductService,
  getProductById as getProductByIdService,
  deleteProduct as deleteProductService,
  createProduct as createProductService,
  updateProduct as updateProductService,
} from "../services/products.service.js";

export const getProduct = async (req, res) => {
  try {
    const products = await getProductService();
    return res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await getProductByIdService(pid);
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    res.send({ status: "success", payload: product });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await deleteProductService(pid);
    const io = req.app.get("socketio");
    io.emit("showProducts", { products: await getProductService() });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    } = req.body;

    // Verificar si se envían el título y el precio
    if (!title || !price) {
      throw CustomError.createError({
        name: "ProductError",
        cause: "Title and price are required fields",
        message: "Error trying to create product",
        code: EErrors.INVALID_TYPE_ERROR,
      });
    }

    const io = req.app.get("socketio");
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    };

    const result = await createProductService(product);

    if (!result) {
      return res
        .status(400)
        .send({ status: "error", message: "product already exists" });
    }

    const products = await getProductService();
    io.emit("showProducts", { products: products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    } = req.body;
    const { pid } = req.params;
    const io = req.app.get("socketio");
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    };
    const result = await updateProductService(pid, product);
    const products = await getProductService();
    io.emit("showProducts", { products: products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

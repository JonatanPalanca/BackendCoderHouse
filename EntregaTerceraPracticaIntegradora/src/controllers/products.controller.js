import CustomError from "../middlewares/errors/CustomError.js";
import EErrors from "../middlewares/errors/enums.js";
import logger from "../utils/logger.js";

export const getProduct = async (req, res) => {
  try {
    const products = await getProductService();
    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ status: "error", error: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await getProductByIdService(pid);
    if (!product) {
      res.status(404).send({ status: "error", message: "Product not found" });
    } else {
      res.send({ status: "success", payload: product });
    }
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
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

    if (!title || !price || title.trim() === "" || price <= 0) {
      throw CustomError.createError({
        name: "ProductError",
        cause: "Title and price are required fields with valid values",
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
      res
        .status(400)
        .send({ status: "error", message: "product already exists" });
    } else {
      const products = await getProductService();
      io.emit("showProducts", { products: products });
      res.status(201).send({ status: "success", payload: result });
    }
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

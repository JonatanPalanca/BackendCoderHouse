import ProductManager from "../dao/mongo/products.mongo.js";
import { productPath } from "../utils.js";
const productManager = new ProductManager(productPath);

const getAllProducts = async () => {
  try {
    const products = await productManager.getAll();
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductById = async (pid) => {
  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (pid) => {
  try {
    const result = await productManager.delete(pid);
    // Lógica para emitir eventos usando socket.io aquí
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createProduct = async (
  { title, description, price, thumbnail, code, category, stock, status },
  io
) => {
  try {
    if (!title || !description || !price || !code || !category || !stock) {
      throw new Error("Incomplete values");
    }

    const result = await productManager.save({
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    });

    if (!result) {
      throw new Error("Product already exists");
    }

    const products = await productManager.getAll();
    io.emit("showProducts", { products });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProduct = async (
  { title, description, price, thumbnail, code, category, stock, status },
  pid,
  io
) => {
  try {
    if (!title || !description || !price || !code || !category || !stock) {
      throw new Error("Incomplete values");
    }

    const result = await productManager.update(pid, {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    });

    const products = await productManager.getAll();
    io.emit("showProducts", { products });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  getAllProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};

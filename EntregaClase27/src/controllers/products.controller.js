import {
  getAllProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../services/products.service.js";

// Controlador para los productos
const ProductsController = {
  async getAllProducts(req, res) {
    try {
      const products = await getAllProducts();
      return res.status(200).send({ status: "success", payload: products });
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  },

  async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await getProductById(pid);
      if (!product) {
        return res
          .status(404)
          .send({ status: "error", message: "Product not found" });
      }
      res.send({ status: "success", payload: product });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const result = await deleteProduct(pid);
      // Tu lógica para emitir eventos usando socket.io aquí
      res.status(201).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async createProduct(req, res) {
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
      const io = req.app.get("socketio");

      const result = await createProduct(
        {
          title,
          description,
          price,
          thumbnail,
          code,
          category,
          stock,
          status,
        },
        io
      );

      res.status(201).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },

  async updateProduct(req, res) {
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

      const result = await updateProduct(
        {
          title,
          description,
          price,
          thumbnail,
          code,
          category,
          stock,
          status,
        },
        pid,
        io
      );

      res.status(201).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },
};

export default ProductsController;

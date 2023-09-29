import express from "express";
import ProductManager from "../ProductManager.js";

const router = express.Router();
const productManager = new ProductManager("products.json");

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit);

  const products = await productManager.getProducts();

  if (!isNaN(limit) && limit > 0) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

router.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;

  if (
    !newProduct.title ||
    !newProduct.description ||
    !newProduct.code ||
    !newProduct.price ||
    typeof newProduct.price !== "number" ||
    !newProduct.stock ||
    typeof newProduct.stock !== "number"
  ) {
    return res.status(400).json({
      error: "Faltan campos obligatorios o algunos campos no son válidos.",
    });
  }

  const product = await productManager.save(newProduct);
  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400).json({ error: "No se pudo agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;

  delete updatedProduct.id;
  const product = await productManager.updateProduct(productId, updatedProduct);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.delete("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const deletedProduct = await productManager.deleteProduct(productId);
  if (deletedProduct) {
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

export default router;

import express from "express";
import { promises } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const cartFilePath = path.join(__dirname, "../carts.json");

router.post("/", async (req, res) => {
  try {
    const cartManager = new CartManager(cartFilePath);

    const newCart = await cartManager.createCart();

    if (newCart) {
      res.status(201).json(newCart);
    } else {
      res.status(500).json({ error: "No se pudo crear el carrito" });
    }
  } catch (error) {
    console.error("Error al crear un carrito:", error);
    res.status(500).json({ error: "No se pudo crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cartManager = new CartManager(cartFilePath);

    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al listar productos en un carrito:", error);
    res
      .status(500)
      .json({ error: "No se pudo listar los productos del carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = parseInt(req.params.pid);

  try {
    const productManager = new ProductManager("products.json");
    const product = await productManager.getProductById(productId);

    if (!product) {
      return res.status(400).json({ error: "El producto no existe" });
    }

    const cartManager = new CartManager(cartFilePath);

    const updatedCart = await cartManager.addProductToCart(cartId, productId);

    if (updatedCart) {
      res.json(updatedCart.products);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al agregar un producto al carrito:", error);
    res
      .status(500)
      .json({ error: "No se pudo agregar el producto al carrito" });
  }
});

export default router;

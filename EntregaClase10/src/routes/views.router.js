import { Router } from "express";
import ProductManager from "../managers/ProductManagers.js";
import { __dirname } from "../utils.js";
import path from "node:path";

const productsFilePath = path.join(__dirname, "./files/products.json");
const productManager = new ProductManager(productsFilePath);

const router = Router();

router.get("/", async (req, res) => {
  try {
    const coso = await productManager.getProducts();
    res.render("home", {
      coso,
    });
  } catch {}
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;

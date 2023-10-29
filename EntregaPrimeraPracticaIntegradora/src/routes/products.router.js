import { Router } from "express";
import ProductsManager from "../dao/dbManagers/products.manager.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/products", async (req, res) => {
  try {
    const products = await productsManager.getAll();
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || !price) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete values" });
    }

    const result = await productsManager.save({
      title,
      price,
    });

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const { title, price } = req.body;
    const { id } = req.params;

    if (!title || !price) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete values" });
    }

    const result = await productsManager.update(id, {
      title,
      price,
    });

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;

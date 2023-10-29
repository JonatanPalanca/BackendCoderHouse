import { Router } from "express";
import CartsManager from "../dao/dbManagers/carts.manager.js";

const router = Router();
const cartsManager = new CartsManager();

router.get("/carts", async (req, res) => {
  try {
    const carts = await cartsManager.getAll();
    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/carts", async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId || !products || !Array.isArray(products)) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete or invalid values" });
    }

    const result = await cartsManager.save({
      userId,
      products,
    });

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/carts/:id", async (req, res) => {
  try {
    const { userId, products } = req.body;
    const { id } = req.params;

    if (!userId || !products || !Array.isArray(products)) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete or invalid values" });
    }

    const result = await cartsManager.update(id, {
      userId,
      products,
    });

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;

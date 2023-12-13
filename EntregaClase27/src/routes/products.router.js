import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

const router = Router();

router.get("/", ProductController.getAllProducts);
router.get("/:pid", ProductController.getProductById);
router.delete("/:pid", ProductController.deleteProduct);
router.post("/", ProductController.createProduct);
router.put("/:pid", ProductController.updateProduct);

export default router;

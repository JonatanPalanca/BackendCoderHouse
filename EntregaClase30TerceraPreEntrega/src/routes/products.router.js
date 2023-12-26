import { Router } from "express";
import { Products } from "../dao/factory.js";

const router = Router();

router.get("/", async (req, res) => {
  const data = await productsDao.get();
  res.json(data);
});

router.post("/", async (req, res) => {
  const { _id, title, description, price, category, stock, quantity } =
    req.body;
  const data = await productsDao.create({
    _id,
    title,
    description,
    price,
    category,
    stock,
    quantity,
  });
  res.json(data);
});

/*router.get("/", ProductController.getAllProducts);
router.get("/:pid", ProductController.getProductById);
router.delete("/:pid", ProductController.deleteProduct);
router.post("/", ProductController.createProduct);
router.put("/:pid", ProductController.updateProduct);*/

export default router;

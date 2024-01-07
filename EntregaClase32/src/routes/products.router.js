import { Router } from "express";
import validator from "../middlewares/validator.js";
import {
  getProduct,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import {
  getProductByIdSchema,
  productSchema,
} from "../schemas/products.schema.js";
import { authorization } from "../utils.js";
import { accessRolesEnum } from "../config/enums.js";
import { generateProduct } from "../utils.js";
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());
router.get("/mockingproducts", (req, res) => {
  let products = [];

  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }

  res.send({
    status: "ok",
    counter: products.length,
    data: products,
  });
});

router.get("/:pid", validator.params(getProductByIdSchema), getProductById);

router.delete("/:pid", authorization(accessRolesEnum.ADMIN), deleteProduct);

router.put(
  "/:pid",
  authorization(accessRolesEnum.ADMIN),
  validator.params(getProductByIdSchema),
  validator.body(productSchema),
  updateProduct
);

router.get("/", getProduct);

router.post(
  "/",
  authorization(accessRolesEnum.ADMIN),
  validator.body(productSchema),
  createProduct
);

export default router;

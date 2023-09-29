import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
const port = 8080;
const productManager = new ProductManager("products.json");
const cartManager = new CartManager("carts.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import productsRouter from "./routes/products.js";
app.use("/api/products", productsRouter);

import cartsRouter from "./routes/carts.js";
app.use("/api/carts", cartsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

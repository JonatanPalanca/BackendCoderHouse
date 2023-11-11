import { Router } from "express";
import { cartPath } from "../utils.js";
import { productPath } from "../utils.js";
import fs from "fs";
//import CartManager from '../dao/fileManager/cart.manager.js';
import CartManager from "../dao/dbManager/carts.manager.js";
import ProductManager from "../dao/dbManager/products.manager.js";
import { pid } from "process";
const router = Router();
const app = express();

app.use(express.json());
const cartManager = new CartManager(cartPath);
const productManager = new ProductManager(productPath);

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    //console.log(cart)
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    res.send({ status: "success", payload: cart });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await cartManager.save();
    res
      .status(201)
      .send({ status: "success", message: "cart created", payload: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductById(pid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    //console.log(cart.products[0].product._id.toString()===pid);
    //console.log("pid ",pid);
    if (cart.products.length === 0) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      const indexProductInCart = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      //console.log(indexProductInCart);
      if (indexProductInCart !== -1) {
        cart.products[indexProductInCart].quantity++;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
    }
    const result = await cartManager.update(cid, { products: cart.products });
    res.status(201).send({ status: "success", payload: result });

    // const result = await cartManager.update(cid,{"products": cart.products});
    //         res.status(201).send({status:"success",payload:result});
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    const result = await cartManager.delete(cid);
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductById(pid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    //console.log(cart.products[0].product._id.toString()===pid);
    //console.log("pid ",pid);
    if (cart.products.length !== 0) {
      const indexProductInCart = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      //console.log(indexProductInCart);
      if (indexProductInCart !== -1) {
        cart.products.splice(indexProductInCart, 1);
      }
    }
    const result = await cartManager.update(cid, { products: cart.products });
    res.status(200).send({ status: "success", payload: result });

    // const result = await cartManager.update(cid,{"products": cart.products});
    //         res.status(201).send({status:"success",payload:result});
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    const { cid } = req.params;
    if (!products) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete values" });
    }
    const result = await cartManager.update(cid, { products: products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

/*  router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    // const {cid, pid} = req.params;
    const amount = req.body;
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductById(pid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    if (cart.products.length === 0) {
      cart.products.push({ product: pid, quantity: amount.quantity });
    } else {
      const indexProductInCart = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (indexProductInCart !== -1) {
        cart.products[indexProductInCart].quantity += amount.quantity;
      } else {
        cart.products.push({ product: pid, quantity: amount.quantity });
      }
    }
    const result = await cartManager.update(cid, { products: cart.products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});*/

router.put("/carts/:cartId/products", async (req, res) => {
  const { cartId } = req.params;
  const { quantity, title, price } = req.body;

  try {
    // Lógica para actualizar el carrito en la base de datos
    const updatedCart = await cartManager.update(cartId, {
      quantity,
      title,
      price,
    });

    res.json({
      status: "success",
      message: "Product added to cart",
      updatedCart,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});
export default router;

import { Router } from "express";
import passport from "passport";
const router = Router();
import { productPath, authorization, chatPath, cartPath } from "../utils.js";
//import ProductManager from '../dao/dbManager/products.db.js';
//import ChatManager from "../dao/fileManager/chat.file.js"
import { ProductManager, ChatManager, CartManager } from "../dao/factory.js";

//import ChatManager from "../dao/dbManager/chat.db.js";
//import CartManager from "../dao/dbManager/carts.db.js";
import { productsModel } from "../dao/dbManager/models/products.model.js";
import { accessRolesEnum } from "../config/enums.js";

const productManager = new ProductManager(productPath);
const chatManager = new ChatManager(chatPath);
const cartManager = new CartManager(cartPath);

const publicAccess = (req, res, next) => {
  next();
};

//RUTAS DE PRODUCTOS
router.get("/realtimeproducts", redirectToLogin, async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});
router.get("/products", redirectToLogin, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, queryValue, query } = req.query;
    const filtered =
      query == "price" || query == "stock"
        ? { [query]: { $gt: queryValue } }
        : queryValue
        ? { [query]: { $regex: queryValue, $options: "i" } }
        : {};
    const sorted = sort ? { price: sort } : {};
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
      await productsModel.paginate(filtered, {
        sort: sorted,
        page,
        limit,
        lean: true,
      });

    const prevLink = queryValue
      ? `/products?page=${prevPage}&limit=${limit}&queryValue=${queryValue}&query=${query}`
      : `/products?page=${prevPage}&limit=${limit}`;
    const nextLink = queryValue
      ? `/products?page=${nextPage}&limit=${limit}&queryValue=${queryValue}&query=${query}`
      : `/products?page=${nextPage}&limit=${limit}`;

    res.render("home", {
      products: docs,
      user: req.user,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      limit,
      query,
      queryValue,
      prevLink,
      nextLink,
    });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});
router.get("/home", redirectToLogin, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort } = req.query;

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
      await productsModel.paginate(
        {},
        { sort: { price: sort }, page, limit, lean: true }
      );
    const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${limit}` : null;
    const nextLink = hasNextPage ? `/?page=${nextPage}&limit=${limit}` : null;
    res.send({
      status: "success",
      payload: docs,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      totalPages,
      page,
      prevLink,
      nextLink,
    });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});

//RUTA DE CARRITO
router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    res.render("cart", { cart });
  } catch (error) {
    console.error(error.message);
  }
});

//RUTA DE CHAT
router.get(
  "/chat",
  redirectToLogin,
  authorization(accessRolesEnum.USER),
  async (req, res) => {
    const messages = await chatManager.getAll();
    res.render("chat", { messages });
  }
);

//RUTAS DE USUARIOS

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/", redirectToLogin, (req, res) => {
  res.render("profile", {
    user: req.user,
  });
});

function redirectToLogin(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect("/login");
    }
    req.user = user;
    return next();
  })(req, res, next);
}

export default router;

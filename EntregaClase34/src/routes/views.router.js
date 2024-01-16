import { Router } from "express";
import jwt from "jsonwebtoken";
import local from "passport-local";
import { productPath, authorization, chatPath, cartPath } from "../utils.js";
import { ProductManager, ChatManager, CartManager } from "../dao/factory.js";
import { productsModel } from "../dao/dbManager/models/products.model.js";
import { accessRolesEnum } from "../config/enums.js";
import logger from "../utils/logger.js";
import configs from "../config/config.js";

const router = Router();
const jwtVerify = jwt.verify;
const productManager = new ProductManager(productPath);
const chatManager = new ChatManager(chatPath);
const cartManager = new CartManager(cartPath);

const publicAccess = (req, res, next) => {
  next();
};

// RUTAS DE PRODUCTOS
router.get("/realtimeproducts", redirectToLogin, async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render("realTimeProducts", { products: products });
    logger.info(`GET /realtimeproducts - Successful`);
  } catch (error) {
    console.error("Error fetching realtime products:", error);
    logger.error(`GET /realtimeproducts - Error: ${error.message}`);
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error" });
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
    logger.info(`GET /products - Successful`);
  } catch (error) {
    console.error("Error fetching products:", error);
    logger.error(`GET /products - Error: ${error.message}`);
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error" });
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
    logger.info(`GET /home - Successful`);
  } catch (error) {
    console.error("Error fetching home products:", error);
    logger.error(`GET /home - Error: ${error.message}`);
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error" });
  }
});

// RUTA DE CARRITO
router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    res.render("cart", { cart });
    logger.info(`GET /carts/:cid - Successful`);
  } catch (error) {
    console.error("Error fetching cart:", error);
    logger.error(`GET /carts/:cid - Error: ${error.message}`);
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server Error" });
  }
});

// RUTA DE CHAT
router.get(
  "/chat",
  redirectToLogin,
  authorization(accessRolesEnum.USER),
  async (req, res) => {
    try {
      const messages = await chatManager.getAll();
      res.render("chat", { messages });
      logger.info(`GET /chat - Successful`);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      logger.error(`GET /chat - Error: ${error.message}`);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
);

// RUTAS DE USUARIOS

router.get("/register", (req, res) => {
  res.render("register");
  logger.info(`GET /register - Rendered registration page`);
});

router.get("/login", (req, res) => {
  res.render("login");
  logger.info(`GET /login - Rendered login page`);
});

router.get("/", redirectToLogin, (req, res) => {
  res.render("profile", {
    user: req.user,
  });
  logger.info(`GET / - Rendered profile page`);
});

function redirectToLogin(req, res, next) {
  const token = req.cookies["coderCookieToken"];

  if (!token) {
    return res.redirect("/login");
  }

  jwtVerify(token, configs.privateKeyJWT, (err, decoded) => {
    if (err) {
      console.error("Authentication failed:", err);
      logger.error(`Authentication failed: ${err}`);
      return res.redirect("/login");
    }

    req.user = decoded.user;
    return next();
  });
}

// Ruta para probar los logs
router.get("/loggerTest", (req, res) => {
  // Ejemplos de logs en diferentes niveles
  logger.debug("Esto es un mensaje de debug");
  logger.http("Esto es un mensaje de http");
  logger.info("Esto es un mensaje de info");
  logger.warning("Esto es un mensaje de warning");
  logger.error("Esto es un mensaje de error");
  logger.fatal("Esto es un mensaje fatal");

  res.send({ result: "Prueba de logs exitosa" });
});

export default router;

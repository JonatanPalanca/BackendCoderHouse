import { Router } from "express";
import passport from "passport";
const router = Router();
import { productPath, authorization, chatPath, cartPath } from "../utils.js";
import { ProductManager, ChatManager, CartManager } from "../dao/factory.js";
import { mockingProducts } from "../controllers/products.controller.js";
import { generateProduct } from "../utils.js";
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

router.get("/mockingproducts", async (req, res) => {
  try {
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});

router.get("/loggerTest", (req, res) => {
  req.logger.fatal("prueba fatal");
  req.logger.error("prueba error");
  req.logger.warning("prueba warning");
  req.logger.info("prueba info");
  req.logger.http("prueba http");
  req.logger.debug("prueba debug");

  res.send({ result: "OK" });
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

router.get("/restore", (req, res) => {
  res.render("restore");
});

router.get("/failed-restore", (req, res) => {
  res.render("restoreFailed");
});

router.get("/restore-success", (req, res) => {
  res.render("restoreSuccess");
});

router.get("/reset", redirectToReset, (req, res) => {
  res.render("reset");
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

function redirectToReset(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect("/restore");
    }
    req.user = user;
    return next();
  })(req, res, next);
}

export default router;

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones relacionadas con productos
 */

import { Router } from "express";
import passport from "passport";
const router = Router();
import { productPath, authorization, chatPath, cartPath } from "../utils.js";
import { ProductManager, ChatManager, CartManager } from "../dao/factory.js";
import { mockingProducts } from "../controllers/products.controller.js";
import { generateProduct } from "../utils.js";
import { productsModel } from "../dao/dbManager/models/products.model.js";
import usersModel from "../dao/dbManager/models/users.model.js";
import { accessRolesEnum } from "../config/enums.js";
import { ticketService } from "../services/tickets.service.js";
const productManager = new ProductManager(productPath);
const chatManager = new ChatManager(chatPath);
const cartManager = new CartManager(cartPath);

const publicAccess = (req, res, next) => {
  next();
};

/**
 * @swagger
 * /api/products/realtimeproducts:
 *   get:
 *     summary: Obtener productos en tiempo real.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos en tiempo real.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { products: [...] }
 *       401:
 *         description: Acceso no autorizado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/realtimeproducts", redirectToLogin, async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});

/**
 * @swagger
 * /api/products/mockingproducts:
 *   get:
 *     summary: Obtener productos simulados para pruebas.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos simulados.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { products: [...] }
 *       500:
 *         description: Error interno del servidor.
 */
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

/**
 * @swagger
 * /api/products/loggerTest:
 *   get:
 *     summary: Ejecutar pruebas de registro.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Pruebas de registro ejecutadas con éxito.
 *         content:
 *           application/json:
 *             example:
 *               result: "OK"
 */
router.get("/loggerTest", (req, res) => {
  req.logger.fatal("prueba fatal");
  req.logger.error("prueba error");
  req.logger.warning("prueba warning");
  req.logger.info("prueba info");
  req.logger.http("prueba http");
  req.logger.debug("prueba debug");

  res.send({ result: "OK" });
});

/**
 * @swagger
 * /api/products/products:
 *   get:
 *     summary: Obtener lista de productos paginada y filtrada.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número de página.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Número de elementos por página.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         description: Campo para ordenar (price).
 *         schema:
 *           type: string
 *       - in: query
 *         name: queryValue
 *         description: Valor para filtrar (puede ser precio o stock dependiendo de la query).
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         description: Campo para filtrar (price o stock).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de productos paginada y filtrada.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { products: [...], hasPrevPage: true, hasNextPage: true, nextPage: 2, prevPage: 1 }
 *       401:
 *         description: Acceso no autorizado.
 *       500:
 *         description: Error interno del servidor.
 */
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

/**
 * @swagger
 * /api/products/home:
 *   get:
 *     summary: Obtener lista de productos paginada.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número de página.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Número de elementos por página.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         description: Campo para ordenar (price).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de productos paginada.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { products: [...], hasPrevPage: true, hasNextPage: true, nextPage: 2, prevPage: 1 }
 *       401:
 *         description: Acceso no autorizado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/home", redirectToLogin, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort } = req.query;

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
      await productsModel.paginate(
        {},
        { sort: { price: sort }, page, limit, lean: true }
      );

    const prevLink = hasPrevPage
      ? `/api/products/home?page=${prevPage}&limit=${limit}`
      : null;
    const nextLink = hasNextPage
      ? `/api/products/home?page=${nextPage}&limit=${limit}`
      : null;
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
/**
 * @swagger
 * /api/carts/{cid}/details:
 *   get:
 *     summary: Obtener detalles de un carrito por ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del carrito
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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

router.get("/", (req, res) => {
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

router.get("/profile", redirectToLogin, (req, res) => {
  res.render("profile", {
    user: req.user,
  });
});

function redirectToLogin(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect("/");
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

router.get("/users", async (req, res) => {
  if (req.user && req.user.role === "admin") {
    res.render("users");
  } else {
    res.send("No tienes los permisos necesarios para acceder a esta página");
  }
});

// Función para obtener los productos del carrito
function getProductsFromCart(cart) {
  const formattedProducts = cart.products.map((item) => {
    const product = item.product;
    return {
      title: product.title,
      quantity: item.quantity,
      price: product.price,
      cartId: cart._id,
    };
  });
  console.log(formattedProducts);
  return formattedProducts;
}

/// Calcula el total de la compra
function calculateTotal(products) {
  const total = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  console.log(total);
  return total;
}

// Ruta para el proceso de pago
router.get("/checkout", async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Obtener los productos en el carrito y el total de la compra
    const products = getProductsFromCart(req.user.cart);
    const total = calculateTotal(products);
    console.log(products, total);

    // Renderizar la vista de proceso de pago con los productos y el total
    res.render("checkout", { products, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
});

// Ruta para la confirmación de pedido
router.post("/confirmation", async (req, res) => {
  try {
    const total = req.body.total;

    // Generar el ticket de compra
    const result = await ticketService(req.user, total);

    // Construir el objeto ticket con las propiedades directas
    const ticket = {
      code: result.code,
      purchase_datetime: result.purchase_datetime,
      amount: result.amount,
      purchaser: result.purchaser,
    };

    // Renderizar la vista de confirmación de pedido con el ticket como contexto
    res.render("confirmation", { ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al mostrar la confirmación" });
  }
});

export default router;

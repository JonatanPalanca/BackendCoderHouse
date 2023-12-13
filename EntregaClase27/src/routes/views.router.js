import { Router } from "express";
import { productPath } from "../utils.js";
import ProductManager from "../dao/dbManager/products.manager.js";
import ChatManager from "../dao/dbManager/chat.manager.js";
import CartManager from "../dao/dbManager/carts.manager.js";
import { productsModel } from "../dao/dbManager/models/products.model.js";

const router = Router();
const productManager = new ProductManager(productPath);
const chatManager = new ChatManager();
const cartManager = new CartManager();

const publicAccess = (req, res, next) => {
  if (req.session?.user) return res.redirect("/home");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/login");
  next();
};

router.get("/home", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort,
      queryValue,
      query,
      category,
      availability,
    } = req.query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (availability) {
      filters.availability = availability === "true";
    }

    const filtered =
      query == "price" || query == "stock"
        ? { [query]: { $gt: queryValue }, ...filters }
        : queryValue
        ? { [query]: { $regex: queryValue, $options: "i" }, ...filters }
        : { ...filters };

    const sorted = sort ? { price: sort } : {};

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
      await productsModel.paginate(filtered, {
        sort: sorted,
        page,
        limit,
        lean: true,
      });

    const prevLink = queryValue
      ? `/home?page=${prevPage}&limit=${limit}&queryValue=${queryValue}&query=${query}&category=${category}&availability=${availability}`
      : `/home?page=${prevPage}&limit=${limit}`;

    const nextLink = queryValue
      ? `/home?page=${nextPage}&limit=${limit}&queryValue=${queryValue}&query=${query}&category=${category}&availability=${availability}`
      : `/home?page=${nextPage}&limit=${limit}`;

    res.render("home", {
      user: req.session.user,
      products: docs,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      limit,
      query,
      queryValue,
      prevLink,
      nextLink,
      category,
      availability,
    });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});
router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    res.render("cart", { cart });
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/chat", async (req, res) => {
  const messages = await chatManager.getAll();
  res.render("chat", { messages });
});

router.get("/", (req, res) => {
  if (req.session?.user) {
    // Si el usuario tiene una sesión activa, redirigir a la página de home
    res.redirect("/home");
  } else {
    // Si el usuario no tiene una sesión activa, redirigir a la página de login
    res.redirect("/login");
  }
});
router.get("/register", publicAccess, (req, res) => {
  res.render("register");
});

router.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/profile", privateAccess, (req, res) => {
  const user = req.session.user;
  res.render("profile", { user });
});

export default router;

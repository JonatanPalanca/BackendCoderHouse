import { Router } from "express";
const router = Router();
import { productPath } from "../utils.js";
import ProductManager from "../dao/dbManager/products.manager.js";
import ChatManager from "../dao/dbManager/chat.manager.js";
import CartManager from "../dao/dbManager/carts.manager.js";
import { productsModel } from "../dao/dbManager/models/products.model.js";

const productManager = new ProductManager(productPath);
const chatManager = new ChatManager();
const cartManager = new CartManager();

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
});
router.get("/products", async (req, res) => {
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

    // Filtrar por categoría y/o disponibilidad si se proporcionan
    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (availability) {
      filters.availability = availability === "true"; // Asegúrate de que sea un booleano
    }

    // Configurar la consulta con los filtros y la paginación
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

    // Construir los enlaces para la paginación
    const prevLink = queryValue
      ? `/products?page=${prevPage}&limit=${limit}&queryValue=${queryValue}&query=${query}&category=${category}&availability=${availability}`
      : `/products?page=${prevPage}&limit=${limit}`;

    const nextLink = queryValue
      ? `/products?page=${nextPage}&limit=${limit}&queryValue=${queryValue}&query=${query}&category=${category}&availability=${availability}`
      : `/products?page=${nextPage}&limit=${limit}`;

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

//router.get("/", async (req, res) => {
// try {
//    const { page = 1, limit = 10, sort } = req.query;
//si no manda nada, asumo page 1 y limit 10.
//        const {docs,hasPrevPage,hasNextPage,nextPage,prevPage}=await productsModel.paginate({},{sort:{price:1},page,limit,lean:true})
//  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
//  await productsModel.paginate(
//  {},
//     { sort: { price: sort }, page, limit, lean: true }
//     );
//flags para saber si botón hacia adelante o hacia atrás.
//primer parámetro de paginate filtro de búsqueda; segundo parámetro parámetros de paginación. Limit fijado en 5, page viene del query. Lean por el POJO.
//const products = await productManager.getAll();
//    const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${limit}` : null;
//    const nextLink = hasNextPage ? `/?page=${nextPage}&limit=${limit}` : null;
//  res.send({
//     status: "success",
//    payload: docs,
//   hasPrevPage,
//   hasNextPage,
//   nextPage,
//   prevPage,
//   totalPages,
//  page,
//   prevLink,
//   nextLink,
// });
//} catch (error) {
// return res.send({ status: "error", error: error });
// }
//});

//paginate({},{limit:3,page:1});
// router.get("/",async (req,res)=>{
//     try{
//         const {page=1} = req.query;
//         //si no manda nada, asumo page 1.
//         const {docs,hasPrevPage,hasNextPage,nextPage,prevPage}=await studentsModel.paginate({},{limit:5,page,lean:true})
//         //flags para saber si botón hacia adelante o hacia atrás.
//         //primer parámetro de paginate filtro de búsqueda; segundo parámetro parámetros de paginación. Limit fijado en 5, page viene del query. Lean por el POJO.
//         //const products = await productManager.getAll();

//         res.render("home",{products:products});}
//         catch(error) {return res.send({ status: 'error', error: error })}
//     });

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
    // Si el usuario tiene una sesión activa, redirigir a la página de productos
    res.redirect("/products");
  } else {
    // Si el usuario no tiene una sesión activa, redirigir a la página de login
    res.redirect("/login");
  }
});
const publicAccess = (req, res, next) => {
  if (req.session?.user) return res.redirect("/");
  next();
};

const privateAccess = (req, res, next) => {
  if (!req.session?.user) return res.redirect("/login");
  next();
};

router.get("/register", publicAccess, (req, res) => {
  res.render("register");
});

router.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

router.get("/", privateAccess, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

router.get("/profile", (req, res) => {
  const user = req.session.user;

  res.render("profile", { user });
});
export default router;

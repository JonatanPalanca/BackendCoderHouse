import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManagers.js";
import path from "node:path";
const productsFilePath = path.join(__dirname, "./files/products.json");
const productManager = new ProductManager(productsFilePath);

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

const server = app.listen(8080, () => console.log("se levantó el puerto 8080"));
const io = new Server(server);

const realtimeProductsNamespace = io.of("/realtimeproducts");

realtimeProductsNamespace.on("connection", (socket) => {
  console.log("Cliente conectado a la vista en tiempo real");

  socket.on("agregarProducto", async (data) => {
    try {
      const nuevoProducto = JSON.parse(data);
      if (nuevoProducto.title && nuevoProducto.price) {
        await productManager.addProduct(nuevoProducto);
        const productos = await productManager.getProducts();
        realtimeProductsNamespace.emit("mostrartodo", productos);
      } else {
        console.error("Los datos del producto son incorrectos.");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  socket.on("eliminarProducto", async (data) => {
    try {
      const id = Number(data);
      await productManager.deleteProduct(id);
      const productos = await productManager.getProducts();
      realtimeProductsNamespace.emit("mostrartodo", productos);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });
});

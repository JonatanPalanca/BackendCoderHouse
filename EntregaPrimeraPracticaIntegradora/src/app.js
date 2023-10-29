import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import path from "node:path";
import mongoose from "mongoose";
import { Products } from "./dao/dbManagers/models/products.model.js";
import { Messages } from "./dao/dbManagers/models/messages.model.js";
import messagesRouter from "./routes/messages.router.js";
import productsRouter from "./routes/products.router.js";

const app = express();

app.get("/chat", (req, res) => {
  res.render("chat");
});

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/products", productsRouter);
app.set("views", path.join(__dirname, "views"));

// Establecer la conexión a la base de datos
try {
  await mongoose.connect(
    "mongodb+srv://palancajonatan:j15680484@backendpj.gwxrlxf.mongodb.net/ecommerce?retryWrites=true&w=majority"
  );
  console.log("BDD conectada");
} catch (error) {
  console.log(error.message);
}

const server = app.listen(8080, () => console.log("Se levantó el puerto 8080"));
const io = new Server(server);

const realtimeProductsNamespace = io.of("/realtimeproducts");

realtimeProductsNamespace.on("connection", (socket) => {
  console.log("Cliente conectado a la vista en tiempo real");

  socket.on("agregarProducto", async (data) => {
    try {
      const nuevoProducto = JSON.parse(data);
      if (nuevoProducto.title && nuevoProducto.price) {
        // Crea un nuevo documento de producto con los datos del cliente
        const product = new Products({
          title: nuevoProducto.title,
          price: nuevoProducto.price,
        });

        // Guarda el producto en la base de datos
        await product.save();

        const productos = await Products.find(); // Obtén la lista actualizada de productos
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
      const id = data;

      // Encuentra el producto por su ID y elimínalo
      await Products.findByIdAndRemove(id);

      const productos = await Products.find();
      realtimeProductsNamespace.emit("mostrartodo", productos);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });
});

const realtimeChatNamespace = io.of("/chat");

realtimeChatNamespace.on("connection", (socket) => {
  console.log("Cliente conectado al chat en tiempo real");

  socket.on("message", async (data) => {
    try {
      const { user, message } = data;

      // Crea un nuevo documento de mensaje con los datos del cliente
      const newMessage = new Messages({ user, message });

      // Guarda el mensaje en la base de datos
      await newMessage.save();

      // Emitir el mensaje a todos los clientes conectados, incluido el remitente
      realtimeChatNamespace.emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  });
});

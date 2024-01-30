import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { __dirname, chatPath, productPath } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import { ProductManager, ChatManager } from "./dao/factory.js";
import { initializePassport } from "./config/passport.config.js";
import configs from "./config/config.js";
import errorHandler from "./middlewares/errors/index.js";
import logger from "./utils/logger.js";
import Chats from "./dao/dbManager/chat.db.js";
import Product from "./dao/dbManager/models/products.model.js";
import Users from "./dao/dbManager/users.db.js";
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Static Files
app.use(express.static(`${__dirname}/public`));

// Cookie Parser
app.use(cookieParser());

// Error Handler
app.use(errorHandler);

// Session Middleware
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: configs.mongoUrl,
      ttl: 3600,
    }),
    secret: "Coder5575Secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", usersRouter);

// 404 Not Found
app.use((req, res) => {
  res.status(404).send("Error 404: Page Not Found");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(422).json({
      type: err.type,
      message: err.error.toString(),
    });
  } else {
    next(err);
  }
});

// Database Connection
try {
  await mongoose.connect(configs.mongoUrl);
  console.log("Connected to DB");
} catch (error) {
  console.error("Error connecting to DB:", error.message);
}

const chatManager = new Chats();
const usersManager = new Users();
// Socket.io Setup
const server = app.listen(8080, () => console.log("Server running"));
const io = new Server(server);
app.set("socketio", io);

io.on("connection", async (socket) => {
  try {
    // Obtén todos los mensajes existentes
    const messages = await chatManager.getAll();

    // Envia los mensajes existentes al cliente recién conectado
    socket.emit("messageLogs", messages);

    // Notifica a los demás clientes que un nuevo usuario se ha conectado
    socket.broadcast.emit("newUserConnected", {});

    // Maneja el evento 'message'
    socket.on("message", async (data) => {
      // Guarda el nuevo mensaje
      await chatManager.save(data);

      // Obtiene todos los mensajes actualizados
      const newMessages = await chatManager.getAll();

      // Emite los mensajes actualizados a todos los clientes
      io.emit("messageLogs", newMessages);
    });

    // Modifica el evento 'createProduct' en el servidor
    socket.on("createProduct", async ({ productData, userId }) => {
      try {
        // Verifica si el usuario es premium antes de permitir la creación del producto
        const user = await usersManager.getUserById(userId);
        if (!user || user.role !== "premium") {
          console.log("No tienes permisos premium para crear productos.");
          return;
        }

        // Si el producto se crea sin owner, establece "admin" por defecto
        const ownerEmail = productData.owner || "admin";

        // Asegúrate de validar y procesar los datos recibidos según tus necesidades
        // En este ejemplo, simplemente se crea un nuevo producto y se guarda en la base de datos
        const newProduct = new Product({
          title: productData.title,
          description: productData.description,
          // Otros campos del producto
          owner: ownerEmail,
        });

        await newProduct.save();

        // Emite un evento para informar a todos los clientes sobre el nuevo producto
        io.emit("showProducts", { products: await Product.find() });
      } catch (error) {
        console.error("Error al crear el producto:", error);
      }
    });

    // Escucha el evento 'getUserInfo' después de que se haya emitido 'userId'
    socket.on("getUserInfo", async ({ userId }) => {
      try {
        const user = await usersManager.getUserById(userId);
        socket.emit("userInfo", { user: { ...user, email: user.email } });
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    });
  } catch (error) {
    console.error("Error en el evento de conexión:", error);
  }
});

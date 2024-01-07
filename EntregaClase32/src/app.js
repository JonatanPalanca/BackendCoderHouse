import express from "express";
import handlebars from "express-handlebars";
import { __dirname, chatPath, productPath } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
// import ProductManager from "./dao/dbManager/products.db.js";
// import ChatManager from "./dao/dbManager/chat.db.js";
import { ProductManager, ChatManager } from "./dao/factory.js";
const chatManager = new ChatManager(chatPath);
const productManager = new ProductManager(productPath);
// import ChatManager from "./dao/fileManager/chat.file.js";
// const chatManager= new ChatManager(chatPath);
import usersRouter from "./routes/users.router.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import configs from "./config.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errors/index.js";

const app = express();

try {
  await mongoose.connect(configs.mongoUrl);
  console.log("Connected to DB");
} catch (error) {
  console.log(error.message);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.use(cookieParser());
app.use(errorHandler);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600,
    }),
    secret: "Coder5575Secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", usersRouter);
app.use((req, res) => {
  res.status(404).send("Error 404: Page Not Found");
});

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

const server = app.listen(8080, () => console.log("Server running"));
const io = new Server(server);
app.set("socketio", io);

io.on("connection", async (socket) => {
  const messages = await chatManager.getAll();
  console.log("Nuevo cliente conectado");

  socket.on("authenticated", (data) => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", data);
  });

  socket.on("message", async (data) => {
    await chatManager.save(data);
    const newMessage = await chatManager.getAll();
    io.emit("messageLogs", newMessage);
  });
});

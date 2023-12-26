import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import ChatManager from "./dao/mongo/chat.manager.js";
import ProductManager from "./dao/mongo/products.mongo.js";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/sessions.router.js";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import usersRouter from "./routes/users.router.js";
import configs from "./config/config.js";

const app = express();
console.log(configs);
const fileStore = FileStore(session);
const productManager = new ProductManager();
const chatManager = new ChatManager();

app.engine("handlebars", handlebars.engine()); //qué motor de plantillas uso//
app.set("views", `${__dirname}/views`); //donde están las vistas, con path abs//
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

const server = app.listen(8080, () => console.log("Server conectado"));

//const socketServer = new Server(server);
const io = new Server(server);
app.set("socketio", io);

//const messages = [];

io.on("connection", async (socket) => {
  const messages = await chatManager.getAll();
  console.log("Nuevo cliente conectado");
  //lee el evento authenticated; el frontend es index.js. Leemos la data (lo que envío desde index.js)
  socket.on("authenticated", (data) => {
    socket.emit("messageLogs", messages); //Enviamos todos los mensajes hasta el momento, únicamnete a quien se acaba de conectar.
  });
  //lee el evento message
  socket.on("message", async (data) => {
    //messages.push(data);
    await chatManager.save(data);
    const newMessage = await chatManager.getAll();
    io.emit("messageLogs", newMessage); //envío a todos lo que hay almacenado.
  });
});

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://palancajonatan:j15680484@backendpj.gwxrlxf.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 30,
    }),
    secret: "PalancaSecret",
    resave: true, //nos sirve para poder refrescar o actualizar la sesión luego de un de inactivadad
    saveUninitialized: true, //nos sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
    // cookie: {
    //     maxAge: 30000
    // }
  })
);
//Passport config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

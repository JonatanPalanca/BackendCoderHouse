import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ChatManager from "./dao/dbManager/chat.manager.js";
import ProductManager from "./dao/dbManager/products.manager.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/sessions.router.js";

const fileStore = FileStore(session);
const productManager = new ProductManager();
const chatManager = new ChatManager();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine()); //qué motor de plantillas uso//
app.set("views", `${__dirname}/views`); //donde están las vistas, con path abs//
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

try {
  await mongoose.connect(
    "mongodb+srv://palancajonatan:j15680484@backendpj.gwxrlxf.mongodb.net/ecommerce?retryWrites=true&w=majority"
  );
  console.log("Conectado a la bade de datos");
} catch (error) {
  console.log(error.message);
}
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

//Cookies, Session & Storage

// app.use(session({
//     store: new fileStore({
//         path: `${__dirname}/sessions`,
//         ttl: 360,
//         retries: 0
//     }),
//     secret: 'Coder5575Secret',
//     resave: true, //nos sirve para poder refrescar o actualizar la sesión luego de un de inactivadad
//     saveUninitialized: false, //nos sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
//     // cookie: {
//     //     maxAge: 30000
//     // }
// }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://palancajonatan:j15680484@backendpj.gwxrlxf.mongodb.net/ecommerce?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 10,
    }),
    secret: "PalancaSecret",
    resave: true, //nos sirve para poder refrescar o actualizar la sesión luego de un de inactivadad
    saveUninitialized: true, //nos sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
    // cookie: {
    //     maxAge: 30000
    // }
  })
);

app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

//function auth(req, res, next) {
//  if (req.session?.user === "pepe" && req.session?.admin) {
//    return next();
//  }

//return res.status(401).send("Error de validación de permisos");
//}

//app.get("/session", (req, res) => {
//  if (req.session.counter) {
//    req.session.counter++;
//    res.send(`Se ha vistido el sitio ${req.session.counter} veces`);
//  } else {
//    req.session.counter = 1;
//    res.send("Bienvenido");
//  }
//});

//app.get("/login", (req, res) => {
//  const { username, password } = req.query;
//
//  if (username !== "pepe" || password !== "pepepass") {
//    return res.status(401).send("Login fallido");
//  }

//  req.session.user = username;
//  req.session.admin = true;
//  res.send("Login exitoso");
//});

//app.get("/private", auth, (req, res) => {
//  res.send("Tienes permisos para acceder a este servicio");
//});

//app.get("/logout", (req, res) => {
//req.session.destroy((error) => {
//    if (!error) res.send("Logout exitoso");
//    else res.send({ status: "error", message: error.message });
//  });
//});

import express from "express";
import nodemailer from "nodemailer";
import twilio from "twilio";
import handlebars from "express-handlebars";
import { __dirname, chatPath, productPath } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { ProductManager, ChatManager } from "./dao/factory.js";
const chatManager = new ChatManager(chatPath);
const productManager = new ProductManager(productPath);
import usersRouter from "./routes/users.router.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import configs from "./config.js";
import sessionsRouter from "./routes/sessions.router.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errors/index.js";
import { addLogger } from "./logger.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swaggerConfig.js";

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
app.use(addLogger);

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

app.get("/sms", async (req, res) => {
  await client.messages.create({
    from: TWILIO_NUMBER,
    to: "+5491160520881",
    body: "Prueba Twilio",
  });
  res.send("SMS enviado");
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// Configurar CORS
app.use(cors());

app.use(errorHandler);

app.post("/api/payment", async (req, res) => {
  const { user, totalPrice } = req.body;
  try {
    // Aquí deberías llamar a la función que maneja la creación del ticket
    const ticket = await handlePayment(user, totalPrice);

    // Devolver el ticket como respuesta
    res.json(ticket);
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(500).json({ error: "Error al procesar el pago" });
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

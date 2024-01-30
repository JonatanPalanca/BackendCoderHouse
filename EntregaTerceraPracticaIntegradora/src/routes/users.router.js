import { Router } from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { passportStrategiesEnum, accessRolesEnum } from "../config/enums.js";
import { config } from "dotenv";
import { generateToken, authorization, createHash } from "../utils.js";
import { passportCall } from "../config/passport.config.js";
import { getUserCurrent } from "../controllers/users.controller.js";
import Users from "../dao/dbManager/users.db.js";
import logger from "../utils/logger.js";
import configs from "../config/config.js";
import usersModel from "../dao/dbManager/models/users.model.js";

const router = Router();
const usersManager = new Users();

router.post(
  "/register",
  passport.authenticate(passportStrategiesEnum.REGISTER, {
    failureRedirect: "/fail-register",
  }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "user registered" });
    logger.info(`POST /register - Successful`);
  }
);

router.get("/fail-register", async (req, res) => {
  res.status(500).send({ status: "error", message: "registration failed" });
  logger.error(`GET /fail-register - Registration failed`);
});

router.post(
  "/login",
  passport.authenticate(passportStrategiesEnum.LOGIN, {
    failureRedirect: "/fail-login",
  }),
  async (req, res) => {
    if (!req.user) {
      console.error("Authentication failed:", req.authInfo);
      logger.error(`POST /login - Authentication failed: ${req.authInfo}`);
      return res.status(401).send({
        status: "error",
        message: "Authentication failed",
      });
    }

    const sanitizedUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      isAdmin: req.user.email === config.mailAdmin,
      role: req.user.role,
    };

    const accessToken = generateToken(sanitizedUser);
    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ status: "success", message: "login success" });
    logger.info(`POST /login - Successful`);
  }
);

router.get(
  "/current",
  passportCall("jwt"),
  authorization(accessRolesEnum.ADMIN),
  getUserCurrent
);

router.get("/fail-login", async (req, res) => {
  res.status(500).send({ status: "error", message: "login failed" });
  logger.error(`GET /fail-login - Login failed`);
});

router.get("/logout", (req, res) => {
  res.clearCookie("coderCookieToken").redirect("/login");
  logger.info(`GET /logout - Logout successful`);
});

router.get(
  "/github",
  passport.authenticate(passportStrategiesEnum.GITHUB, {
    scope: ["user:email"],
  }),
  async (req, res) => {
    res.send({ status: "success", message: "user registered" });
    logger.info(`GET /github - Successful`);
  }
);

router.get(
  "/github-callback",
  passport.authenticate(passportStrategiesEnum.GITHUB, {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.newUser = req.user;
    req.newUser = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      isAdmin: req.user.email === "adminCoder@coder.com",
      role: req.user.role,
    };
    const accessToken = generateToken(req.newUser);
    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/products");
    logger.info(`GET /github-callback - Successful`);
  }
);

// Enviar el correo electrónico con el enlace de restablecimiento
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Por favor, ingrese un correo electrónico.",
      });
    }

    const user = await usersManager.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message:
          "Usuario no encontrado. Por favor, verifique el correo electrónico.",
      });
    }

    const resetToken = generateToken(user);

    // Asegúrate de que `user` sea una instancia del modelo `usersModel`
    if (!(user instanceof usersModel)) {
      return res.status(500).json({
        status: "error",
        message: "Invalid user instance",
      });
    }

    // Guardar el token de restablecimiento en la base de datos
    user.resetToken = createHash(resetToken);
    user.resetTokenExpiration = Date.now() + 3600;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "palancajonatan45@gmail.com",
        pass: "ccle fbvc xxrm vava",
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const resetLink = `http://localhost:8080/reset-password/${resetToken}`;

    const mailOptions = {
      from: configs.mailAdmin,
      to: email,
      subject: "Recuperación de Contraseña",
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    // Redirigir a la página de éxito o mensaje
    return res.redirect(`/`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error al enviar el correo electrónico",
    });
  }
});

// Restablecer la contraseña
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const resetToken = req.params.token;

    const user = await usersManager.getUserByResetToken(resetToken);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    // Verificar si la contraseña es diferente de la actual
    if (createHash(resetToken) === user.resetToken) {
      return res.status(400).json({
        status: "error",
        message: "No se puede usar la misma contraseña",
      });
    }

    // Validar que el token no haya expirado
    if (Date.now() > user.resetTokenExpiration) {
      return res
        .status(400)
        .json({ status: "error", message: "El enlace ha expirado" });
    }

    // Validar que la contraseña y la confirmación coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "La contraseña y la confirmación no coinciden",
      });
    }

    // Restablecer la contraseña y limpiar el token de restablecimiento
    user.password = createHash(password);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    // Redirigir a la página de éxito o mensaje
    return res.redirect(`/password-reset-success`);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Error al restablecer la contraseña" });
  }
});
export default router;

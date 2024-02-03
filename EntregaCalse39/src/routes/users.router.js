import { Router } from "express";
import passport from "passport";
import { passportStrategiesEnum, accessRolesEnum } from "../config/enums.js";
import { config } from "dotenv";
import {
  generateToken,
  authorization,
  createHash,
  isValidPassword,
} from "../utils.js";
import { passportCall } from "../config/passport.config.js";
import {
  getUserCurrent,
  updatePremiumStatus,
} from "../controllers/users.controller.js";
import usersModel from "../dao/dbManager/models/users.model.js";
import { sendEmail } from "../services/mail.service.js";
const router = Router();

router.post(
  "/register",
  passport.authenticate(passportStrategiesEnum.REGISTER, {
    failureRedirect: "fail-register",
  }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "user registered" });
  }
);

router.get("/fail-register", async (req, res) => {
  res.status(500).send({ status: "error", message: "register fail" });
});

router.post(
  "/login",
  passport.authenticate(passportStrategiesEnum.LOGIN, {
    failureRedirect: "fail-login",
  }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", message: "invalid credentials" });
    }
    req.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      isAdmin: req.user.email == config.mailAdmin,
      role: req.user.role,
    };
    const accessToken = generateToken(req.user);
    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ status: "success", message: "login success" });
  }
);

router.get(
  "/current",
  passportCall("jwt"),
  authorization(accessRolesEnum.ADMIN),
  getUserCurrent
);

router.get("/fail-login", async (req, res) => {
  res.status(500).send({ status: "error", message: "login fail" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("coderCookieToken").redirect("/login");
});

router.put("/premium/:uid", updatePremiumStatus);

router.post("/restore", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      console.error("Correo electrónico no proporcionado en la solicitud");
      return res.status(400).send({
        status: "error",
        message: "Correo electrónico no proporcionado",
      });
    }

    console.log(
      "Restauración de contraseña para el correo electrónico:",
      email
    );

    const user = await usersModel.findOne({ email: email });

    if (!user) {
      console.error("Usuario no encontrado en la base de datos");
      return res
        .status(404)
        .send({ status: "error", message: "Usuario no encontrado" });
    }

    req.user = {
      email: user.email,
    };
    const accessToken = generateToken(req.user);

    await sendEmail(email);

    return res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 1 * 60 * 1000,
        httpOnly: true,
      })
      .send({ status: "success", message: "Correo Enviado" });
  } catch (error) {
    console.error("Error en la restauración de contraseña:", error);
    res.status(500).send({ error: error.message });
  }
});

router.put("/reset", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }
    if (isValidPassword(password, user.password)) {
      return res.status(404).send({
        status: "error",
        message: "La nueva contraseña debe ser diferente de la anterior",
      });
    }
    const result = await usersModel.updateOne(
      { email: email },
      { $set: { password: createHash(password) } }
    );
    return res
      .clearCookie("coderCookieToken")
      .send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;

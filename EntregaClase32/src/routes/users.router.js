import { Router } from "express";
import passport from "passport";
import { passportStrategiesEnum, accessRolesEnum } from "../config/enums.js";
import { config } from "dotenv";
import { generateToken, authorization } from "../utils.js";
import { passportCall } from "../config/passport.config.js";
import { getUserCurrent } from "../controllers/users.controller.js";

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

router.get(
  "/github",
  passport.authenticate(passportStrategiesEnum.GITHUB, {
    scope: ["user:email"],
  }),
  async (req, res) => {
    res.send({ status: "success", message: "user registered" });
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
      isAdmin: req.user.email == "adminCoder@coder.com",
      role: req.user.role,
    };
    const accessToken = generateToken(req.newUser);
    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/products");
  }
);

export default router;

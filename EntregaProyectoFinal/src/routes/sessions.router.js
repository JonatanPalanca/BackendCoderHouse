import { Router } from "express";
import passport from "passport";
import { passportStrategiesEnum, accessRolesEnum } from "../config/enums.js";
import { config } from "dotenv";
import { generateToken, authorization } from "../utils.js";

const router = Router();

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
    failureRedirect: "/",
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

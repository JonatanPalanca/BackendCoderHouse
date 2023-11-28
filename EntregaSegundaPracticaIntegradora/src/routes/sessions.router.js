import { Router } from "express";
import usersModel from "../dao/dbManager/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "fail-register" }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "user registered" });
  }
);

router.get("/fail-register", async (req, res) => {
  res.status(500).send({ status: "error", message: "register fail" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "fail-login" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", message: "invalid credentials" });
    }
    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
    };

    res.send({ status: "success", message: "login success" });
  }
);

router.get("/fail-login", async (req, res) => {
  res.status(500).send({ status: "error", message: "login fail" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res.status(500).send({ status: "error", message: error.message });
    res.redirect("/");
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.send({ status: "success", message: "user registered" });
  }
);

router.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);
// Ruta para obtener el usuario actual
router.get("/current", async (req, res) => {
  try {
    // Verificar si el usuario está autenticado
    if (req.isAuthenticated()) {
      const userId = req.user._id; // ID del usuario actual obtenido de la sesión
      const user = await usersModel.findById(userId);

      if (user) {
        // Devolver los datos del usuario actual
        return res.status(200).json({ user });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(401).json({ message: "User not authenticated" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching current user", error });
  }
});

export default router;

import schedule from 'node-schedule';
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
import multer from "multer";


const router = Router();

// Configuración de Multer para guardar archivos en diferentes carpetas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = "uploads/documents/";

    // Determinar la carpeta de destino según el tipo de archivo
    if (file.fieldname === "profileImage") {
      destinationFolder = "uploads/profiles/";
    } else if (file.fieldname === "productImage") {
      destinationFolder = "uploads/products/";
    }

    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Endpoint para subir documentos
router.post(
  "/:uid/documents",
  upload.array("documents", 5),
  async (req, res) => {
    try {
      const userId = req.params.uid;
      const files = req.files;

      // Actualizar el usuario con los documentos subidos
      const user = await usersModel.findByIdAndUpdate(
        userId,
        {
          $set: { status: "documentos_subidos" },
          $push: {
            documents: files.map((file) => ({
              name: file.originalname,
              reference: file.filename,
            })),
          },
        },
        { new: true }
      );

      res.status(200).send({ status: "success", user });
    } catch (error) {
      console.error("Error al subir documentos:", error);
      res.status(500).send({ status: "error", message: error.message });
    }
  }
);



router.get("/", async (req, res) => {
  try {
    const users = await usersModel.find({}, "first_name last_name email role");
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ status: "error", message: error.message });
  }
});


router.delete("/:uid/delete", async (req, res) => {
  try {
    const userId = req.params.uid;
    const productId = req.body.productId;

    const user = await usersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await productsModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (user.role === "premium" && product.owner === userId) {
      await productsModel.findByIdAndDelete(productId);

      // Enviar correo electrónico al usuario premium
      await sendEmail(user.email, "productDeleted");

      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return res.status(403).json({ message: "Unauthorized action" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:uid/update-role", async (req, res) => {
  try {
    const email = req.params.uid;
    const { role } = req.body;

    // Buscar al usuario por su correo electrónico
    const user = await usersModel.findOne({ email: email });

    // Si el usuario no existe, devolver un error
    if (!user) {
      return res.status(404).send({ status: "error", message: "Usuario no encontrado" });
    }

    // Verificar si el usuario ya es administrador
    if (user.role === "admin" && role === "admin") {
      return res.status(400).send({ status: "error", message: "El usuario ya es administrador" });
    }

    // Verificar si el usuario es premium y está intentando cambiar su propio rol
    if (user.role === "premium" && user.email === req.user.email) {
      return res.status(400).send({ status: "error", message: "No se puede cambiar el rol de un usuario premium" });
    }

    // Actualizar el rol del usuario
    user.role = role;
    await user.save();

    // Si el usuario actualiza el rol de otro usuario y ese otro usuario es premium, enviar correo
    if (user.role === "premium") {
      await sendEmail(user.email, "premiumRoleChanged");
    }

    res.json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    res.status(500).send({ status: "error", message: error.message });
  }
});


// Tarea programada para eliminar usuarios inactivos
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

// Ejecutar cada día a la medianoche
schedule.scheduleJob("0 0 * * *", async function () {
  try {
    const result = await usersModel.deleteMany({
      last_connection: { $lt: twoDaysAgo },
    });

    // Envía un correo a los usuarios eliminados
    const deletedUsers = result.deletedCount;
    if (deletedUsers > 0) {
      const message = "Tu cuenta ha sido eliminada por inactividad.";
      await sendEmailToDeletedUsers(message);
    }

    console.log(`${deletedUsers} usuarios eliminados`);
  } catch (error) {
    console.error("Error al eliminar usuarios inactivos:", error.message);
  }
});

async function sendEmailToDeletedUsers(message) {
  try {
    const deletedUsers = await usersModel.find({
      last_connection: { $lt: twoDaysAgo },
    });

    for (const user of deletedUsers) {
      await sendEmail(user.email, message);
    }

    console.log(`${deletedUsers.length} correos enviados a usuarios eliminados.`);
  } catch (error) {
    console.error("Error al enviar correos a usuarios eliminados:", error.message);
  }
}

router.post(
  "/register",
  passport.authenticate(passportStrategiesEnum.REGISTER, {
    failureRedirect: "fail-register",
  }),
  async (req, res) => {
    res.redirect("/login");
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

    // Verificar si el usuario ya está guardado en la base de datos
    let user = await usersModel.findOne({ email: req.user.email });

    // Si el usuario no está en la base de datos, guárdalo
    if (!user) {
      user = new usersModel(req.user);
      await user.save();
    }

    // Actualizar la propiedad last_connection al iniciar sesión
    user.last_connection = new Date();
    await user.save();

    req.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: user.cart,
      isAdmin: user.email == config.mailAdmin,
      role: user.role,
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

router.get("/logout", async (req, res) => {
  // Actualizar la propiedad last_connection al cerrar sesión
  if (req.user) {
    req.user.last_connection = new Date();
    await req.user.save();
  }

  // Limpiar la cookie y redirigir al usuario a la página de inicio de sesión
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

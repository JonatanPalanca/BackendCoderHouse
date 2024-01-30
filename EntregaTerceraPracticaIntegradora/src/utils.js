import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";
import configs from "./config/config.js";
import jwt from "jsonwebtoken";
import logger from "./utils/logger.js";
import { accessRolesEnum } from "./config/enums.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const productPath = join(__dirname, "./files/productos.json");
export const cartPath = join(__dirname, "./files/carritos.json");
export const chatPath = join(__dirname, "./files/chats.json");
export const userPath = join(__dirname, "./files/users.json");
export const ticketPath = join(__dirname, "./files/tickets.json");

// Función para hashear una contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para validar una contraseña
export const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

// Función para generar un token JWT
export const generateToken = (user) => {
  const token = jwt.sign({ user, role: user.role }, configs.privateKeyJWT, {
    expiresIn: "1h",
  });
  return token;
};

// Middleware de autorización basado en roles
export const authorization = (role) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (userRole !== role && userRole !== accessRolesEnum.PREMIUM) {
        logger.warn(
          `Authorization failed for role: ${role}, User Role: ${userRole}`
        );
        return res
          .status(403)
          .send({ status: "error", message: "no permissions" });
      }

      next();
    } catch (error) {
      logger.error(`Authorization error: ${error.message}`);
      res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  };
};

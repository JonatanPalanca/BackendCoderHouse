import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//1. hashear nuestra contraseña
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//2. validar nuestro password
const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

const PRIVATE_KEY = "coder55575";

//Implementación de la generación del JWT y la validación
//DFJGKSDNFJGKSDNFGK345656398U5GSDFNGKJSDNFG23485KDFGNJSDG
const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

//midleware
const authToken = (req, res, next) => {
  //1. validamos que el token llegue en los headers del request
  const authToken = req.headers.authorization;

  if (!authToken)
    return res
      .status(401)
      .send({ status: "error", message: "not authenticated" });

  const token = authToken.split(" ")[1];
  //2. Validar el jwt
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res
        .status(401)
        .send({ status: "error", message: "not authenticated" });
    req.user = credentials.user;
    next();
  });
};

export { createHash, isValidPassword };
export { generateToken, authToken };
export const productPath = join(__dirname, "./files/productos.json");
export const cartPath = join(__dirname, "./files/carritos.json");

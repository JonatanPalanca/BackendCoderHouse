import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";
import configs from "./config.js";
import jwt from "jsonwebtoken";
import { fakerES as faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const productPath = join(__dirname, "./files/productos.json");
export const cartPath = join(__dirname, "./files/carritos.json");
export const chatPath = join(__dirname, "./files/chats.json");
export const userPath = join(__dirname, "./files/users.json");

//1. hashear nuestra contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//2. validar nuestro password
export const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

export const generateToken = (user) => {
  const token = jwt.sign({ user }, configs.privateKeyJWT, { expiresIn: "1h" });
  return token;
};
//Autenticación primer paso lo hace passport

export const authorization = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role)
      return res
        .status(403)
        .send({ status: "error", message: "no permissions" });
    next();
  };
};

const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    stock: faker.number.int(1),
    id: faker.database.mongodbObjectId(),
    image: faker.image.url(),
    code: faker.string.alphanumeric(10),
    description: faker.commerce.productDescription(),
  };
};

export { generateProduct };

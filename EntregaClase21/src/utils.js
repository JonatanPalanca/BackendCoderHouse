import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//1. hashear nuestra contraseña
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//2. validar nuestro password
const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

export { createHash, isValidPassword };
export const productPath = join(__dirname, "./files/productos.json");
export const cartPath = join(__dirname, "./files/carritos.json");

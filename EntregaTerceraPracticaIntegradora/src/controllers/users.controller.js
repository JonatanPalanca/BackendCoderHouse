import { getUserCurrent as getUserCurrentService } from "../services/users.service.js";
import logger from "../utils/logger.js";
import { createHash } from "../utils.js";

export const getUserCurrent = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await getUserCurrentService(email);
    res.status(200).send({ status: "success", payload: user });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ status: "error", error: error.message });
  }
};

export const updateUserPassword = async (email, newPassword) => {
  try {
    const hashedPassword = createHash(newPassword);

    const isUpdated = await updateUserPasswordService(email, hashedPassword);

    return isUpdated;
  } catch (error) {
    console.error("Error actualizando la contraseña:", error);
    return false;
  }
};

export const registerUser = async (req, res) => {
  try {
    const userData = req.body;

    // Lógica para registrar al usuario
    const newUser = await registerUserService(userData);

    // Luego, crea un carro y asigna el carro al usuario
    const cart = await createCartService();
    newUser.cart = cart._id;

    // Guarda los cambios en el usuario para agregar el carro
    await newUser.save();

    // Devuelve una respuesta exitosa
    res
      .status(201)
      .send({ status: "success", message: "User registered successfully" });
  } catch (error) {
    // Maneja errores aquí
    console.error(error);

    // Devuelve una respuesta de error
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
};

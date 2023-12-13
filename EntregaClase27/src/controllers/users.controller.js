import { login, register } from "../services/users.service.js";

const registerController = async (req, res) => {
  try {
    // Lógica para registrar un nuevo usuario
    const { name, email, password } = req.body;
    const accessToken = await register(name, email, password);
    res.send({ status: "success", access_token: accessToken });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    // Lógica para iniciar sesión
    const { email, password } = req.body;
    const accessToken = await login(email, password);
    res.send({ status: "success", access_token: accessToken });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export { registerController, loginController };

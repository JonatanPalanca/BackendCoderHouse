import UserManager from "../dao/dbManager/users.managers.js";

const userManager = new UserManager();

const register = async (name, email, password) => {
  try {
    if (!name || !email || !password) {
      throw new Error("Incomplete user information");
    }

    const accessToken = await userManager.registerUser(name, email, password);
    return accessToken;
  } catch (error) {
    throw new Error("User registration failed: " + error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    // Verifica si las credenciales corresponden al superadmin
    const isSuperAdmin = await userManager.loginSuperAdmin(email, password);

    if (isSuperAdmin) {
      // Si el usuario es el superadmin, se autentica como superadmin
      res.send({
        status: "success",
        message: "Superadmin logged in successfully",
      });
    } else {
      // Si no es superadmin, procede con la autenticación normal
      const accessToken = await userManager.loginUser(email, password);
      res.send({ status: "success", access_token: accessToken });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export { register, login };

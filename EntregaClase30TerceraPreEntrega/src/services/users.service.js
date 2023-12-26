import UserManager from "../dao/mongo/users.mongo.js";

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

const login = async (email, password) => {
  // Modificado: No recibe req, res
  try {
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    // Verifica si las credenciales corresponden al superadmin
    const isSuperAdmin = await userManager.loginSuperAdmin(email, password);

    if (isSuperAdmin) {
      // Si el usuario es el superadmin, se autentica como superadmin
      return {
        status: "success",
        message: "Superadmin logged in successfully",
      };
    } else {
      // Si no es superadmin, procede con la autenticación normal
      const accessToken = await userManager.loginUser(email, password);
      console.log("User logged in successfully");
      return { status: "success", access_token: accessToken };
    }
  } catch (error) {
    console.error("Login failed:", error); // Añadir registro de errores
    throw new Error("Login failed: " + error.message);
  }
};

export { register, login };

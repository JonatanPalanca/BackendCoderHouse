import { generateToken } from "../../utils.js";
import User from "../dbManager/models/users.model.js";
import bcrypt from "bcrypt";

export default class UserManagerDB {
  async registerUser(name, email, password) {
    try {
      if (!name || !email || !password) {
        throw new Error("Incomplete user information");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      const accessToken = generateToken(newUser);
      return accessToken;
    } catch (error) {
      throw new Error("User registration failed: " + error.message);
    }
  }

  async loginUser(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Please provide email and password");
      }

      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid credentials");
      }

      const accessToken = generateToken(user);
      return accessToken;
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  }

  async loginSuperAdmin(email, password) {
    try {
      const superAdminEmail = process.env.ADMIN_EMAIL;
      const superAdminPassword = process.env.ADMIN_PASSWORD;

      if (email === superAdminEmail && password === superAdminPassword) {
        // Obtener el usuario correspondiente al superadmin
        const user = await User.findOne({ email });

        // Verificar si el usuario existe y asignarle el rol de superadmin
        if (user) {
          user.role = "superadmin"; // Asignar el rol de superadmin
          await user.save();
        }

        return true;
      } else {
        throw new Error("Superadmin authentication failed");
      }
    } catch (error) {
      throw new Error("Superadmin authentication failed: " + error.message);
    }
  }
}

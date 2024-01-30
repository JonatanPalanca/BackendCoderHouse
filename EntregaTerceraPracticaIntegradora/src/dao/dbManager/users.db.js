import usersModel from "./models/users.model.js";

export default class Users {
  constructor() {}

  getUserById = async (userId) => {
    const user = await usersModel.findById(userId);
    return user;
  };

  getUserByEmail = async (email) => {
    const user = await usersModel.findOne({ email });
    return user;
  };

  save = async (user) => {
    const result = await usersModel.create(user);
    console.log(result);
    return result;
  };

  updateUserPassword = async (email, newPassword) => {
    try {
      // Encuentra y actualiza el usuario por su dirección de correo electrónico
      const updatedUser = await usersModel.findOneAndUpdate(
        { email },
        { $set: { password: newPassword } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar la contraseña del usuario:", error);
      return null;
    }
  };

  isUserPremium = async (email) => {
    const user = await this.getUserByEmail(email);
    return user && user.role === accessRolesEnum.PREMIUM;
  };
}

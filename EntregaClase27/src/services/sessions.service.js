import usersModel from "../dao/dbManager/models/users.model.js";

const SessionsService = {
  async getCurrentUser(req) {
    try {
      if (req.isAuthenticated()) {
        const userId = req.user._id;
        const user = await usersModel.findById(userId);

        if (user) {
          return user;
        } else {
          throw new Error("User not found");
        }
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      if (error.message === "User not authenticated") {
        throw new Error("User not authenticated");
      } else if (error.message === "User not found") {
        throw new Error("User not found");
      } else {
        throw new Error("Error fetching current user: " + error.message);
      }
    }
  },
};

export default SessionsService;

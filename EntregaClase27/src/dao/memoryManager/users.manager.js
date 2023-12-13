import { generateToken } from "../utils.js";

export default class UserManagerInMemory {
  constructor() {
    this.users = [];
  }

  async createUser(userData) {
    try {
      this.users.push(userData);
      return userData;
    } catch (error) {
      throw new Error("User creation failed: " + error.message);
    }
  }

  async getAllUsers() {
    try {
      return this.users;
    } catch (error) {
      throw new Error("Failed to get users: " + error.message);
    }
  }

  async getUserById(userId) {
    try {
      return this.users.find((user) => user._id === userId);
    } catch (error) {
      throw new Error("Failed to get user: " + error.message);
    }
  }

  async updateUser(userId, newData) {
    try {
      const index = this.users.findIndex((user) => user._id === userId);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...newData };
        return this.users[index];
      }
      throw new Error("User not found");
    } catch (error) {
      throw new Error("Failed to update user: " + error.message);
    }
  }

  async deleteUser(userId) {
    try {
      const index = this.users.findIndex((user) => user._id === userId);
      if (index !== -1) {
        const deletedUser = this.users.splice(index, 1)[0];
        return deletedUser;
      }
      throw new Error("User not found");
    } catch (error) {
      throw new Error("Failed to delete user: " + error.message);
    }
  }
}

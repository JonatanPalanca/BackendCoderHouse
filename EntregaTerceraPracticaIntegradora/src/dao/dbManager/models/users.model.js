import mongoose from "mongoose";
import { accessRolesEnum } from "../../../config/enums.js";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },

  last_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },

  role: {
    type: String,
    default: "user",
    enum: [
      accessRolesEnum.USER,
      accessRolesEnum.PREMIUM,
      accessRolesEnum.ADMIN,
    ],
  },
});

usersSchema.pre(["find", "findOne"], function () {
  this.populate("cart");
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;

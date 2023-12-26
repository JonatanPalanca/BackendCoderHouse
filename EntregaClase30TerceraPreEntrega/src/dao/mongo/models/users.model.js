import mongoose from "mongoose";

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
    unique: true, // Para garantizar que sea único
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ejemplo: longitud mínima de la contraseña
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts", // Referencia al modelo de Carts
  },
  role: {
    type: String,
    default: "user",
  },
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;

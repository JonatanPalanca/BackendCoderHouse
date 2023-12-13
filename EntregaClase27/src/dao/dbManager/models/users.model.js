import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

const User = mongoose.model("User", userSchema);

export default User;

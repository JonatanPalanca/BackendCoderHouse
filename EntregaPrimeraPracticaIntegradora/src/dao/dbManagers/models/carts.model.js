import mongoose from "mongoose";

const CartsCollection = "Carts";

// Define el esquema para Carts
const cartsSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
});

// Crea el modelo para Carts utilizando el esquema
const Carts = mongoose.model("Carts", cartsSchema);

export { Carts };

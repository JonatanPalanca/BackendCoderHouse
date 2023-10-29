import mongoose from "mongoose";

const ProductsCollection = "Products";

// Define el esquema para Products
const productsSchema = new mongoose.Schema({
  title: String,
  price: Number,
});

// Crea el modelo para Products utilizando el esquema
const Products = mongoose.model("Products", productsSchema);

export { Products };

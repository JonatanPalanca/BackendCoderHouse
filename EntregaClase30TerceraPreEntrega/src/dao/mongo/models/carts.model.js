import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          //tipo de dato del identificador del producto.
          //ahora hago la referencia:
          ref: "products", //la colección de productos en products.model se llama "products"
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;

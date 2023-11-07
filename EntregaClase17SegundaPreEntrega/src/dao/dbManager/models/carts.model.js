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

cartsSchema.pre(["find", "findOne"], function () {
  this.populate("products.product");
});
//Middleware que hace que cada vez que se ejecute una query find o findOne, se popule.
export const cartsModel = mongoose.model(cartsCollection, cartsSchema);

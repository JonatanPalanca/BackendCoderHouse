/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: number
 *                 default: 1
 *       example:
 *         products: [
 *           {
 *             product: {
 *               title: "Product A",
 *               description: "Description of Product A",
 *               price: 49.99,
 *               thumbnail: "image1.jpg",
 *               code: "ABC123",
 *               stock: 15
 *             },
 *             quantity: 2
 *           }
 *         ]
 */

import mongoose from "mongoose";
const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
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

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);

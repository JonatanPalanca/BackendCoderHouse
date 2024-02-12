import mongoose from "mongoose";
const productsCollecion = "products";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Título del producto.
 *         description:
 *           type: string
 *           description: Descripción del producto.
 *         price:
 *           type: number
 *           description: Precio del producto.
 *         thumbnail:
 *           type: string
 *           description: URL de la imagen del producto.
 *         code:
 *           type: string
 *           description: Código único del producto.
 *         category:
 *           type: string
 *           description: Categoría del producto.
 *         stock:
 *           type: number
 *           description: Cantidad disponible en stock.
 *         status:
 *           type: boolean
 *           default: true
 *           description: Estado del producto (activo o inactivo).
 *         owner:
 *           type: string
 *           default: admin
 *           description: Propietario del producto.
 */

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: String,
    default: "admin",
  },
});

productsSchema.plugin(mongoosePaginate);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones relacionadas con productos
 */

export const productsModel = mongoose.model(productsCollecion, productsSchema);

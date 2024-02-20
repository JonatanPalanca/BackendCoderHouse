import { Router } from "express";
import validator from "../middlewares/validator.js";
import {
  getProduct,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  mockingProducts,
} from "../controllers/products.controller.js";
import {
  getProductByIdSchema,
  productSchema,
} from "../schemas/products.schema.js";
import { authorization } from "../utils.js";
import { accessRolesEnum } from "../config/enums.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones relacionadas con productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 */

router.get("/", getProduct);

/**
 * @swagger
 * /api/products/mock:
 *   get:
 *     summary: Obtener productos simulados para pruebas
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos simulados
 */

router.get("/mockingproducts", mockingProducts);

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del producto
 */

router.get("/:pid", validator.params(getProductByIdSchema), getProductById);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       403:
 *         description: Permiso denegado
 */

router.delete(
  "/:pid",
  authorization([accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM]),
  validator.params(getProductByIdSchema),
  deleteProduct
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del producto.
 *               description:
 *                 type: string
 *                 description: Descripción del producto.
 *               price:
 *                 type: number
 *                 description: Precio del producto.
 *               thumbnail:
 *                 type: string
 *                 description: URL de la imagen del producto.
 *               code:
 *                 type: string
 *                 description: Código único del producto.
 *               category:
 *                 type: string
 *                 description: Categoría del producto.
 *               stock:
 *                 type: number
 *                 description: Cantidad disponible en stock.
 *               status:
 *                 type: boolean
 *                 default: true
 *                 description: Estado del producto (activo o inactivo).
 *               owner:
 *                 type: string
 *                 default: admin
 *                 description: Propietario del producto.
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *       403:
 *         description: Permiso denegado
 */

router.post(
  "/",
  authorization([accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM]),
  createProduct
);

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualizar un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del producto.
 *               description:
 *                 type: string
 *                 description: Descripción del producto.
 *               price:
 *                 type: number
 *                 description: Precio del producto.
 *               thumbnail:
 *                 type: string
 *                 description: URL de la imagen del producto.
 *               code:
 *                 type: string
 *                 description: Código único del producto.
 *               category:
 *                 type: string
 *                 description: Categoría del producto.
 *               stock:
 *                 type: number
 *                 description: Cantidad disponible en stock.
 *               status:
 *                 type: boolean
 *                 default: true
 *                 description: Estado del producto (activo o inactivo).
 *               owner:
 *                 type: string
 *                 default: admin
 *                 description: Propietario del producto.
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *       403:
 *         description: Permiso denegado
 */

router.put(
  "/:pid",
  authorization(accessRolesEnum.ADMIN),
  validator.params(getProductByIdSchema),
  validator.body(productSchema),
  updateProduct
);

export default router;

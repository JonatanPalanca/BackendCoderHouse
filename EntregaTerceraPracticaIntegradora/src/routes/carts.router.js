/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operaciones relacionadas con carritos
 */

import { Router } from "express";
import {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  deleteProductFromCart,
  addProductToCart,
  updateProductInCart,
  purchase,
} from "../controllers/carts.controller.js";
import {
  updateFullCartSchema,
  getCartByIdSchema,
  productCartSchema,
} from "../schemas/carts.schema.js";
import validator from "../middlewares/validator.js";
import { accessRolesEnum } from "../config/enums.js";
import { authorization } from "../utils.js";
import { addLogger } from "../logger.js";

const router = Router();

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtener detalles de un carrito por ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del carrito
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:cid", validator.params(getCartByIdSchema), addLogger, getCart);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Carrito creado con éxito
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", addLogger, createCart);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   post:
 *     summary: Agregar un producto a un carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/:cid/product/:pid",
  validator.params(productCartSchema),
  addLogger,
  addProductToCart
);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Eliminar un carrito por ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito eliminado con éxito
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  "/:cid",
  validator.params(getCartByIdSchema),
  addLogger,
  deleteCart
);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Eliminar un producto de un carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  "/:cid/product/:pid",
  validator.params(productCartSchema),
  addLogger,
  deleteProductFromCart
);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualizar un carrito por ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: body
 *         name: productos
 *         required: true
 *         description: Lista de productos actualizada
 *         schema:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantityAvailable:
 *                         type: number
 *                   quantity:
 *                     type: number
 *     responses:
 *       200:
 *         description: Carrito actualizado con éxito
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  "/:cid",
  validator.params(getCartByIdSchema),
  validator.body(updateFullCartSchema),
  addLogger,
  updateCart
);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en un carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *       - in: body
 *         name: amount
 *         required: true
 *         description: Cantidad de productos a agregar
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: number
 *     responses:
 *       200:
 *         description: Producto en el carrito actualizado con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  "/:cid/product/:pid",
  authorization([accessRolesEnum.USER, accessRolesEnum.PREMIUM]),
  addLogger,
  updateProductInCart
);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Realizar la compra de un carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra realizada con éxito
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/:cid/purchase",
  validator.params(getCartByIdSchema),
  addLogger,
  purchase
);

export default router;

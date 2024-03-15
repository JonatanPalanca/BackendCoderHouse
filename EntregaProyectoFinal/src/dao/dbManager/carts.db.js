/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Operaciones relacionadas con carritos de compras
 */

import { cartsModel } from "./models/carts.model.js";

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtener todos los carritos
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Lista de carritos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Error interno del servidor
 */
export default class Carts {
  constructor() {}

  /**
   * @swagger
   * /api/carts/{cid}:
   *   get:
   *     summary: Obtener un carrito por ID
   *     tags: [Carts]
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carrito obtenido con éxito
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       404:
   *         description: Carrito no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  getCartById = async (id) => {
    const cart = await cartsModel.findOne({ _id: id }).lean();
    return cart;
  };

  /**
   * @swagger
   * /api/carts/{cid}:
   *   put:
   *     summary: Actualizar un carrito por ID
   *     tags: [Carts]
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               products:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/ProductInCart'
   *     responses:
   *       200:
   *         description: Carrito actualizado con éxito
   *       404:
   *         description: Carrito no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  update = async (cid, products) => {
    const result = await cartsModel.updateOne({ _id: cid }, products);
    return result;
  };

  // updateOne = async (cid,pid,productos) =>{
  //     const result = await cartsModel.updateOne({_id:cid},productos);
  //     return result;
  // }

  /**
   * @swagger
   * /api/carts/{cid}:
   *   delete:
   *     summary: Eliminar un carrito por ID
   *     tags: [Carts]
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
  delete = async (cid) => {
    const result = await cartsModel.updateOne(
      { _id: cid },
      { $set: { products: [] } }
    );
    return result;
  };

  /**
   * @swagger
   * /api/carts/{cid}/products/{pid}:
   *   delete:
   *     summary: Eliminar un producto de un carrito por IDs de carrito y producto
   *     tags: [Carts]
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
   *         description: Producto eliminado con éxito del carrito
   *       404:
   *         description: Carrito o producto no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  deleteProduct = async (cid, pid) => {
    const result = await cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: { _id: pid } } } }
    );
    return result;
  };

  /**
   * @swagger
   * /api/carts:
   *   post:
   *     summary: Crear un nuevo carrito
   *     tags: [Carts]
   *     responses:
   *       201:
   *         description: Carrito creado con éxito
   *       500:
   *         description: Error interno del servidor
   */
  save = async () => {
    try {
      const result = await cartsModel.create({});
      return result;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw new Error("Error al crear el carrito");
    }
  };
}

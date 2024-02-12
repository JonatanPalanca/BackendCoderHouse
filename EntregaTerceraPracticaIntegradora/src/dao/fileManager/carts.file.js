/**
 * @swagger
 * tags:
 *   name: CartManager
 *   description: Operaciones relacionadas con la gestión de carritos
 */

import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { productPath } from "../../utils.js";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  /**
   * @swagger
   * /api/cart-manager:
   *   get:
   *     summary: Obtener todos los carritos
   *     tags: [CartManager]
   *     responses:
   *       200:
   *         description: Lista de carritos
   *         content:
   *           application/json:
   *             example:
   *               - _id: "123456789012345678901234"
   *                 products: []
   *               - _id: "234567890123456789012345"
   *                 products:
   *                   - product:
   *                       _id: "345678901234567890123456"
   *                       name: "Product 1"
   *                       price: 10.99
   *                       quantityAvailable: 100
   *                     quantity: 2
   *               - _id: "345678901234567890123456"
   *                 products:
   *                   - product:
   *                       _id: "456789012345678901234567"
   *                       name: "Product 2"
   *                       price: 19.99
   *                       quantityAvailable: 50
   *                     quantity: 1
   *                   - product:
   *                       _id: "567890123456789012345678"
   *                       name: "Product 3"
   *                       price: 5.99
   *                       quantityAvailable: 200
   *                     quantity: 3
   *       500:
   *         description: Error interno del servidor
   */
  getAll = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } else {
      return [];
    }
  };

  /**
   * @swagger
   * /api/cart-manager/{id}:
   *   get:
   *     summary: Obtener un carrito por ID
   *     tags: [CartManager]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Detalles del carrito
   *         content:
   *           application/json:
   *             example:
   *               _id: "123456789012345678901234"
   *               products: []
   *       404:
   *         description: Carrito no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  getCartById = async (id_buscada) => {
    const carts = await this.getAll();
    const cart_found = carts.find((carrito) => carrito._id === id_buscada);
    return cart_found;
  };

  /**
   * @swagger
   * /api/cart-manager/{id}:
   *   delete:
   *     summary: Eliminar un carrito por ID
   *     tags: [CartManager]
   *     parameters:
   *       - in: path
   *         name: id
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
  delete = async (id_a_eliminar) => {
    const carts = await this.getAll();
    const cartIndex = carts.findIndex(
      (carrito) => carrito._id === id_a_eliminar
    );
    if (cartIndex === -1) {
      return "Cart not found";
    }
    const carritoEliminado = carts.splice(cartIndex, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return carritoEliminado;
  };

  /**
   * @swagger
   * /api/cart-manager/{id}:
   *   put:
   *     summary: Actualizar un carrito por ID
   *     tags: [CartManager]
   *     parameters:
   *       - in: path
   *         name: id
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
  update = async (id, productos) => {
    const carts = await this.getAll();
    const cartIndex = carts.findIndex((carrito) => carrito._id === id);
    if (cartIndex === -1) {
      return "Cart not found";
    }
    carts[cartIndex].products = productos.products;
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return carts[cartIndex];
  };

  /**
   * @swagger
   * /api/cart-manager/{id}/update-one/{pid}:
   *   put:
   *     summary: Actualizar un producto en un carrito por ID
   *     tags: [CartManager]
   *     parameters:
   *       - in: path
   *         name: id
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
   *         name: productos
   *         required: true
   *         description: Lista de productos actualizada
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               product:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *               quantity:
   *                 type: number
   *     responses:
   *       200:
   *         description: Producto en el carrito actualizado con éxito
   *       404:
   *         description: Carrito o producto no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  updateOne = async (id, pid, productos) => {
    const carts = await this.getAll();
    const cartIndex = carts.findIndex((carrito) => carrito._id === id);
    if (cartIndex === -1) {
      return "Cart not found";
    }
    if (productos.length === 1) {
      productos[0].product = { _id: pid };
    } else {
      productos[productos.length - 1].product = { _id: pid };
    }
    carts[cartIndex].products = productos;
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return carts[cartIndex];
  };

  /**
   * @swagger
   * /api/cart-manager:
   *   post:
   *     summary: Crear un nuevo carrito
   *     tags: [CartManager]
   *     responses:
   *       200:
   *         description: Carrito creado con éxito
   *       500:
   *         description: Error interno del servidor
   */
  save = async () => {
    const cart = {
      _id: uuidv4().replace(/-/g, "").substring(0, 24),
      products: [],
    };
    const carts = await this.getAll();
    carts.push(cart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return cart;
  };
}

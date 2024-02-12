/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operaciones relacionadas con el carrito de compras
 */

import {
  createCart as createCartService,
  getCart as getCartService,
  updateCart as updateCartService,
  deleteCart as deleteCartService,
  deleteProductFromCart as deleteProductFromCartService,
  updateFullCart as updateFullCartService,
  purchase as purchaseService,
} from "../services/carts.service.js";
import { getProductById as getProductByIdService } from "../services/products.service.js";

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Cart]
 *     responses:
 *       201:
 *         description: Carrito creado con éxito
 *       500:
 *         description: Error interno del servidor
 */

export const createCart = async (req, res) => {
  try {
    const result = await createCartService();
    res
      .status(201)
      .send({ status: "success", message: "cart created", payload: result });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
};

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtener información del carrito por ID
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
 *         description: Información del carrito obtenida con éxito
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await getCartService(cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    res.send({ status: "success", payload: cart });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
};

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   post:
 *     summary: Agregar un producto al carrito
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
 *       201:
 *         description: Producto agregado al carrito con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export const addProductToCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await getCartService(cid);
    const product = await getProductByIdService(pid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    const result = await updateCartService(cid, pid, 1);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
};

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
export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await getCartService(cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    const result = await deleteCartService(cid);
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ status: "error", message: error.message });
  }
};

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto del carrito
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
export const deleteProductFromCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await getCartService(cid);
    const product = await getProductByIdService(pid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    const result = await deleteProductFromCartService(cid, pid);
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
};

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualizar el carrito por ID
 *     tags: [Cart]
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
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *           example:
 *             products: [{ productId: "productID123", quantity: 2 }]
 *     responses:
 *       201:
 *         description: Carrito actualizado con éxito
 *       404:
 *         description: Carrito no encontrado
 *       422:
 *         description: Valores incompletos
 *       500:
 *         description: Error interno del servidor
 */
export const updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    const { cid } = req.params;
    if (!products) {
      return res
        .status(422)
        .send({ status: "error", message: "Incomplete values" });
    }
    const cart = await getCartService(cid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    const result = await updateFullCartService(cid, products);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ status: "error", message: error.message });
  }
};

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *           example:
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Cantidad de producto actualizada con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export const updateProductInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const amount = req.body;
    const cart = await getCartService(cid);
    const product = await getProductByIdService(pid);
    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    const user = req.user.email;
    const result = await updateCartService(cid, pid, amount.quantity, user);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
};

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Realizar la compra del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compra realizada con éxito
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export const purchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const user = req.user;
    const result = await purchaseService(cid, user);

    res.send({ result });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send();
  }
};

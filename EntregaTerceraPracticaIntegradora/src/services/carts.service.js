/**
 * @swagger
 * tags:
 *   name: CartOperations
 *   description: Operaciones relacionadas con carritos de compra
 */

import { CartManager, ProductManager } from "../dao/factory.js";
import { cartPath, productPath } from "../utils.js";
import CartManagerRepository from "../repositories/carts.repository.js";
import ProductManagerRepository from "../repositories/products.repository.js";
import { ticketService as generatePurchase } from "./tickets.service.js";

const cartManager = new CartManager(cartPath);
const cartManagerRepository = new CartManagerRepository(cartManager);
const productManager = new ProductManager(productPath);
const productManagerRepository = new ProductManagerRepository(productManager);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [CartOperations]
 *     responses:
 *       200:
 *         description: Carrito creado con éxito
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { _id: "abcdef1234567890abcdef12", products: [] }
 *       500:
 *         description: Error interno del servidor
 */
export const createCart = async () => {
  const result = await cartManagerRepository.saveRepository();
  return result;
};

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtener detalles de un carrito por ID
 *     tags: [CartOperations]
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
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { _id: "abcdef1234567890abcdef12", products: [...] }
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export const getCart = async (cid) => {
  const cart = await cartManagerRepository.getCartByIdRepository(cid);
  return cart;
};

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   put:
 *     summary: Agregar un producto al carrito
 *     tags: [CartOperations]
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
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { _id: "abcdef1234567890abcdef12", products: [...] }
 *       500:
 *         description: Error interno del servidor
 */
export const updateCart = async (cid, pid, quantity = 1, user) => {
  const cart = await cartManagerRepository.getCartByIdRepository(cid);
  const product = await productManagerRepository.getProductByIdRepository(pid);
  if (product.owner === user) {
    throw new Error("You own this product.");
  }
  if (cart.products.length === 0) {
    cart.products.push({ product: pid, quantity: quantity });
  } else {
    const indexProductInCart = cart.products.findIndex(
      (product) => product.product._id.toString() === pid
    );
    if (indexProductInCart !== -1) {
      cart.products[indexProductInCart].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity: quantity });
    }
  }
  const result = await cartManagerRepository.updateRepository(cid, {
    products: cart.products,
  });
  return result;
};

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualizar un carrito con productos proporcionados
 *     tags: [CartOperations]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Lista de productos para actualizar el carrito
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFullCart'
 *     responses:
 *       200:
 *         description: Carrito actualizado con éxito
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { _id: "abcdef1234567890abcdef12", products: [...] }
 *       500:
 *         description: Error interno del servidor
 */
export const updateFullCart = async (cid, products) => {
  const result = await cartManagerRepository.updateRepository(cid, {
    products: products,
  });
  return result;
};

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Eliminar un carrito
 *     tags: [CartOperations]
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
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { _id: "abcdef1234567890abcdef12", products: [] }
 *       500:
 *         description: Error interno del servidor
 */
export const deleteCart = async (cid) => {
  const result = await cartManagerRepository.updateRepository(cid, {
    products: [],
  });
  return result;
};

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Eliminar un producto de un carrito
 *     tags: [CartOperations]
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
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { _id: "abcdef1234567890abcdef12", products: [...] }
 *       500:
 *         description: Error interno del servidor
 */
export const deleteProductFromCart = async (cid, pid) => {
  const cart = await cartManagerRepository.getCartByIdRepository(cid);
  if (cart.products.length !== 0) {
    const indexProductInCart = cart.products.findIndex(
      (product) => product.product._id.toString() === pid
    );
    if (indexProductInCart !== -1) {
      cart.products.splice(indexProductInCart, 1);
    }
  }
  const result = await cartManagerRepository.updateRepository(cid, {
    products: cart.products,
  });
  return result;
};

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Realizar la compra de un carrito
 *     tags: [CartOperations]
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
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: { result: "OK" }
 *       500:
 *         description: Error interno del servidor
 */
export const purchase = async (cid, user) => {
  const cart = await cartManagerRepository.getCartByIdRepository(cid);
  const products = cart.products;
  let totalPrice = 0;
  products.forEach(async ({ product, quantity }) => {
    if (enoughStock(quantity, product.stock)) {
      totalPrice = totalPrice + quantity * product.price;
      product.stock -= quantity;
      await cartManagerRepository.deleteProductRepository(cid, product._id);
      await productManagerRepository.updateRepository(product._id, product);
    }
  });

  const result = await generatePurchase(user, totalPrice);

  return result;
};

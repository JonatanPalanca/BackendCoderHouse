import { productPath } from "../utils.js";
import { ProductManager } from "../dao/factory.js";

import ProductManagerRepository from "../repositories/products.repository.js";

const productManager = new ProductManager(productPath);
const productManagerRepository = new ProductManagerRepository(productManager);

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductManagerFunctionsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Estado de la operación (success o error).
 *         payload:
 *           type: object
 *           description: Datos resultantes de la operación.
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductManagerFunctionsResponse'
 */
export const getProduct = async () => {
  const products = await productManagerRepository.getAllRepository();
  return products;
};

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtener un producto por su ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del producto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductManagerFunctionsResponse'
 */
export const getProductById = async (pid) => {
  const product = await productManagerRepository.getProductByIdRepository(pid);
  return product;
};

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto por su ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductManagerFunctionsResponse'
 */
export const deleteProduct = async (pid) => {
  const result = await productManagerRepository.deleteRepository(pid);
  return result;
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductManagerFunctionsResponse'
 */
export const createProduct = async (product) => {
  const result = await productManagerRepository.saveRepository(product);
  return result;
};

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualizar un producto por su ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductManagerFunctionsResponse'
 */
export const updateProduct = async (pid, product) => {
  const result = await productManagerRepository.updateRepository(pid, product);
  return result;
};

import { productsModel } from "./models/products.model.js";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones relacionadas con productos
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Estado de la operación (success o error).
 *         payload:
 *           type: object
 *           description: Datos resultantes de la operación.
 */

export default class Products {
  constructor() {}

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
   *               $ref: '#/components/schemas/ProductResponse'
   */
  getAll = async () => {
    const products = await productsModel.find().lean();
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
   *               $ref: '#/components/schemas/ProductResponse'
   */
  getProductById = async (id) => {
    const product = await productsModel.findOne({ _id: id }).lean();
    return product;
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
   *               $ref: '#/components/schemas/ProductResponse'
   */
  update = async (pid, product) => {
    const result = await productsModel.updateOne({ _id: pid }, product);
    return result;
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
   *               $ref: '#/components/schemas/ProductResponse'
   */
  delete = async (pid) => {
    const result = await productsModel.deleteOne({ _id: pid });
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
   *               $ref: '#/components/schemas/ProductResponse'
   */
  save = async (product) => {
    const productAlreadyExists = await productsModel.findOne({
      code: product.code,
    });
    const result =
      !productAlreadyExists && (await productsModel.create(product));
    return result;
  };
}

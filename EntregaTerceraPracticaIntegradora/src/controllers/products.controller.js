/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones relacionadas con productos
 */

import {
  getProduct as getProductService,
  getProductById as getProductByIdService,
  deleteProduct as deleteProductService,
  createProduct as createProductService,
  updateProduct as updateProductService,
} from "../services/products.service.js";
import { generateProduct } from "../utils.js";
import CustomError from "../middlewares/errors/CustomError.js";
import EErrors from "../middlewares/errors/enums.js";

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
 *             example:
 *               status: success
 *               payload:
 *                 - id: 1
 *                   title: "Producto 1"
 *                   description: "Descripción del Producto 1."
 *                   price: 19.99
 *                   thumbnail: "URL de la imagen"
 *                   code: "P001"
 *                   category: "Electrónicos"
 *                   stock: 50
 *                   status: "Activo"
 *                   owner: "admin@example.com"
 *                 - id: 2
 *                   title: "Producto 2"
 *                   description: "Descripción del Producto 2."
 *                   price: 29.99
 *                   thumbnail: "URL de la imagen"
 *                   code: "P002"
 *                   category: "Ropa"
 *                   stock: 30
 *                   status: "Activo"
 *                   owner: "admin@example.com"
 */
export const getProduct = async (req, res) => {
  try {
    const products = await getProductService();
    return res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
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
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del producto.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload:
 *                 id: 1
 *                 title: "Producto 1"
 *                 description: "Descripción del Producto 1."
 *                 price: 19.99
 *                 thumbnail: "URL de la imagen"
 *                 code: "P001"
 *                 category: "Electrónicos"
 *                 stock: 50
 *                 status: "Activo"
 *                 owner: "admin@example.com"
 *       404:
 *         description: Producto no encontrado.
 */
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await getProductByIdService(pid);
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    res.send({ status: "success", payload: product });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
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
 *         description: ID del producto
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Producto eliminado con éxito.
 *       403:
 *         description: Permiso denegado.
 *       500:
 *         description: Error interno del servidor.
 */
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await getProductByIdService(pid);
    if (product.owner != req.user.email && req.user.role != "admin") {
      return res.status(403).send({
        status: "error",
        message: "Forbidden. You do not own this product.",
      });
    }
    const result = await deleteProductService(pid);
    const io = req.app.get("socketio");
    io.emit("showProducts", { products: await getProductService() });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto.
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *               code:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               status:
 *                 type: string
 *               owner:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado con éxito.
 *       400:
 *         description: Error en la solicitud del cliente.
 */
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
      owner,
    } = req.body;
    const io = req.app.get("socketio");

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !category ||
      stock === null ||
      stock === undefined ||
      stock === ""
    ) {
      throw CustomError.createError({
        name: "ProductError",
        cause:
          "Invalid data types: title (string), description (string), price (number), code (string), category (string), and stock (number) are required",
        message: "Error trying to create product",
        code: EErrors.INVALID_TYPE_ERROR,
      });
    }
    if (owner != "admin" && owner != req.user.email && owner != null) {
      throw CustomError.createError({
        name: "ProductError",
        cause: 'owner should be your email address (default "admin")',
        message: "Error trying to create product",
        code: EErrors.INVALID_TYPE_ERROR,
      });
    }
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
      owner,
    };
    const result = await createProductService(product);
    if (!result) {
      return res
        .status(400)
        .send({ status: "error", message: "product already exists" });
    }
    const products = await getProductService();
    io.emit("showProducts", { products: products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.cause });
  }
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *               code:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto actualizado con éxito.
 *       500:
 *         description: Error interno del servidor.
 */
export const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    } = req.body;
    const { pid } = req.params;
    const io = req.app.get("socketio");

    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    };
    const result = await updateProductService(pid, product);
    const products = await getProductService();
    io.emit("showProducts", { products: products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

/**
 * @swagger
 * /api/products/mock:
 *   get:
 *     summary: Obtener productos simulados para pruebas.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos simulados.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               counter: 100
 *               data:
 *                 - id: 1
 *                   title: "Producto simulado 1"
 *                   description: "Descripción del Producto simulado 1."
 *                   price: 19.99
 *                   thumbnail: "URL de la imagen simulada"
 *                   code: "PS001"
 *                   category: "Simulados"
 *                   stock: 50
 *                   status: "Activo"
 *                   owner: "admin@example.com"
 *                 - id: 2
 *                   title: "Producto simulado 2"
 *                   description: "Descripción del Producto simulado 2."
 *                   price: 29.99
 *                   thumbnail: "URL de la imagen simulada"
 *                   code: "PS002"
 *                   category: "Simulados"
 *                   stock: 30
 *                   status: "Activo"
 *                   owner: "admin@example.com"
 */
export const mockingProducts = async (req, res) => {
  let products = [];

  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }

  res.send({
    status: "success",
    counter: products.length,
    data: products,
  });
};

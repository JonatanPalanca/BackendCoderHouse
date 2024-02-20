import fs from "fs";
import { v4 as uuidv4 } from "uuid";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductManagerResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Estado de la operación (success o error).
 *         payload:
 *           type: object
 *           description: Datos resultantes de la operación.
 */

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  /**
   * @swagger
   * /api/products/manager:
   *   get:
   *     summary: Obtener todos los productos del administrador.
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: Lista de productos del administrador.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductManagerResponse'
   */
  getAll = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } else {
      return [];
    }
  };

  /**
   * @swagger
   * /api/products/manager/{id}:
   *   get:
   *     summary: Obtener un producto del administrador por su ID.
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del producto del administrador.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Detalles del producto del administrador.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductManagerResponse'
   */
  getProductById = async (id_buscada) => {
    const products = await this.getAll();
    const product_found = products.find(
      (producto) => producto._id === id_buscada
    );
    return product_found;
  };

  /**
   * @swagger
   * /api/products/manager/{id}:
   *   delete:
   *     summary: Eliminar un producto del administrador por su ID.
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del producto del administrador.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Producto del administrador eliminado con éxito.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductManagerResponse'
   */
  delete = async (id_a_eliminar) => {
    const products = await this.getAll();
    const productIndex = products.findIndex(
      (producto) => producto._id === id_a_eliminar
    );
    if (productIndex === -1) {
      return "Product not found";
    }
    const productoEliminado = products.splice(productIndex, 1);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return productoEliminado;
  };

  /**
   * @swagger
   * /api/products/manager/{id}:
   *   put:
   *     summary: Actualizar un producto del administrador por su ID.
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del producto del administrador.
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
   *         description: Producto del administrador actualizado con éxito.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductManagerResponse'
   */
  update = async (id, producto) => {
    const products = await this.getAll();
    const productIndex = products.findIndex((producto) => producto._id === id);
    if (productIndex === -1) {
      return "Product not found";
    }
    producto._id = id;
    products[productIndex] = producto;
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return producto;
  };

  /**
   * @swagger
   * /api/products/manager:
   *   post:
   *     summary: Crear un nuevo producto del administrador.
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: Producto del administrador creado con éxito.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductManagerResponse'
   */
  save = async (product) => {
    const products = await this.getAll();
    const product_found = products.find(
      (producto) => producto.code === product.code
    );
    if (product_found) {
      return "Product already exists";
    }
    product._id = uuidv4().replace(/-/g, "").substring(0, 24);
    products.push(product);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return product;
  };
}

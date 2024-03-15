/**
 * @swagger
 * tags:
 *   name: CartsRepository
 *   description: Repositorio para operaciones relacionadas con carritos
 */

export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  /**
   * @swagger
   * /api/carts-repository:
   *   get:
   *     summary: Obtener todos los carritos desde el repositorio
   *     tags: [CartsRepository]
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
  getAllRepository = async () => {
    const carts = await this.dao.getAll();
    return carts;
  };

  /**
   * @swagger
   * /api/carts-repository/{id}:
   *   get:
   *     summary: Obtener un carrito por ID desde el repositorio
   *     tags: [CartsRepository]
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
  getCartByIdRepository = async (id) => {
    const cart = await this.dao.getCartById(id);
    return cart;
  };

  /**
   * @swagger
   * /api/carts-repository/{cid}:
   *   put:
   *     summary: Actualizar un carrito por ID en el repositorio
   *     tags: [CartsRepository]
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
   *         description: Carrito en el repositorio actualizado con éxito
   *       404:
   *         description: Carrito no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  updateRepository = async (cid, products) => {
    const result = await this.dao.update(cid, products);
    return result;
  };

  /**
   * @swagger
   * /api/carts-repository/{cid}:
   *   delete:
   *     summary: Eliminar un carrito por ID desde el repositorio
   *     tags: [CartsRepository]
   *     parameters:
   *       - in: path
   *         name: cid
   *         required: true
   *         description: ID del carrito
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carrito en el repositorio eliminado con éxito
   *       404:
   *         description: Carrito no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  deleteRepository = async (cid) => {
    const result = await this.dao.delete(cid);
    return result;
  };

  /**
   * @swagger
   * /api/carts-repository/{cid}/products/{pid}:
   *   delete:
   *     summary: Eliminar un producto de un carrito en el repositorio
   *     tags: [CartsRepository]
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
   *         description: Producto en el carrito eliminado con éxito
   *       404:
   *         description: Carrito o producto no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  deleteProductRepository = async (cid, pid) => {
    const result = await this.dao.deleteProduct(cid, pid);
    return result;
  };

  /**
   * @swagger
   * /api/carts-repository:
   *   post:
   *     summary: Crear un nuevo carrito en el repositorio
   *     tags: [CartsRepository]
   *     responses:
   *       200:
   *         description: Carrito en el repositorio creado con éxito
   *       500:
   *         description: Error interno del servidor
   */
  async saveRepository() {
    const result = await this.dao.save();
    return result;
  }
}

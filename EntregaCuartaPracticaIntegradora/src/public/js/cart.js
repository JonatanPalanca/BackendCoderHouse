/**
 * @swagger
 * /api/carts/{cid}/product/{_id}:
 *   put:
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
 *         name: _id
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
 *                 description: Cantidad del producto a agregar (por defecto, 1)
 *                 default: 1
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const addToCart = (_id, cid) => {
  const amount = { quantity: 1 };

  fetch(`/api/carts/${cid}/product/${_id}`, {
    method: "PUT",
    body: JSON.stringify(amount),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => console.log(json));
};

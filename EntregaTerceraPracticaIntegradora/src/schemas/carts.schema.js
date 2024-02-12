import Joi from "joi";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductInCart:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           required: true
 *       example:
 *         quantity: 2
 */

export const updateProductInCartSchema = Joi.object({
  quantity: Joi.number().required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateFullCart:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 pattern: "^[a-zA-Z0-9]{24}$"
 *                 required: true
 *               quantity:
 *                 type: number
 *                 required: true
 *           required: true
 *       example:
 *         products:
 *           - product: "abcdef1234567890abcdef12"
 *             quantity: 2
 */

export const updateFullCartSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{24}$")).required(),
      quantity: Joi.number().required(),
    })
  ),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     GetCartById:
 *       type: object
 *       properties:
 *         cid:
 *           type: string
 *           pattern: "^[a-zA-Z0-9]{24}$"
 *           required: true
 *       example:
 *         cid: "abcdef1234567890abcdef12"
 */

export const getCartByIdSchema = Joi.object({
  cid: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{24}$")).required(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCart:
 *       type: object
 *       properties:
 *         cid:
 *           type: string
 *           pattern: "^[a-zA-Z0-9]{24}$"
 *           required: true
 *         pid:
 *           type: string
 *           pattern: "^[a-zA-Z0-9]{24}$"
 *           required: true
 *       example:
 *         cid: "abcdef1234567890abcdef12"
 *         pid: "abcdef1234567890abcdef12"
 */

export const productCartSchema = Joi.object({
  cid: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{24}$")).required(),
  pid: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{24}$")).required(),
});

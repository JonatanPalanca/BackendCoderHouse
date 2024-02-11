import { CartManager, ProductManager, TicketManager } from "../dao/factory.js";
import { cartPath, productPath } from "../utils.js";
import CartManagerRepository from "../repositories/carts.repository.js";
import ProductManagerRepository from "../repositories/products.repository.js";
import { ticketService as generatePurchase } from "./tickets.service.js";

const cartManager = new CartManager(cartPath);
const cartManagerRepository = new CartManagerRepository(cartManager);
const productManager = new ProductManager(productPath);
const productManagerRepository = new ProductManagerRepository(productManager);

const enoughStock = (quantity, stock) => {
  return quantity <= stock;
};

export const createCart = async () => {
  const result = await cartManagerRepository.saveRepository();
  return result;
};

export const getCart = async (cid) => {
  const cart = await cartManagerRepository.getCartByIdRepository(cid);
  return cart;
};
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

export const updateFullCart = async (cid, products) => {
  const result = await cartManagerRepository.updateRepository(cid, {
    products: products,
  });
  return result;
};

export const deleteCart = async (cid) => {
  const result = await cartManagerRepository.updateRepository(cid, {
    products: [],
  });
  return result;
};

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

import CartManager from "../dao/dbManager/carts.manager.js";
import ProductManager from "../dao/dbManager/products.manager.js";
import { productPath } from "../utils.js";
import { cartPath } from "../utils.js";
const cartManager = new CartManager(cartPath);
const productManager = new ProductManager(productPath);

const getCartById = async (cid) => {
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCart = async () => {
  try {
    const result = await cartManager.save();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addProductToCart = async (cid, pid) => {
  try {
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductById(pid);
    if (!cart || !product) {
      throw new Error("Cart or product not found");
    }

    const indexProductInCart = cart.products.findIndex(
      (prod) => prod.product === pid
    );
    if (indexProductInCart !== -1) {
      cart.products[indexProductInCart].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    const result = await cartManager.update(cid, { products: cart.products });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCart = async (cid) => {
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const result = await cartManager.delete(cid);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProductFromCart = async (cid, pid) => {
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const indexProductInCart = cart.products.findIndex(
      (prod) => prod.product === pid
    );
    if (indexProductInCart !== -1) {
      cart.products.splice(indexProductInCart, 1);
    }

    const result = await cartManager.update(cid, { products: cart.products });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCart = async (cid, products) => {
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }
    cart.products = products;

    const result = await cartManager.update(cid, { products: cart.products });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductInCart = async (cid, pid, amount) => {
  try {
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductById(pid);
    if (!cart || !product) {
      throw new Error("Cart or product not found");
    }

    const indexProductInCart = cart.products.findIndex(
      (prod) => prod.product === pid
    );
    if (indexProductInCart !== -1) {
      cart.products[indexProductInCart].quantity += amount;
    } else {
      cart.products.push({ product: pid, quantity: amount });
    }

    const result = await cartManager.update(cid, { products: cart.products });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  getCartById,
  createCart,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
};

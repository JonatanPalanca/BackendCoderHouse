import CartManager from "../dao/mongo/carts.mongo.js";
import ProductManager from "../dao/mongo/products.mongo.js";
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

const purchase = async (cid, user) => {
  //Transacciones
  const session = await mongoose.startSession();
  session.startTransaction();

  //En este punto antes de hacer purchase yo ya tengo un carrito con productso agregados

  //1. Debería obtener el carrito por cid, el repository de carts para buscar el carrito por id
  // {
  //     products: [
  //         {
  //             product: {
  //                 id
  //                 name:
  //                 description:
  //                 price,
  //                 stock: 2
  //             },
  //             quantity: 2
  //         },
  //         {
  //             product: {
  //                 id
  //                 name:
  //                 description:
  //                 price:
  //                 stock: 5
  //             },
  //             quantity: 1
  //         }
  //     ]
  // }
  //2.- Iterar el arreglo de productos que forman parte de mi carrito
  let amount = 0;

  //En este arreglo vamos a ir almacenando los productos que no tenemos stock
  const outStock = [];

  cart.products.forEach(async ({ product, quantity }) => {
    if (product.stock >= quantity) {
      amount += product.price * quantity;
      product.stock -= quantity;
      // Utilizar el repostiory de productos y actualizar el producto con el stock correspondiente
      await productsReposity.updateById("Id del producto", product);
    } else {
      outStock.push({ product, quantity });
    }
  });

  const ticket = await ticketsService.generatePurchase(user, amount);
  //actulizar el carrito con el nuevo arreglo de productos que no pudieron comprarse
  //utilizar el repository de carritos para poder actualizar los productos
  await cartsRepository.updateProducts(cid, outStock);

  await session.commitTransaction();

  //catch
  await session.abortTransaction();
  //finally
  session.endSession();
};

export {
  getCartById,
  createCart,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  updateProductInCart,
  purchase,
};

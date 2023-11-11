import { Router } from "express";
import { productPath } from "../utils.js";
const router = Router();

//import ProductManager from '../dao/fileManager/product.manager.js';
import ProductManager from "../dao/dbManager/products.manager.js";
const productManager = new ProductManager(productPath);

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAll();
    //  const limite = Number(req.query.limit);
    //   if(!limite || limite>products.length||limite<=0){
    return res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    //  return res.status(200).send({status: "success", payload: products.slice(0,limite)})}
    return res.send({ status: "error", error: error });
  }
});

//El de abajo funciona, pero dentro de api/products:
// router.get('/', async (req, res) => {
//     try{
//     const products = await productManager.getProducts();
//      res.render("home", {products});}
//     catch(error) {return res.send({ status: 'error', error: error })}
// });
// router.get('/:pid', async (req, res) => {
//     try {
//     const productId = Number(req.params.pid);
//     const producto = await productManager.getProductById(productId);
//     if(!producto){
//         return res.status(400).send({status:"error", message: "Product not found"})
//     }
//     res.status(200).send({status:"success", payload: producto});}
//     catch (error){
//         return res.send({ status: 'error', error: error })
//     }
// });
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    }
    res.send({ status: "success", payload: product });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});
// router.delete('/:pid', async (req, res) => {
//     try{
//     const productId = Number(req.params.pid);
//     const products = await productManager.getProducts();
//     const io = req.app.get('socketio');
//     const productIndex = products.findIndex(producto => producto.id === productId);
//     if (productIndex===-1){
//         return res.status(400).send({status: "error", error: "Product not found!!"});
//                 };
//     const producto = await productManager.deleteProduct(productId);
//     io.emit("showProducts", {products:await productManager.getProducts()});
//     res.status(200).send({status:"success", message: "product deleted", payload: producto});}
//     catch (error){
//         return res.send({ status: 'error', error: error })
//     }
// });
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productManager.delete(pid);
    const io = req.app.get("socketio");
    const products = await productManager.getAll();
    io.emit("showProducts", { products: await productManager.getAll() });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// router.post('/', async (req, res) => {
//     try {
//     const product = req.body;
//     const io = req.app.get('socketio');

//     if(!product.title || !product.description || !product.price || !product.code || !product.category || !product.stock){
//         return res.status(400).send({ status: 'error', error: 'Incomplete values' });
//     }

//     const products = await productManager.getAll();
//     const productIndex = products
//             .findIndex(producto => producto.code === product.code);
//         if (productIndex!==-1){
//             return res.status(400).send({status: "error", error: "Product already exists!!"});
//         }
//         products.length===0? (product.id=1) : (product.id=products[products.length-1].id+1);
//         products.push(product);
//         productManager.saveProducts(products);
//         io.emit("showProducts", {products:products});
//         res.status(200).send({ status: 'success', message: "product created", payload: product });}
//     catch (error){
//             return res.send({ status: 'error', error: error })
//         }
// });

router.post("/", async (req, res) => {
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
    const io = req.app.get("socketio");
    //va segunda la variable que quiero definir, primero va como la recibo.
    if (!title || !description || !price || !code || !category || !stock) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete values" });
    }
    const result = await productManager.save({
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    });
    if (!result) {
      return res
        .status(400)
        .send({ status: "error", message: "product already exists" });
    }
    const products = await productManager.getAll();
    io.emit("showProducts", { products: products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// router.put('/:pid', async (req, res) => {
//     try{
//     const product = req.body;
//     const productId = Number(req.params.pid);
//     if(!product.title || !product.description || !product.price || !product.code || !product.category || !product.stock ||!product.status){
//         return res.status(400).send({ status: 'error', error: 'Incomplete values' });
//     }

//     const products = await productManager.getProducts();
//     const productIndex = products
//             .findIndex(producto => producto.id === productId);
//         if (productIndex===-1){
//             return res.status(404).send({status: "error", error: "Product not found!!"});
//         }
//         const newProduct = { id: productId, ...product }
//         products[productIndex] = newProduct;
//         productManager.saveProducts(products);
//         res.status(200).send({ status: 'success', message: 'Product updated', payload:product });}
//         catch (error){
//             return res.send({ status: 'error', error: error })
//         }
// });

router.put("/:pid", async (req, res) => {
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
    //va segunda la variable que quiero definir, primero va como la recibo.
    if (!title || !description || !price || !code || !category || !stock) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete values" });
    }
    const result = await productManager.update(pid, {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
      status,
    });
    const products = await productManager.getAll();
    io.emit("showProducts", { products: products });
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;

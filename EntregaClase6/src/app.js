const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const port = 8080;

const productManager = new ProductManager("./products.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/products", async (req, res) => {
  const { limit } = req.query;

  const products = await productManager.getProducts();

  if (limit) {
    const limitCount = parseInt(limit);
    if (!isNaN(limitCount) && limitCount > 0) {
      res.json(products.slice(0, limitCount));
    } else {
      res.status(400).json({
        error: "El parámetro 'limit' debe ser un número mayor que cero",
      });
    }
  } else {
    res.json(products);
  }
});
app.get("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Pruebas de integración del módulo de productos", () => {
  it("Debería obtener todos los productos", async () => {
    const response = await requester.get("/api/products");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
  });

  it("Debería obtener productos simulados para pruebas", async () => {
    const response = await requester.get("/api/products/mockingproducts");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
  });

  it("Debería obtener un producto por su ID", async () => {
    const response = await requester.get("/api/products/example_id");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("object");
  });

  it("Debería eliminar un producto por su ID", async () => {
    const response = await requester.delete("/api/products/example_id");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
  });

  it("Debería crear un nuevo producto", async () => {
    const newProduct = {
      title: "Nuevo producto",
      description: "Descripción del nuevo producto",
      price: 99.99,
      thumbnail: "https://example.com/image.jpg",
      code: "NEW123",
      category: "Electrónica",
      stock: 10,
      status: true,
      owner: "admin",
    };

    const response = await requester.post("/api/products").send(newProduct);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
  });

  it("Debería actualizar un producto por su ID", async () => {
    const updatedProduct = {
      title: "Producto actualizado",
      description: "Descripción actualizada del producto",
      price: 129.99,
      thumbnail: "https://example.com/updated_image.jpg",
      category: "Electrodomésticos",
      stock: 20,
      status: true,
    };

    const response = await requester
      .put("/api/products/example_id")
      .send(updatedProduct);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
  });
});

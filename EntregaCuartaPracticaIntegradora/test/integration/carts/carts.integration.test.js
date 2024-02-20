import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Pruebas de integración del módulo de carritos", () => {
  it("Debería crear un nuevo carrito", async () => {
    const response = await requester.post("/api/carts");
    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("cart created");
    expect(response.body.payload).to.be.an("object");
  });

  it("Debería obtener un carrito por su ID", async () => {
    const response = await requester.get("/api/carts/example_id");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("object");
  });

  it("Debería agregar un producto al carrito", async () => {
    const response = await requester.post(
      "/api/carts/example_cid/product/example_pid"
    );
    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("object");
  });

  it("Debería eliminar un producto del carrito", async () => {
    const response = await requester.delete(
      "/api/carts/example_cid/product/example_pid"
    );
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
  });

  it("Debería actualizar un carrito por su ID", async () => {
    const updatedCart = {
      products: [
        { id: "product_id_1", quantity: 2 },
        { id: "product_id_2", quantity: 1 },
      ],
    };

    const response = await requester
      .put("/api/carts/example_id")
      .send(updatedCart);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("object");
  });

  it("Debería realizar una compra", async () => {
    const response = await requester.post("/api/carts/example_cid/purchase");
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("object");
  });
});

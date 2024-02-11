import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";

await mongoose.connect(
  "mongodb+srv://palancajonatan:j15680484@backendpj.gwxrlxf.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

const requester = supertest("http://localhost:8080");

describe("Pruebas de integración del módulo sessions", () => {
  let cookie;
  after(async () => {
    try {
      await mongoose.connection.collections.users.drop();
      mongoose.connection.close();
    } catch (error) {
      console.log(error);
    }
  });

  it("El usuario se debe registrar correctamente", async () => {
    const userMock = {
      first_name: "z",
      last_name: "x",
      email: "zx@test.com",
      password: "1234",
      age: 27,
    };

    const { statusCode } = await requester
      .post("/api/users/register")
      .send(userMock);
    expect(statusCode).to.be.equal(201);
  });

  it("El usuario se debe poder loguear y se debe retornar una cookie", async () => {
    const credentialsMock = {
      email: "zx@test.com",
      password: "1234",
    };

    const loginResult = await requester
      .post("/api/users/login")
      .send(credentialsMock);
    const cookieResult = loginResult.headers["set-cookie"][0];

    expect(cookieResult).to.be.ok;

    const cookieResultSplit = cookieResult.split("=");

    cookie = {
      name: cookieResultSplit[0],
      value: cookieResultSplit[1],
    };

    expect(cookie.name).to.be.ok.and.eql("coderCookieToken");
    expect(cookie.value).to.be.ok;
  });

  it("Debemos poder enviar una cookie al servicio current y que se entregue la información del usuario", async () => {
    const { _body } = await requester
      .get("/api/users/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(_body.payload.email).to.be.eql("zx@test.com");
  });

  it("Debería cerrar sesión correctamente", async () => {
    const response = await requester.get("/api/users/logout");
    expect(response.status).to.equal(302);
  });
});

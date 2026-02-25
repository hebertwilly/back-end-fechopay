import request from "supertest";
import { app } from "../../src/app";

describe("POST /api/stores", () => {
  it("deve criar uma loja com sucesso", async () => {
    const response = await request(app)
      .post("/api/stores")
      .send({
        name: "Loja Teste",
        slug: "loja-teste",
        email: "teste@loja.com",
        password: "123456",
        whatsappNumber: "11999999999",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.email).toBe("teste@loja.com");
  });

  it("não deve permitir email duplicado", async () => {
    await request(app).post("/api/stores").send({
      name: "Loja Teste",
      slug: "loja-1",
      email: "duplicado@loja.com",
      password: "123456",
      whatsappNumber: "11999999999",
    });

    const response = await request(app)
      .post("/api/stores")
      .send({
        name: "Outra Loja",
        slug: "loja-2",
        email: "duplicado@loja.com",
        password: "123456",
        whatsappNumber: "11888888888",
      });

    expect(response.status).toBe(500); // depois podemos mudar pra 409
    expect(response.body.message).toBe("Email já cadastrado");
  });
});
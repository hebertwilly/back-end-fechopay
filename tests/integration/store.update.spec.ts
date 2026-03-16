import request from "supertest";
import { app } from "../../src/app";
import { Store } from "../../src/modules/store/store.model";

describe("PUT /api/stores/:id", () => {
  it("deve atualizar uma loja com sucesso", async () => {
    const createdStore = await Store.create({
      name: "Loja Original",
      slug: "loja-original",
      email: "original@loja.com",
      password: "123456",
      whatsappNumber: "11999999999",
      plan: "free",
    });

    const response = await request(app)
      .put(`/api/stores/${createdStore._id}`)
      .send({
        name: "Loja Atualizada",
        whatsappNumber: "11888888888",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.name).toBe("Loja Atualizada");
    expect(response.body.data.whatsappNumber).toBe("11888888888");
    expect(response.body.data.email).toBe("original@loja.com");
  });

  it("não deve atualizar com id inválido", async () => {
    const response = await request(app)
      .put("/api/stores/id-invalido")
      .send({
        name: "Loja Teste",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Formato de ID inválido");
  });

  it("não deve atualizar uma loja inexistente", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app)
      .put(`/api/stores/${fakeId}`)
      .send({
        name: "Loja Inexistente",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Loja não encontrada");
  });

  it("não deve permitir atualizar para um email já cadastrado", async () => {
    const firstStore = await Store.create({
      name: "Loja Um",
      slug: "loja-um",
      email: "loja1@teste.com",
      password: "123456",
      whatsappNumber: "11999999999",
      plan: "free",
    });

    await Store.create({
      name: "Loja Dois",
      slug: "loja-dois",
      email: "loja2@teste.com",
      password: "123456",
      whatsappNumber: "11888888888",
      plan: "free",
    });

    const response = await request(app)
      .put(`/api/stores/${firstStore._id}`)
      .send({
        email: "loja2@teste.com",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Email já cadastrado");
  });

  it("não deve permitir update vazio", async () => {
    const createdStore = await Store.create({
      name: "Loja Vazia",
      slug: "loja-vazia",
      email: "vazia@loja.com",
      password: "123456",
      whatsappNumber: "11999999999",
      plan: "free",
    });

    const response = await request(app)
      .put(`/api/stores/${createdStore._id}`)
      .send({});

    expect(response.status).toBe(400);
  });
});
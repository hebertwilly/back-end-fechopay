import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../../src/app";
import { Store } from "../../src/modules/store/store.model";

describe("POST /api/stores", () => {
  it("deve criar uma loja com sucesso", async () => {
    const response = await request(app)
      .post("/api/stores")
      .send({
        name: "Loja Teste",
        email: "teste@loja.com",
        password: "123456",
        whatsappNumber: "11999999999",
      });

    expect(response.status).toBe(201);

    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.email).toBe("teste@loja.com");

    // slug gerado automaticamente
    expect(response.body.data).toHaveProperty("slug");
    expect(response.body.data.slug).toBe("loja-teste");

    // password NÃO deve voltar na response
    expect(response.body.data).not.toHaveProperty("password");
  });

  it("deve salvar a senha hasheada", async () => {
    await request(app)
      .post("/api/stores")
      .send({
        name: "Loja Hash",
        email: "hash@loja.com",
        password: "123456",
        whatsappNumber: "11999999999",
      });

    // precisa selecionar password manualmente
    const store = await Store.findOne({ email: "hash@loja.com" }).select("+password");

    expect(store).toBeTruthy();

    // não deve ser texto puro
    expect(store!.password).not.toBe("123456");

    // deve bater com bcrypt
    const passwordMatches = await bcrypt.compare(
      "123456",
      store!.password
    );

    expect(passwordMatches).toBe(true);
  });

  it("não deve permitir email duplicado", async () => {
    await request(app).post("/api/stores").send({
      name: "Loja Teste",
      email: "duplicado@loja.com",
      password: "123456",
      whatsappNumber: "11999999999",
    });

    const response = await request(app)
      .post("/api/stores")
      .send({
        name: "Outra Loja",
        email: "duplicado@loja.com",
        password: "123456",
        whatsappNumber: "11888888888",
      });

    expect(response.status).toBe(500); // depois vamos ajustar pra 409
    expect(response.body.message).toBe("Email já cadastrado");
  });
});
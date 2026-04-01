import request from "supertest";
import { app } from "../../src/app";
import { createTestStore } from "../factories/store.factory";

describe("Auth integration", () => {
  describe("POST /api/auth/login", () => {
    it("should login successfully and set auth cookie", async () => {
      const { store, plainPassword } = await createTestStore();

      const response = await request(app).post("/api/auth/login").send({
        email: store.email,
        password: plainPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Login realizado com sucesso",
        store: {
          _id: store._id.toString(),
          name: store.name,
          slug: store.slug,
          email: store.email,
          whatsappNumber: store.whatsappNumber,
          plan: store.plan,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0,
        },
      });

      expect(response.body.store).not.toHaveProperty("password");

      const setCookie = response.headers["set-cookie"];
      expect(setCookie).toBeDefined();
      expect(setCookie[0]).toContain("token=");
      expect(setCookie[0]).toContain("HttpOnly");
      expect(setCookie[0]).toContain("Path=/");
    });

    it("should not login with wrong password", async () => {
      const { store } = await createTestStore();

      const response = await request(app).post("/api/auth/login").send({
        email: store.email,
        password: "senha-errada",
      });

      expect([401, 500]).toContain(response.status);
      expect(response.body).toHaveProperty("message");
    });

    it("should not login with non-existing email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "naoexiste@gmail.com",
        password: "123456",
      });

      expect([401, 500]).toContain(response.status);
      expect(response.body).toHaveProperty("message");
    });

    it("should return validation error when request body is invalid", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "email-invalido",
      });

      expect([400, 422, 500]).toContain(response.status);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return authenticated store data from cookie", async () => {
      const { store, plainPassword } = await createTestStore();

      const agent = request.agent(app);

      const loginResponse = await agent.post("/api/auth/login").send({
        email: store.email,
        password: plainPassword,
      });

      expect(loginResponse.status).toBe(200);

      const response = await agent.get("/api/auth/me");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        store: {
          id: store._id.toString(),
          email: store.email,
          slug: store.slug,
        },
      });
    });

    it("should return 401 when no cookie is sent", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Não autenticado",
      });
    });

    it("should return 401 when token is invalid", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Cookie", "token=token-invalido");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Token inválido ou expirado",
      });
    });
  });
});
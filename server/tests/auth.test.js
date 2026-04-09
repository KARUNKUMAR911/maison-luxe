const request = require("supertest");
const app     = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Clean up test users after suite
afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: "test_" } } });
  await prisma.$disconnect();
});

describe("Auth Routes", () => {
  const user = {
    name:     "Test User",
    email:    `test_${Date.now()}@example.com`,
    password: "Password123!",
  };
  let token;

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(user);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(user.email);
      expect(res.body.data.token).toBeDefined();
      token = res.body.data.token;
    });

    it("should reject duplicate email", async () => {
      const res = await request(app).post("/api/auth/register").send(user);
      expect(res.status).toBe(409);
    });

    it("should reject invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({ ...user, email: "notanemail" });
      expect(res.status).toBe(400);
    });

    it("should reject short password", async () => {
      const res = await request(app).post("/api/auth/register").send({ ...user, email: "other@example.com", password: "123" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: user.email, password: user.password });
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it("should reject wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: user.email, password: "wrongpassword" });
      expect(res.status).toBe(401);
    });

    it("should reject unknown email", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: "nobody@example.com", password: "Password123!" });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return current user with valid token", async () => {
      const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(user.email);
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should reject invalid token", async () => {
      const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer invalidtoken");
      expect(res.status).toBe(401);
    });
  });
});

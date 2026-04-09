const request = require("supertest");
const app     = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
let userToken;
let adminToken;
let testProductId;
let testOrderId;

beforeAll(async () => {
  const [userRes, adminRes] = await Promise.all([
    request(app).post("/api/auth/login").send({ email: "customer@maisonluxe.com", password: "User123!" }),
    request(app).post("/api/auth/login").send({ email: "admin@maisonluxe.com",    password: "Admin123!" }),
  ]);
  userToken  = userRes.body.data?.token;
  adminToken = adminRes.body.data?.token;

  const products = await request(app).get("/api/products?limit=1");
  testProductId = products.body.data?.[0]?.id;
});

afterAll(async () => {
  if (testOrderId) {
    await prisma.orderItem.deleteMany({ where: { orderId: testOrderId } });
    await prisma.order.delete({ where: { id: testOrderId } }).catch(() => {});
  }
  await prisma.$disconnect();
});

describe("Order Routes", () => {
  const shippingAddress = {
    firstName: "Jane", lastName: "Doe",
    line1: "123 Test St", city: "New York",
    state: "NY", zip: "10001", country: "US",
  };

  describe("POST /api/orders", () => {
    it("should place an order when authenticated", async () => {
      if (!testProductId) return;
      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ items: [{ productId: testProductId, quantity: 1 }], shippingAddress });
      expect(res.status).toBe(201);
      expect(res.body.data.orderNumber).toBeDefined();
      testOrderId = res.body.data.id;
    });

    it("should reject order without auth", async () => {
      const res = await request(app).post("/api/orders").send({});
      expect(res.status).toBe(401);
    });

    it("should reject order with empty items", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ items: [], shippingAddress });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/orders", () => {
    it("should return user orders", async () => {
      const res = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/admin/orders", () => {
    it("should return all orders for admin", async () => {
      const res = await request(app)
        .get("/api/admin/orders")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it("should deny non-admin access", async () => {
      const res = await request(app)
        .get("/api/admin/orders")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });
});

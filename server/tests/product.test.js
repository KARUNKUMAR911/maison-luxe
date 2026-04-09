const request = require("supertest");
const app     = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
let adminToken;
let testProductId;
let testCategoryId;

beforeAll(async () => {
  // Login as admin (seeded user)
  const res = await request(app).post("/api/auth/login").send({
    email: "admin@maisonluxe.com",
    password: "Admin123!",
  });
  adminToken = res.body.data?.token;

  // Get a category for product creation
  const cats = await request(app).get("/api/categories");
  testCategoryId = cats.body.data?.[0]?.id;
});

afterAll(async () => {
  if (testProductId) {
    await prisma.product.deleteMany({ where: { id: testProductId } });
  }
  await prisma.$disconnect();
});

describe("Product Routes", () => {
  describe("GET /api/products", () => {
    it("should return paginated products", async () => {
      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter by category slug", async () => {
      const res = await request(app).get("/api/products?category=watches");
      expect(res.status).toBe(200);
      res.body.data.forEach((p) => expect(p.category.slug).toBe("watches"));
    });

    it("should support search", async () => {
      const res = await request(app).get("/api/products?search=watch");
      expect(res.status).toBe(200);
    });

    it("should support pagination", async () => {
      const res = await request(app).get("/api/products?page=1&limit=3");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
    });
  });

  describe("GET /api/products/featured", () => {
    it("should return featured products", async () => {
      const res = await request(app).get("/api/products/featured");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/products/:slug", () => {
    it("should return a product by slug", async () => {
      const res = await request(app).get("/api/products/obsidian-chronograph");
      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe("obsidian-chronograph");
    });

    it("should return 404 for unknown slug", async () => {
      const res = await request(app).get("/api/products/not-a-real-product");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/products (admin)", () => {
    it("should create a product with admin token", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Product",
          slug: `test-product-${Date.now()}`,
          description: "A test product description that is long enough",
          price: 99.99,
          stock: 10,
          sku: `TEST-${Date.now()}`,
          categoryId: testCategoryId,
          images: ["https://example.com/image.jpg"],
          tags: ["test"],
        });
      expect(res.status).toBe(201);
      testProductId = res.body.data?.id;
    });

    it("should reject product creation without auth", async () => {
      const res = await request(app).post("/api/products").send({ name: "Unauthorized" });
      expect(res.status).toBe(401);
    });
  });
});

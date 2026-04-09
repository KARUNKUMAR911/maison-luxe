const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Users ─────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const userPassword = await bcrypt.hash("User123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@maisonluxe.com" },
    update: {},
    create: {
      email: "admin@maisonluxe.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      isVerified: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@maisonluxe.com" },
    update: {},
    create: {
      email: "customer@maisonluxe.com",
      password: userPassword,
      name: "Jane Doe",
      role: "CUSTOMER",
      isVerified: true,
    },
  });

  console.log("✅ Users created");

  // ── Categories ────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "watches" },
      update: {},
      create: {
        name: "Watches",
        slug: "watches",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bags" },
      update: {},
      create: {
        name: "Bags",
        slug: "bags",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
        image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "fragrance" },
      update: {},
      create: {
        name: "Fragrance",
        slug: "fragrance",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "home" },
      update: {},
      create: {
        name: "Home",
        slug: "home",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      },
    }),
  ]);

  console.log("✅ Categories created");

  const [watches, bags, clothing, fragrance, home, accessories] = categories;

  // ── Products ──────────────────────────────────────────
  const productsData = [
    {
      name: "Obsidian Chronograph",
      slug: "obsidian-chronograph",
      description: "A masterfully engineered Swiss chronograph with an obsidian-coated case and sapphire crystal glass. Water-resistant to 100m, this timepiece merges technical excellence with refined aesthetics.",
      price: 1290,
      comparePrice: 1590,
      stock: 15,
      sku: "WTC-001",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800"],
      isFeatured: true,
      tags: ["swiss", "chronograph", "luxury"],
      categoryId: watches.id,
    },
    {
      name: "Silk Noir Handbag",
      slug: "silk-noir-handbag",
      description: "Hand-stitched from the finest Italian calfskin leather, this structured handbag features gold-tone hardware and a detachable shoulder strap. A timeless silhouette for the modern woman.",
      price: 870,
      comparePrice: null,
      stock: 8,
      sku: "BAG-001",
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"],
      isFeatured: true,
      tags: ["leather", "italian", "handbag"],
      categoryId: bags.id,
    },
    {
      name: "Cashmere Overcoat",
      slug: "cashmere-overcoat",
      description: "Woven from Grade-A Mongolian cashmere, this double-breasted overcoat offers unparalleled warmth and drape. A wardrobe cornerstone built to last a lifetime.",
      price: 640,
      comparePrice: 820,
      stock: 20,
      sku: "CLT-001",
      images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800"],
      isFeatured: false,
      tags: ["cashmere", "overcoat", "winter"],
      categoryId: clothing.id,
    },
    {
      name: "Amber Oud Parfum",
      slug: "amber-oud-parfum",
      description: "A rare olfactory journey — aged Hindi oud entwined with Somalian rose absolute and Madagascan vanilla. 75ml Eau de Parfum. Long-lasting, 12+ hours projection.",
      price: 320,
      comparePrice: null,
      stock: 50,
      sku: "FRG-001",
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683702?w=800"],
      isFeatured: true,
      tags: ["oud", "parfum", "arabic"],
      categoryId: fragrance.id,
    },
    {
      name: "Velvet Lounge Chair",
      slug: "velvet-lounge-chair",
      description: "Inspired by mid-century modernism, this lounge chair features hand-carved walnut legs and deep-buttoned Italian velvet upholstery. Made to order in 8–12 weeks.",
      price: 1840,
      comparePrice: 2200,
      stock: 5,
      sku: "HME-001",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
      isFeatured: true,
      tags: ["velvet", "lounge", "mid-century"],
      categoryId: home.id,
    },
    {
      name: "Gold Rimmed Sunglasses",
      slug: "gold-rimmed-sunglasses",
      description: "Handcrafted acetate frames with 24k gold-plated rims and polarized CR-39 lenses. UV400 protection. Includes hand-stitched leather case.",
      price: 490,
      comparePrice: null,
      stock: 30,
      sku: "ACC-001",
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800"],
      isFeatured: false,
      tags: ["sunglasses", "gold", "polarized"],
      categoryId: accessories.id,
    },
    {
      name: "Marble Desk Lamp",
      slug: "marble-desk-lamp",
      description: "A sculptural desk lamp with a Carrara marble base and brushed brass stem. Dimmable LED, 2700K warm light. A functional art piece for the refined workspace.",
      price: 380,
      comparePrice: 460,
      stock: 12,
      sku: "HME-002",
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"],
      isFeatured: false,
      tags: ["marble", "brass", "lamp"],
      categoryId: home.id,
    },
    {
      name: "Leather Oxford Shoes",
      slug: "leather-oxford-shoes",
      description: "Goodyear-welted full-grain calfskin Oxfords, hand-lasted on traditional wooden molds. With proper care, these will last decades and develop a beautiful patina.",
      price: 720,
      comparePrice: null,
      stock: 25,
      sku: "CLT-002",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
      isFeatured: true,
      tags: ["oxford", "leather", "goodyear-welt"],
      categoryId: clothing.id,
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("✅ Products created");

  // ── Reviews ───────────────────────────────────────────
  const watch = await prisma.product.findUnique({ where: { slug: "obsidian-chronograph" } });
  if (watch) {
    await prisma.review.upsert({
      where: { userId_productId: { userId: customer.id, productId: watch.id } },
      update: {},
      create: {
        userId: customer.id,
        productId: watch.id,
        rating: 5,
        title: "Absolute perfection",
        comment: "This watch exceeds every expectation. The finishing is impeccable and it wears beautifully on the wrist.",
      },
    });
  }

  console.log("✅ Reviews created");
  console.log("\n🎉 Seed complete!");
  console.log("   Admin: admin@maisonluxe.com / Admin123!");
  console.log("   User:  customer@maisonluxe.com / User123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

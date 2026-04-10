const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("🌱 Seeding database...");

  // Check if already seeded
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@maisonluxe.com" },
  });

  if (existingAdmin) {
    console.log("✅ Database already seeded — skipping");
    return;
  }

  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const userPassword  = await bcrypt.hash("User123!", 12);

  const admin = await prisma.user.create({
    data: {
      email:      "admin@maisonluxe.com",
      password:   adminPassword,
      name:       "Admin User",
      role:       "ADMIN",
      isVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      email:      "customer@maisonluxe.com",
      password:   userPassword,
      name:       "Jane Doe",
      role:       "CUSTOMER",
      isVerified: true,
    },
  });

  console.log("✅ Users created");

  const categoriesData = [
    { name: "Watches",     slug: "watches",     image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { name: "Bags",        slug: "bags",         image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" },
    { name: "Clothing",    slug: "clothing",     image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400" },
    { name: "Fragrance",   slug: "fragrance",    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400" },
    { name: "Home",        slug: "home",         image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
    { name: "Accessories", slug: "accessories",  image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }

  console.log("✅ Categories created");

  const productsData = [
    {
      name: "Obsidian Chronograph",
      slug: "obsidian-chronograph",
      description: "A masterfully engineered Swiss chronograph with an obsidian-coated case and sapphire crystal glass.",
      price: 1290,
      comparePrice: 1590,
      stock: 15,
      sku: "WTC-001",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
      isFeatured: true,
      tags: ["swiss", "chronograph", "luxury"],
      categoryId: categories["watches"].id,
    },
    {
      name: "Silk Noir Handbag",
      slug: "silk-noir-handbag",
      description: "Hand-stitched from the finest Italian calfskin leather with gold-tone hardware.",
      price: 870,
      stock: 8,
      sku: "BAG-001",
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"],
      isFeatured: true,
      tags: ["leather", "italian", "handbag"],
      categoryId: categories["bags"].id,
    },
    {
      name: "Cashmere Overcoat",
      slug: "cashmere-overcoat",
      description: "Woven from Grade-A Mongolian cashmere, this double-breasted overcoat offers unparalleled warmth.",
      price: 640,
      comparePrice: 820,
      stock: 20,
      sku: "CLT-001",
      images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800"],
      isFeatured: false,
      tags: ["cashmere", "overcoat", "winter"],
      categoryId: categories["clothing"].id,
    },
    {
      name: "Amber Oud Parfum",
      slug: "amber-oud-parfum",
      description: "A rare olfactory journey with aged Hindi oud and Somalian rose absolute.",
      price: 320,
      stock: 50,
      sku: "FRG-001",
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683702?w=800"],
      isFeatured: true,
      tags: ["oud", "parfum", "arabic"],
      categoryId: categories["fragrance"].id,
    },
    {
      name: "Velvet Lounge Chair",
      slug: "velvet-lounge-chair",
      description: "Hand-carved walnut legs and deep-buttoned Italian velvet upholstery.",
      price: 1840,
      comparePrice: 2200,
      stock: 5,
      sku: "HME-001",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
      isFeatured: true,
      tags: ["velvet", "lounge", "mid-century"],
      categoryId: categories["home"].id,
    },
    {
      name: "Gold Rimmed Sunglasses",
      slug: "gold-rimmed-sunglasses",
      description: "Handcrafted acetate frames with 24k gold-plated rims and polarized lenses.",
      price: 490,
      stock: 30,
      sku: "ACC-001",
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800"],
      isFeatured: false,
      tags: ["sunglasses", "gold", "polarized"],
      categoryId: categories["accessories"].id,
    },
    {
      name: "Marble Desk Lamp",
      slug: "marble-desk-lamp",
      description: "Carrara marble base with brushed brass stem. Dimmable LED warm light.",
      price: 380,
      comparePrice: 460,
      stock: 12,
      sku: "HME-002",
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"],
      isFeatured: false,
      tags: ["marble", "brass", "lamp"],
      categoryId: categories["home"].id,
    },
    {
      name: "Leather Oxford Shoes",
      slug: "leather-oxford-shoes",
      description: "Goodyear-welted full-grain calfskin Oxfords, hand-lasted on traditional wooden molds.",
      price: 720,
      stock: 25,
      sku: "CLT-002",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
      isFeatured: true,
      tags: ["oxford", "leather", "goodyear-welt"],
      categoryId: categories["clothing"].id,
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Products created");
  console.log("\n🎉 Seed complete!");
  console.log("   Admin: admin@maisonluxe.com / Admin123!");
  console.log("   User:  customer@maisonluxe.com / User123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
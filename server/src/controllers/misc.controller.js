const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const paymentService = require("../services/payment.service");
const uploadService = require("../services/upload.service");
const adminService = require("../services/admin.service");
const { PrismaClient } = require("@prisma/client");
const ApiError = require("../utils/ApiError");

const prisma = new PrismaClient();

// ── Payment ───────────────────────────────────────────────
exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const result = await paymentService.createPaymentIntent(req.user.id, req.body);
  ApiResponse.ok(res, result);
});

exports.handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const result = await paymentService.handleWebhook(req.body, sig);
  res.json(result);
});

// ── Upload ────────────────────────────────────────────────
exports.uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw ApiError.badRequest("No files uploaded");
  const uploads = await Promise.all(req.files.map((f) => uploadService.uploadImage(f.buffer)));
  ApiResponse.ok(res, uploads, "Images uploaded");
});

// ── Categories ────────────────────────────────────────────
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      children: { select: { id: true, name: true, slug: true } },
    },
    where: { parentId: null },
    orderBy: { name: "asc" },
  });
  ApiResponse.ok(res, categories);
});

exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug },
    include: { children: true, _count: { select: { products: true } } },
  });
  if (!category) throw ApiError.notFound("Category not found");
  ApiResponse.ok(res, category);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.create({ data: req.body });
  ApiResponse.created(res, category, "Category created");
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
  ApiResponse.ok(res, category, "Category updated");
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  ApiResponse.ok(res, null, "Category deleted");
});

// ── Reviews ───────────────────────────────────────────────
exports.createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound("Product not found");

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: { rating, title, comment },
    create: { userId: req.user.id, productId, rating, title, comment },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
  ApiResponse.created(res, review, "Review submitted");
});

exports.deleteReview = asyncHandler(async (req, res) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  ApiResponse.ok(res, null, "Review deleted");
});

// ── Wishlist ──────────────────────────────────────────────
exports.getWishlist = asyncHandler(async (req, res) => {
  const items = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: { product: { include: { category: { select: { name: true, slug: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  ApiResponse.ok(res, items.map((i) => i.product));
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const exists = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: req.user.id, productId } },
  });

  if (exists) {
    await prisma.wishlist.delete({ where: { userId_productId: { userId: req.user.id, productId } } });
    ApiResponse.ok(res, { wishlisted: false }, "Removed from wishlist");
  } else {
    await prisma.wishlist.create({ data: { userId: req.user.id, productId } });
    ApiResponse.ok(res, { wishlisted: true }, "Added to wishlist");
  }
});

// ── Admin Dashboard ───────────────────────────────────────
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  ApiResponse.ok(res, stats);
});

exports.getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const where = search
    ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: Number(limit),
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  ApiResponse.paginated(res, users, { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) });
});

exports.toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw ApiError.notFound("User not found");
  const updated = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: !user.isActive } });
  ApiResponse.ok(res, { isActive: updated.isActive }, "User status updated");
});

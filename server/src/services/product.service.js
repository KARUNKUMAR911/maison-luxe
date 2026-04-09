const { PrismaClient } = require("@prisma/client");
const ApiError = require("../utils/ApiError");

const prisma = new PrismaClient();

const getProducts = async (query) => {
  const {
    page = 1, limit = 12, category, search,
    minPrice, maxPrice, sort = "createdAt",
    order = "desc", featured, tags,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(featured && { isFeatured: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ],
    }),
    ...(minPrice || maxPrice ? {
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    } : {}),
    ...(tags && { tags: { hasSome: tags.split(",") } }),
  };

  const orderBy = sort === "price"
    ? { price: order }
    : sort === "name"
    ? { name: order }
    : sort === "rating"
    ? { reviews: { _count: order } }
    : { [sort]: order };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, skip, take: Number(limit),
      orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const formatted = products.map((p) => ({
    ...p,
    avgRating: p.reviews.length
      ? +(p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
      : 0,
    reviewCount: p._count.reviews,
    reviews: undefined,
    _count: undefined,
  }));

  return {
    products: formatted,
    pagination: {
      total, page: Number(page), limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) throw ApiError.notFound("Product not found");

  const avgRating = product.reviews.length
    ? +(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  return { ...product, avgRating, reviewCount: product._count.reviews, _count: undefined };
};

const createProduct = async (data) => {
  const exists = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (exists) throw ApiError.conflict("Product slug already exists");

  const skuExists = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (skuExists) throw ApiError.conflict("SKU already exists");

  return prisma.product.create({
    data,
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
};

const updateProduct = async (id, data) => {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw ApiError.notFound("Product not found");

  return prisma.product.update({
    where: { id }, data,
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
};

const deleteProduct = async (id) => {
  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) throw ApiError.notFound("Product not found");
  await prisma.product.update({ where: { id }, data: { isActive: false } });
};

const getFeatured = async (limit = 8) => {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: Number(limit),
    include: {
      category: { select: { id: true, name: true, slug: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    ...p,
    avgRating: p.reviews.length
      ? +(p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
      : 0,
    reviews: undefined,
  }));
};

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, getFeatured };

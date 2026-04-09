const { PrismaClient } = require("@prisma/client");
const ApiError = require("../utils/ApiError");
const emailService = require("./email.service");

const prisma = new PrismaClient();

const generateOrderNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ML-${ts}-${rand}`;
};

const placeOrder = async (userId, { items, shippingAddress, paymentMethod, notes }) => {
  // Validate products & stock
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });

  if (products.length !== items.length) throw ApiError.badRequest("One or more products not found");

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for: ${product.name}`);
    }
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const shippingCost = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shippingCost;

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        subtotal,
        shippingCost,
        total,
        shippingAddress,
        paymentMethod,
        notes,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
              name: product.name,
              image: product.images[0] || null,
            };
          }),
        },
      },
      include: { items: true },
    });

    // Decrement stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart
    const cart = await tx.cart.findUnique({ where: { userId } });
    if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  // Send confirmation email (non-blocking)
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  emailService.sendOrderConfirmation(user, order).catch(() => {});

  return order;
};

const getUserOrders = async (userId, { page = 1, limit = 10 }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip, take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: { select: { slug: true, images: true } } } } },
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return { orders, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } };
};

const getOrderById = async (id, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { slug: true, images: true, name: true } } } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) throw ApiError.notFound("Order not found");
  if (role !== "ADMIN" && role !== "SUPER_ADMIN" && order.userId !== userId) {
    throw ApiError.forbidden("Access denied");
  }

  return order;
};

const updateOrderStatus = async (id, { status, trackingNumber }) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw ApiError.notFound("Order not found");

  return prisma.order.update({
    where: { id },
    data: { status, ...(trackingNumber && { trackingNumber }) },
  });
};

const getAllOrders = async ({ page = 1, limit = 20, status, search }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const where = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where, skip, take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } }, items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } };
};

module.exports = { placeOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders };

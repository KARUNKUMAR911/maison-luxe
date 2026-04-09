const { PrismaClient } = require("@prisma/client");
const ApiError = require("../utils/ApiError");

const prisma = new PrismaClient();

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, price: true, comparePrice: true, images: true, stock: true, isActive: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  // Filter out inactive products
  const activeItems = cart.items.filter((i) => i.product.isActive);
  const subtotal = activeItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  return { ...cart, items: activeItems, subtotal, itemCount: activeItems.reduce((s, i) => s + i.quantity, 0) };
};

const addItem = async (userId, { productId, quantity = 1 }) => {
  const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
  if (!product) throw ApiError.notFound("Product not found");
  if (product.stock < quantity) throw ApiError.badRequest(`Only ${product.stock} items in stock`);

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  const newQty = (existing?.quantity || 0) + quantity;
  if (product.stock < newQty) throw ApiError.badRequest(`Only ${product.stock} items available`);

  if (existing) {
    await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }

  return getOrCreateCart(userId);
};

const updateItem = async (userId, itemId, { quantity }) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw ApiError.notFound("Cart not found");

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) throw ApiError.notFound("Cart item not found");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product.stock < quantity) throw ApiError.badRequest(`Only ${product.stock} items in stock`);
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  return getOrCreateCart(userId);
};

const removeItem = async (userId, itemId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw ApiError.notFound("Cart not found");

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) throw ApiError.notFound("Cart item not found");

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getOrCreateCart(userId);
};

const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};

module.exports = { getOrCreateCart, addItem, updateItem, removeItem, clearCart };

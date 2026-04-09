const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalRevenue, monthRevenue, lastMonthRevenue,
    totalOrders, monthOrders,
    totalUsers, monthUsers,
    totalProducts, lowStockProducts,
    recentOrders, topProducts,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: startOfMonth } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    prisma.order.findMany({
      take: 5, orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const topProductIds = topProducts.map((p) => p.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, images: true, price: true },
  });

  const revenueGrowth = lastMonthRevenue._sum.total
    ? (((Number(monthRevenue._sum.total) - Number(lastMonthRevenue._sum.total)) / Number(lastMonthRevenue._sum.total)) * 100).toFixed(1)
    : 0;

  return {
    revenue: {
      total: Number(totalRevenue._sum.total || 0),
      thisMonth: Number(monthRevenue._sum.total || 0),
      growth: Number(revenueGrowth),
    },
    orders: { total: totalOrders, thisMonth: monthOrders },
    users: { total: totalUsers, thisMonth: monthUsers },
    products: { total: totalProducts, lowStock: lowStockProducts },
    recentOrders,
    topProducts: topProducts.map((tp) => ({
      ...topProductDetails.find((p) => p.id === tp.productId),
      totalSold: tp._sum.quantity,
    })),
    ordersByStatus: ordersByStatus.reduce((acc, { status, _count }) => {
      acc[status] = _count.status;
      return acc;
    }, {}),
  };
};

module.exports = { getDashboardStats };

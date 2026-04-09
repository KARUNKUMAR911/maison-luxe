const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const prisma = new PrismaClient();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header first, then cookie
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) throw ApiError.unauthorized("No token — please log in");

  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  if (!user) throw ApiError.unauthorized("User no longer exists");
  if (!user.isActive) throw ApiError.unauthorized("Account deactivated");

  req.user = user;
  next();
});

const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!["ADMIN", "SUPER_ADMIN"].includes(req.user?.role)) {
    throw ApiError.forbidden("Admin access required");
  }
  next();
});

module.exports = { protect, requireAdmin };

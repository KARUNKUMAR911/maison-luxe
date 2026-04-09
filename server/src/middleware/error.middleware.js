const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Prisma known errors
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    error = ApiError.conflict(`${field} already exists`);
  } else if (err.code === "P2025") {
    error = ApiError.notFound("Record not found");
  } else if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token");
  } else if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token expired — please log in again");
  } else if (err.name === "ValidationError") {
    error = ApiError.badRequest(err.message);
  }

  // Log non-operational errors
  if (!error.isOperational) {
    logger.error(`UNHANDLED ERROR: ${err.message}`, { stack: err.stack, url: req.url });
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;

const rateLimit = require("express-rate-limit");

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });

const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 min
  20,
  "Too many auth attempts — please try again in 15 minutes"
);

const apiLimiter = createLimiter(
  60 * 1000, // 1 min
  100,
  "Too many requests — please slow down"
);

const uploadLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  30,
  "Upload limit reached — try again later"
);

module.exports = { authLimiter, apiLimiter, uploadLimiter };

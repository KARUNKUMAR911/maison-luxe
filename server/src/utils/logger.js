const fs = require("fs");
const winston = require("winston");

const { combine, timestamp, colorize, printf, json } = winston.format;

const devFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const isProduction = process.env.NODE_ENV === "production";

const transports = [];

if (isProduction) {
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
    })
  );
} else {
  fs.mkdirSync("logs", { recursive: true });

  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), devFormat),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports,
});

module.exports = logger;

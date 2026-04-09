// ── Currency ──────────────────────────────────────────────
export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

// ── Date ──────────────────────────────────────────────────
export const formatDate = (date, opts = {}) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", ...opts }).format(new Date(date));

export const formatDateShort = (date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

// ── String ────────────────────────────────────────────────
export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const truncate = (str, n = 100) =>
  str.length > n ? str.slice(0, n) + "…" : str;

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// ── Order status ──────────────────────────────────────────
export const ORDER_STATUS_COLORS = {
  PENDING:    "text-yellow-400 bg-yellow-400/10",
  CONFIRMED:  "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-purple-400 bg-purple-400/10",
  SHIPPED:    "text-cyan-400 bg-cyan-400/10",
  DELIVERED:  "text-green-400 bg-green-400/10",
  CANCELLED:  "text-red-400 bg-red-400/10",
  REFUNDED:   "text-orange-400 bg-orange-400/10",
};

export const PAYMENT_STATUS_COLORS = {
  UNPAID:   "text-red-400",
  PAID:     "text-green-400",
  FAILED:   "text-red-500",
  REFUNDED: "text-orange-400",
};

// ── Validation ────────────────────────────────────────────
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPassword = (pw) => pw.length >= 8;

// ── cart.controller.js ────────────────────────────────────
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const cartService = require("../services/cart.service");

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user.id);
  ApiResponse.ok(res, cart);
});

exports.addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body);
  ApiResponse.ok(res, cart, "Item added to cart");
});

exports.updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItem(req.user.id, req.params.itemId, req.body);
  ApiResponse.ok(res, cart, "Cart updated");
});

exports.removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);
  ApiResponse.ok(res, cart, "Item removed");
});

exports.clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);
  ApiResponse.ok(res, null, "Cart cleared");
});

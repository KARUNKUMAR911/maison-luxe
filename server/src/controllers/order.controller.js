const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const orderService = require("../services/order.service");

exports.placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user.id, req.body);
  ApiResponse.created(res, order, "Order placed successfully");
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getUserOrders(req.user.id, req.query);
  ApiResponse.paginated(res, orders, pagination);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
  ApiResponse.ok(res, order);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getAllOrders(req.query);
  ApiResponse.paginated(res, orders, pagination);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body);
  ApiResponse.ok(res, order, "Order status updated");
});

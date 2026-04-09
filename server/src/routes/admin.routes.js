const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/misc.controller");
const orderCtrl = require("../controllers/order.controller");
const { protect, requireAdmin } = require("../middleware/auth.middleware");

router.use(protect, requireAdmin);

router.get("/stats",              ctrl.getDashboardStats);
router.get("/users",              ctrl.getUsers);
router.patch("/users/:id/toggle", ctrl.toggleUserStatus);
router.get("/orders",             orderCtrl.getAllOrders);
router.patch("/orders/:id",       orderCtrl.updateOrderStatus);

module.exports = router;

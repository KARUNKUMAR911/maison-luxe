const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.post("/",       ctrl.placeOrder);
router.get("/",        ctrl.getUserOrders);
router.get("/:id",     ctrl.getOrderById);

module.exports = router;

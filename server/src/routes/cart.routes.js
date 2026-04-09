const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.get("/",                ctrl.getCart);
router.post("/",               ctrl.addItem);
router.put("/:itemId",         ctrl.updateItem);
router.delete("/:itemId",      ctrl.removeItem);
router.delete("/",             ctrl.clearCart);

module.exports = router;

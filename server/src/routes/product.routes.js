const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/product.controller");
const { protect, requireAdmin } = require("../middleware/auth.middleware");

router.get("/",           ctrl.getProducts);
router.get("/featured",   ctrl.getFeatured);
router.get("/:slug",      ctrl.getProductBySlug);
router.post("/",          protect, requireAdmin, ctrl.createProduct);
router.put("/:id",        protect, requireAdmin, ctrl.updateProduct);
router.delete("/:id",     protect, requireAdmin, ctrl.deleteProduct);

module.exports = router;

// category.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/misc.controller");
const { protect, requireAdmin } = require("../middleware/auth.middleware");

router.get("/",          ctrl.getCategories);
router.get("/:slug",     ctrl.getCategoryBySlug);
router.post("/",         protect, requireAdmin, ctrl.createCategory);
router.put("/:id",       protect, requireAdmin, ctrl.updateCategory);
router.delete("/:id",    protect, requireAdmin, ctrl.deleteCategory);

module.exports = router;

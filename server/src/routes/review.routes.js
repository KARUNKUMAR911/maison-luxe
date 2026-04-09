const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/misc.controller");
const { protect, requireAdmin } = require("../middleware/auth.middleware");

router.post("/",        protect, ctrl.createReview);
router.delete("/:id",   protect, requireAdmin, ctrl.deleteReview);

module.exports = router;

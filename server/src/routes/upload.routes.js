const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/misc.controller");
const { protect, requireAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { uploadLimiter } = require("../middleware/rateLimit.middleware");

router.post("/", protect, requireAdmin, uploadLimiter, upload.array("images", 10), ctrl.uploadImages);

module.exports = router;

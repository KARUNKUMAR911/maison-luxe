const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/misc.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.get("/",    ctrl.getWishlist);
router.post("/",   ctrl.toggleWishlist);

module.exports = router;

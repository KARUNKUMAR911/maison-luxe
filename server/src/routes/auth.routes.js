const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");

router.post("/register", authLimiter, ctrl.register);
router.post("/login",    authLimiter, ctrl.login);
router.post("/logout",   protect,     ctrl.logout);
router.get ("/me",       protect,     ctrl.getMe);
router.put ("/profile",  protect,     ctrl.updateProfile);
router.put ("/password", protect,     ctrl.changePassword);

module.exports = router;

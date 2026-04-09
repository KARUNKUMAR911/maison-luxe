const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/misc.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/intent",   protect, ctrl.createPaymentIntent);
router.post("/webhook",  ctrl.handleWebhook);  // raw body — no auth

module.exports = router;

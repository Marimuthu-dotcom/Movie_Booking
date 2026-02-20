const express = require("express");
const router = express.Router();
const { signup,verifyOtp } = require("../controller/authController");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);

module.exports = router;

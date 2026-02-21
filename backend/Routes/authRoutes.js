const express = require("express");
const router = express.Router();
const { signup,verifyOtp,setPassword } = require("../controller/authController");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);

module.exports = router;

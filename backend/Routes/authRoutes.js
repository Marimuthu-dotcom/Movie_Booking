const express = require("express");
const router = express.Router();
const { signup,verifyOtp,setPassword } = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.get("/profile", authMiddleware);

module.exports = router;

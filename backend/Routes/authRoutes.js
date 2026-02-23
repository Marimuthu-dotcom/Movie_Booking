const express = require("express");
const router = express.Router();
const { signup,verifyOtp,setPassword,login} = require("../controller/authController");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.post("/login", login);

module.exports = router;

const express = require("express");
const router = express.Router();
const { signup,verifyOtp,setPassword,login,getPreviousData,postBooking} = require("../controller/authController");
const { verifyToken } = require("../middleware/verifyMiddleware");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.post("/login", login);
router.get("/previous-data", getPreviousData);
router.post("/booking", verifyToken, postBooking);
module.exports = router;

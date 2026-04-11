const express = require("express");
const router = express.Router();
const { signup,verifyOtp,setPassword,login,getPreviousData,postBooking,Orders,getDashboardData,getBookedSeats,uploadImage,addMovie,getSeatsPercentage,getDashboardDetails} = require("../controller/authController");
const { verifyToken } = require("../middleware/verifyMiddleware");
const upload  = require("../middleware/imgUploadMiddleware");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.post("/login", login);
router.get("/previous-data", getPreviousData);
router.post("/booking", verifyToken, postBooking);
router.get("/orders", Orders);
router.get("/dashboard",getDashboardData);
router.get("/booked-seats",getBookedSeats);
router.post("/upload", upload.single("image"), uploadImage);
router.post("/add-movie", addMovie);
router.get("/seatsPercentage", getSeatsPercentage);
router.get("/dashboard-details", getDashboardDetails);


module.exports = router;

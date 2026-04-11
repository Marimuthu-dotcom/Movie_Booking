const db = require("../config/db");
const bcrypt = require("bcrypt");
const { sendOtpMail } = require("../utilis/mailer"); // use mailer function
require("dotenv").config();
const jwt=require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ error: "All fields required" });

    const cleanEmail = email.trim().toLowerCase();

    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE LOWER(email)=?",
      [cleanEmail]
    );

    if (results.length > 0)
      return res.status(409).json({ error: "Email is already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000);

    await db.promise().query(
      "INSERT INTO users (name, email, otp, otp_expiry) VALUES (?,?,?,?)",
      [name, cleanEmail, otp, otp_expiry]
    );

    console.log("Sending OTP to:", cleanEmail);

    await sendOtpMail(cleanEmail, otp);
    console.log("Mail sent successfully");

    res.json({ message: "User registered & OTP sent" });

  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({ error: "Otp is not sending successfully" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE LOWER(email)=?",
      [cleanEmail]
    );
    console.log("Verifying OTP for:", cleanEmail);
    if (results.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = results[0];

    console.log("Stored OTP:", user.otp, "Expiry:", user.otp_expiry);
    
    if (String(user.otp) !== String(otp))
      return res.status(400).json({ error: "Invalid OTP" });

    if (new Date(user.otp_expiry).getTime() < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    await db.promise().query(
      "UPDATE users SET otp=NULL, otp_expiry=NULL WHERE email=?",
      [cleanEmail]
    );

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    const numCount = (password.match(/\d/g) || []).length;
    const alphaCount = (password.match(/[a-zA-Z]/g) || []).length;
    const specialCount = (password.match(/[@$!%*?&]/g) || []).length;

    if (numCount < 2) 
      return res.status(400).json({ error: "Password must contain at least two numbers" });
    if (alphaCount < 5) 
      return res.status(400).json({ error: "Password must contain at least five letters" });
    if (specialCount < 1) 
      return res.status(400).json({ error: "Password must contain at least one special character" });
    const hashedPassword = await bcrypt.hash(password, 10);


      await db.promise().query(
      "UPDATE users SET password=?, is_verified=1WHERE email=?",
      [hashedPassword,email]
    );
;
    res.json({ message: "Password set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE LOWER(email)=?",
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    if (!user.is_verified) {
      return res.status(400).json({ message: "Account not verified" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Password not set yet" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token=jwt.sign(
      {email},
      process.env.JWT_SECRET_KEY,
      {expiresIn:"7d"});

      await db.promise().query(
      "UPDATE users SET current_token=? WHERE email=?",
      [token, user.email]
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPreviousData = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } 
    catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }
    if (decoded.email !== "maripavin7@gmail.com") {
      return res.status(403).json({
        message: "Only admin can access this data"
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin accessed successfully"
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.postBooking = async(req,res) => {
 try {
    const userEmail = req.user.email;

    const { orderId, movie, seats, showTime, amount, paymentMode, date, customerName, customerNumber } = req.body;
    console.log("Booking request received:", { userEmail, orderId, movie, seats, showTime, amount, paymentMode, date, customerName, customerNumber });

    await db.promise().query(
      `INSERT INTO bookings
        (user_email, orderNo, movie_name, date, timing, seats, name, mobile_no, payment_mode, total_amount )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userEmail, orderId ,movie, date, showTime, seats.join(","),customerName, customerNumber, paymentMode, amount]
    );

    res.status(200).json({ message: "Booking successful" });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.Orders = async(req,res) =>{
  try{
    const [row]= await db.promise().query(
      `SELECT orderNo, movie_name, date, seats, timing, total_amount, payment_mode FROM bookings`
    );
    res.json(row);
  }
  catch(err){
    console.error("Orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getDashboardData = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT seats, total_amount FROM bookings WHERE DATE(date) = CURDATE()");

    let totalOrders = rows.length;
    let totalSeats = 0;
    let totalRevenue = 0;

    rows.forEach(row => {
      const seatCount = row.seats ? row.seats.split(",").length : 0;
      totalSeats += seatCount;

      totalRevenue += Number(row.total_amount);
    });

    res.json({
      totalOrders,
      totalSeats,
      totalRevenue
    });

  } catch (err) {
    res.status(500).json({ msg: "Error fetching dashboard data" });
  }
};

exports.getBookedSeats =async (req,res)=>{

  const {movie,date,showTime}=req.query;

  try {
    const [rows] = await db.promise().query(
      `SELECT seats FROM bookings WHERE movie_name = ? AND date = ? AND timing = ?`,
      [movie, date, showTime]
    );

    const bookedSeats = rows.flatMap(row => row.seats.split(",")); 
    const totalBookedSeats = bookedSeats.length;

    res.json({ bookedSeats ,totalBookedSeats});
  } 
  catch (err) {
    console.error("Error fetching booked seats:", err);
    console.log("Error fetching booked seats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadImage = (req, res) => {
  try {
    console.log("FILE:", req.file);
    const imagePath = `/data/images/${req.file.filename}`;

    res.status(200).json({
      success: true,
      path: imagePath
    });

  } catch (err)
   {
    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const {
      movie_index,
      movie_name,
      img,
      per_day,
      screen,
      lang,
      movie_type,
      industry,
      based,
      duration,
      total_seats,
      movie_description,
      story,
      genre,
      start_date,
      end_date
    } = req.body;

    await db.promise().query(
      `INSERT INTO movies 
      (movie_index, movie_name, img, per_day, screen, lang, movie_type, industry, based, duration, total_seats, movie_description, story, genre, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movie_index,
        movie_name,
        img,
        per_day,
        screen,
        lang,
        movie_type,
        industry,
        based,
        duration,
        total_seats,
        movie_description,
        story,
        genre,
        start_date,
        end_date
      ]
    );

    res.status(200).json({
      success: true,
      message: "Movie stored successfully"
    });

  } 
  catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getSeatsPercentage = async (req, res) => {
  try {

     await db.promise().query(`
      UPDATE bookings
      SET 
        start_time = STR_TO_DATE(
          TRIM(SUBSTRING_INDEX(timing, '-', 1)), 
          '%h:%i %p'
        ),
        end_time = STR_TO_DATE(
          TRIM(SUBSTRING_INDEX(timing, '-', -1)), 
          '%h:%i %p'
        )
      WHERE start_time IS NULL OR end_time IS NULL
    `);

   await db.promise().query(`
  UPDATE movies m
  LEFT JOIN (
    SELECT 
      b.movie_name,
      SUM(
        CASE
          WHEN b.seats IS NULL OR b.seats = '' THEN 0
          ELSE LENGTH(b.seats) - LENGTH(REPLACE(b.seats, ',', '')) + 1
        END
      ) AS booked_seats
    FROM bookings b
    WHERE b.date = CURDATE()
      AND '17:03:00' BETWEEN b.start_time AND b.end_time
    GROUP BY b.movie_name
  ) data
  ON TRIM(LOWER(m.movie_name)) = TRIM(LOWER(data.movie_name))
  SET m.percent =  (data.booked_seats / m.total_seats) * 100
`);

     const [rows] = await db.promise().query(`
      SELECT movie_name, percent, total_seats
      FROM movies
    `);

    console.log(rows);
    
    const [row]=await db.promise().query(`
      SELECT movie_name, timing, start_time, end_time
      FROM bookings
      WHERE date = CURDATE() AND '17:03:00' BETWEEN start_time AND end_time
    `);

    console.log(row);
    res.json({ message: "Percentage updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating percentage" });
  }};
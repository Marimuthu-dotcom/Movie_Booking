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
      return res.status(400).json({ error: "Email is already registered" });

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
      "UPDATE users SET password=?, is_verified=1 WHERE email=?",
      [hashedPassword, email]
    );

    res.json({ message: "Password set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
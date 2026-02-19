const db = require("../config/db");
const { sendOtpMail } = require("../utilis/mailer"); // use mailer function
require("dotenv").config();

exports.signup = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "All fields required" });
  }
  const cleanEmail = email.trim().toLowerCase();
  const sql="SELECT * FROM users WHERE LOWER(email)=?";

  db.query(sql, [cleanEmail], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already registered.So Login" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000);
    const insertSQL = "INSERT INTO users (name, email, otp, otp_expiry) VALUES (?,?,?,?)";

    db.query(
      insertSQL,
      [name, email, otp, otp_expiry],
      async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Insert error" });
        }

        try {
          await sendOtpMail(email, otp);
          res.json({
            message: "User registered successfully. OTP sent to your email."
          });
        } 
        catch (mailErr) {
          console.log("OTP send error:", mailErr);
          res.status(500).json({
            error: "User registered but failed to send OTP"
          });
        }
      }
    );
  });
};

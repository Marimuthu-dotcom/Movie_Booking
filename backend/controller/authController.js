const db = require("../config/db");
const { sendOtpMail } = require("../utilis/mailer"); // use mailer function
require("dotenv").config();

exports.signup = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000);

    db.query(
      "INSERT INTO users (name, email, otp, otp_expiry) VALUES (?,?,?,?)",
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
          console.log(mailErr);
          res.status(500).json({
            error: "User registered but failed to send OTP"
          });
        }
      }
    );
  });
};

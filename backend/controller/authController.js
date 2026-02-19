const db = require("../config/db");

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
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Insert error" });
        }

        res.json({
          message: "User registered and OTP generated",
          otp: otp   // (Testing purpose only – later remove this)
        });
      }
    );
  });
};

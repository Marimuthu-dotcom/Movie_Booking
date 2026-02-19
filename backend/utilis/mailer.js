const axios = require("axios");
require("dotenv").config();

async function sendOtpMail(email, otp) {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "maripavin7@gmail.com" }, // verified sender
        to: [{ email }],
        subject: "Your OTP Code",
        textContent: `Your OTP is ${otp}. It is valid for 5 minutes.`
      },
      {
        headers: {
          "api-key": process.env.SMTP_PASS,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Mail error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendOtpMail };

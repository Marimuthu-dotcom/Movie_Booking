const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4
});

async function sendOtpMail(email, otp) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info.response;
}

module.exports = { sendOtpMail };

const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOtpMail(email, otp) {
  const msg = {
    to: email,
    from: "maripavin7@gmail.com", // verified sender
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  await sgMail.send(msg);
  console.log("API Key:", process.env.SENDGRID_API_KEY);
  console.log("OTP sent successfully");
}

module.exports = { sendOtpMail };

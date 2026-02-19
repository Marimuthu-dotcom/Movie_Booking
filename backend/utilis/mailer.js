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

 try {
  await sgMail.send(msg);
  console.log("OTP sent successfully");
} catch (error) {
  console.error("SendGrid error:", error.response?.body || error.message);
}
}

module.exports = { sendOtpMail };

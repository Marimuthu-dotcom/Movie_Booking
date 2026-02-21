import { useRef, useState } from "react";
import styles from "../styles/OtpPage.module.css";
import axios from "axios";

function OtpPage({userEmail, onClose,onVerified }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [verified, setVerified] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Enter full OTP");
      return;
    }

    console.log("OTP entered:", enteredOtp);

    try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
      email: userEmail, 
      otp: enteredOtp
    });
     
    alert("OTP verified.")
    setVerified(true);
    onVerified(userEmail);   

  } catch (err) {
    alert(err.response?.data.error || "Invalid OTP");
  }
  };

  return (
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>

        <h2 style={{ fontFamily: "Roboto, serif", fontWeight: "500" }}>OTP Verification</h2>

        <div className={styles.otpBox}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className={styles.verifyBtn} style={{ fontFamily: "Roboto, serif" }} onClick={handleVerify}>
          Verify OTP
        </button>

        {verified && <p className={styles.success}>Verified ✅</p>}
      </div>
  );
}

export default OtpPage;

import styles from "../styles/LoginPage.module.css";
import { useState } from "react";
import axios from "axios";

function SignUpPage({ switchToLogin, OpenOtp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) 
      return alert("All fields required");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        name,
        email,
      });    
      OpenOtp();              
    } catch (err) {
      console.log(err);
      alert(err.response?.data.error || "Server error");
    }
  };

  return (
      <div className={styles.modal} style={{ gap: "3px" }}>
        <h2 style={{ fontFamily: "Roboto, serif", color: "white" }}>Create Account</h2>
        <div className={styles.formBox} style={{ paddingTop: "10px" }}>
          <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className={styles.sign}>
          <h4 style={{ fontFamily: "Roboto, serif", color: "white" }}>
            Already have an account?{" "}
            <span
              style={{ color: "orange", textDecoration: "underline", cursor: "pointer" }}
              onClick={switchToLogin}
            >
              Login
            </span>
          </h4>
        </div>
      </div>
  );
}

export default SignUpPage;

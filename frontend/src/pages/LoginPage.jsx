import { useState } from "react";
import styles from "../styles/LoginPage.module.css";
import axios from "axios";

function LoginPage({ onClose, switchToSignUp ,closing}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("All fields are required");
    return;
  }

  try{
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
          email,
          password
      });
     }catch(err){
      alert(err.response?.data.message || "Login failed");
      return;
     }
      alert("Login successful ✅");
      onClose();
};

  return (
      <div className={`${styles.modal} ${closing?styles.closeModel:""}`}>
        <div className={styles.login} style={{ textAlign: "center" }}>
          <button className={styles.closeBtn} onClick={onClose} style={{ color: "white" }}>×</button>
          <h2 style={{ color: "white", fontFamily: "Roboto, serif" }}>Welcome</h2>
          <h4 style={{ color: "white", fontFamily: "Roboto, serif" }}>
            Don't have an account yet?{" "}
            <span
              style={{ color: "orange", textDecoration: "underline", cursor: "pointer" }}
              onClick={switchToSignUp}
            >
              Sign Up
            </span>
          </h4>
        </div>

        <div className={styles.formBox}>
          <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">LOG IN</button>
          </form>
        </div>
      </div>
  );
}

export default LoginPage;

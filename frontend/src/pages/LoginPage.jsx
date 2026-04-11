import { useState } from "react";
import styles from "../styles/LoginPage.module.css";
import axios from "axios";

function LoginPage({ onClose, switchToSignUp ,closing, setIsLogged,setIsAdmin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [icon, setIcon] = useState(true);
   const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("All fields are required");
    return;
  }

  setLoading(true);

  try{
      const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
          email,
          password
      });
      sessionStorage.setItem("token", res.data.token);

      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      const userEmail = payload.email;

      // 👇 CHECK
      if (userEmail === "maripavin7@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsLogged(true);
      alert("Login successful ✅");
      onClose();
     }
     catch(err){
      alert(err.response?.data.message || "Login failed");
      return;
     }
     finally{
      setLoading(false);
     }
};

  return (
      <div className={`${styles.modal} ${closing?styles.closeModel:""}`}>
      {loading && (
    <div className={styles.loadingOverlay}>
      <div className={styles.loader}></div>
      <p style={{color:"white",fontFamily: "Roboto, serif" ,position: "absolute",
  top: "63%",
  left: "52%",
  transform: "translate(-50%, -50%)"
}}>Logging in...</p>
    </div>
  )}
        <div className={styles.login} style={{ textAlign: "center" }}>
          <button className={styles.closeBtn} onClick={onClose} style={{ color: "white" }}>×</button>
          <h2 style={{ color: "white", fontFamily: "Roboto, serif" }}>Welcome</h2>
          <h4 style={{ color: "white", fontFamily: "Roboto, serif" }}>
            Don't have an account yet?{" "}
            <span
              style={{ color: "orange", textDecoration: "underline", cursor: "pointer" }}
              onClick={switchToSignUp}
              className={styles.signUpLink}
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
            <div style={{ position: "relative", width: "100%" }}>
            <input type={icon?"password":"text"} placeholder="Password" value={password} autoComplete="new-password" onChange={e => setPassword(e.target.value)} required/>
            <span 
            onClick={()=>setIcon(!icon)}
            style={{
                position: "absolute",
                right: "10px",
                top:"10px",
                cursor: "pointer",
                fontSize: "1.1rem",
                color: "gray"
            }}>{icon?<i className="bi bi-eye-slash-fill"></i>:<i className="bi bi-eye-fill"></i>}</span>
          </div>
            <button type="submit">LOG IN</button>
          </form>
        </div>
      </div>
  );
}

export default LoginPage;

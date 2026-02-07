// LoginPage.jsx
import styles from "../styles/LoginPage.module.css"; // create CSS

function LoginPage({ onClose,switchToSignUp }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.login} style={{textAlign:"center"}}><button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 style={{color:"rgb(73,73,73)",fontFamily:"Roboto, serif"}}>welcome</h2>
        <h4 style={{color:"rgb(73,73,73)",fontFamily:"Roboto, serif"}}>Don't have an account yet?{" "}<span style={{color:"orange",fontFamily:"Roboto, serif", textDecoration: "underline", cursor: "pointer" }} onClick={switchToSignUp}> Sign Up</span></h4>
        </div>
        <div className={styles.formBox}>
        <form className={styles.form}>
          <input type="email" placeholder="Email" required/>
          <input type="password" placeholder="Password" required/>
          <button type="submit">LOG IN</button>
        </form></div>
      </div>
    </div>
  );
}

export default LoginPage;

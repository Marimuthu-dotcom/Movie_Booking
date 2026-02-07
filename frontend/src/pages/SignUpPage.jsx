import styles from "../styles/LoginPage.module.css"
function SignUpPage({ onClose, switchToLogin }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{gap:"3px"}}>
        <h2 style={{fontFamily:"Roboto, serif"}}>Create Account</h2>
        <div className={styles.formBox} style={{paddingTop:"10px"}}>
        <form action="" className={styles.form}>
        <input type="text" placeholder="Full Name" required/>
        <input type="email" placeholder="Email" required/>
        <button>Sign Up</button>
        </form>
        </div>
        <div className={styles.sign}>
        <h4 style={{fontFamily:"Roboto, serif"}}>
          Already have an account?{" "}
          <span
            style={{ color: "orange", textDecoration: "underline", cursor: "pointer" ,fontFamily:"Roboto, serif"}}
            onClick={switchToLogin}
          >
            Login
          </span>
        </h4>
        </div>
      </div>
    </div>
  );
  
}
export default SignUpPage;

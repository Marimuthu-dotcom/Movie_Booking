import { Outlet, useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css";
import SideBar from "./SideBar";
import LoginPage from "../pages/LoginPage"
import { useState ,useEffect} from "react";
import SignUpPage from "../pages/SignUpPage";
import OtpPage from "../pages/OtpPage";
import PasswordPage from "../pages/PasswordPage";

function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null); 
  const [closing, setClosing] = useState(false);
  const [userEmail,setUserEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
    }
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.appLayout}>
        <div className={styles.sideBar}>
          <SideBar openLogin={()=>setModal("login")} user={user} setUser={setUser}/>
        </div>
        <div
          className={styles.contentPage}
          onScroll={(e) => setScrolled(e.target.scrollTop > 1)}
         >
          {/* Outlet receives context */}
          <Outlet context={{ scrolled }} />
        </div>
        {modal && (
         <div className={`${styles.overlay} ${closing ? styles.fadeOut : styles.fadeIn}`}>
        {modal === "login" && (
          <LoginPage
            onClose={() =>{setClosing(true);
            setTimeout(() => {
              setModal(null); 
              setClosing(false); 
            }, 600);}}
            closing={closing}
            switchToSignUp={() => setModal("signup")}
          />
        )}
        {modal === "signup" && (
          <SignUpPage
            switchToLogin={() => setModal("login")}
            OpenOtp={(email) => {
              setUserEmail(email);
              setModal("otp"); 
            }}
          />
        )}
        {modal==="otp" && (
          <OtpPage 
          onClose={() => setModal(null)}
          userEmail={userEmail}
          onVerified={(userEmail) =>{
            setUserEmail(userEmail);
            setModal("password")}
          }/>
        )
        }
         {modal==="password" && (
          <PasswordPage 
           userEmail={userEmail}
           onClose={() => setModal(null)}
           setUser={setUser}
          />
        )
        }
        </div>)}
      </div>
    </div>
  );
}

export default Layout;

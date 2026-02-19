import { Outlet, useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css";
import SideBar from "./SideBar";
import LoginPage from "../pages/LoginPage"
import { useState } from "react";
import SignUpPage from "../pages/SignUpPage";
import OtpPage from "../pages/OtpPage";

function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null); 
  const [closing, setClosing] = useState(false);

  return (
    <div className={styles.app}>
      <div className={styles.appLayout}>
        <div className={styles.sideBar}>
          <SideBar openLogin={()=>setModal("login")}/>
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
            OpenOtp={() => {
              setModal("otp");         // open OTP
            }}
          />
        )}
        {modal==="otp" && (
          <OtpPage      // ✅ VERY IMPORTANT
          onClose={() => setModal(null)}
          onVerified={() =>{
            alert("OTP verified. Please login")
            setModal("login")}
          }/>
        )
        }
        </div>)}
      </div>
    </div>
  );
}

export default Layout;

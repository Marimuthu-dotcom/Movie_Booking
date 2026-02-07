import { Outlet, useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css";
import SideBar from "./SideBar";
import LoginPage from "../pages/LoginPage"
import { useState, useEffect } from "react";
import SignUpPage from "../pages/SignUpPage";

function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false); // ✅ animation state
  const location = useLocation(); // 🔑 detects route change
  const [modal, setModal] = useState(null); // null | "login" | "signup"

  useEffect(() => {
    // Trigger animation on mount or route change
    setContentLoaded(false); // reset
    const timer = setTimeout(() => setContentLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]); // triggers every time route changes


  return (
    <div className={styles.app}>
      <div className={styles.appLayout}>
        <div className={styles.sideBar}>
          <SideBar openLogin={()=>setModal("login")}/>
        </div>
        <div
          className={`${styles.contentPage} ${contentLoaded ? styles.contentPageLoaded : ""}`}
          onScroll={(e) => setScrolled(e.target.scrollTop > 1)}
         >
          {/* Outlet receives context */}
          <Outlet key={location.pathname} context={{ scrolled }} />
        </div>
        {modal === "login" && (
          <LoginPage
            onClose={() => setModal(null)}
            switchToSignUp={() => setModal("signup")}
          />
        )}
        {modal === "signup" && (
          <SignUpPage
            onClose={() => setModal(null)}
            switchToLogin={() => setModal("login")}
          />
        )}
      </div>
    </div>
  );
}

export default Layout;

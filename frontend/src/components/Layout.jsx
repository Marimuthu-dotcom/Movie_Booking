import { Outlet, useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css";
import SideBar from "./SideBar";
import { useState, useEffect } from "react";

function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false); // ✅ animation state
  const location = useLocation(); // 🔑 detects route change

  useEffect(() => {
    // Trigger animation on mount or route change
    setContentLoaded(false); // reset
    const timer = setTimeout(() => setContentLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]); // triggers every time route changes

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 10);
  };

  return (
    <div className={styles.app}>
      <div className={styles.appLayout}>
        <div className={styles.sideBar}>
          <SideBar />
        </div>
        <div
          className={`${styles.contentPage} ${contentLoaded ? styles.contentPageLoaded : ""}`}
        >
          {/* Outlet receives context */}
          <Outlet key={location.pathname} context={{ scrolled }} />
        </div>
      </div>
    </div>
  );
}

export default Layout;

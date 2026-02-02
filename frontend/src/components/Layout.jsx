import { Outlet } from "react-router-dom";
import styles from "../styles/Layout.module.css"
import SideBar from "./SideBar";
import {useState} from "react";
function Layout(){
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = (e) => {
    if (e.target.scrollTop > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
   return(
    <div className={styles.app}>
    <div className={styles.appLayout}>
       <div className={styles.sideBar}><SideBar /></div>
       <div className={styles.contentPage} onScroll={handleScroll}>
          <Outlet context={{ scrolled }} />
        </div>
    </div>
    </div>
   );
}
export default Layout;

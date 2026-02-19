import { NavLink } from "react-router-dom";
import logo from "../assets/LOGO.png"
import styles from "../styles/SideBar.module.css"
function SideBar({openLogin}){
   return(
    <div className={styles.sidebar}>
        <div className={styles.first}>
            <span className={styles.span1}>
            <span className={styles.logo}>
                <img src={logo}/>
            </span>
            <h3>MK Cinema</h3>
            </span>
            <span className={styles.span2}>
           <nav className={styles.menu}>
               <NavLink to="/" className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-house-fill"></i>Home</NavLink>
               <NavLink to="/booking" className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-plus-circle-fill"></i>Book a Show</NavLink>
               <NavLink to="/history" className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-stack"></i>Ticket History</NavLink>
               <NavLink to="/movie" className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-camera-reels-fill"></i>Movie</NavLink>
           </nav>
           </span>
        </div>
        <div className={styles.second}>
           <button type="button" onClick={openLogin}>LOG IN</button>
        </div>
    </div>
   );
}
export default SideBar;

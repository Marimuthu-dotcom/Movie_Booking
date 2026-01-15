import { NavLink } from "react-router-dom";
import screen from "../assets/Screen.jpg"
import styles from "../styles/SideBar.module.css"
function SideBar(){
   return(
    <div className={styles.sidebar}>
        <div className={styles.first}>
            <span className={styles.span1}>
            <span className={styles.logo}>
                <img src={screen}/>
            </span>
            <h3>MK Cinema</h3>
            </span>
            <span className={styles.span2}>
           <nav className={styles.menu}>
               <NavLink className={styles.link}><i className="bi bi-house-fill"></i>Home</NavLink>
               <NavLink className={styles.link}><i className="bi bi-plus-circle-fill"></i>Book a Show</NavLink>
               <NavLink className={styles.link}><i className="bi bi-stack"></i>Ticket History</NavLink>
               <NavLink className={styles.link}><i className="bi bi-camera-reels-fill"></i>Movie</NavLink>
           </nav>
           </span>
        </div>
        <div className={styles.second}>
           <button type="button">Log Out</button>
        </div>
    </div>
   );
}
export default SideBar;
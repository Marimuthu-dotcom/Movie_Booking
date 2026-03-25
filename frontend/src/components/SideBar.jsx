import { NavLink } from "react-router-dom";
import logo from "../assets/LOGO.png"
import styles from "../styles/SideBar.module.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SideBar({openLogin,isLogged,setIsLogged,isAdmin,setIsAdmin}){

  const navigate = useNavigate();
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
               {!isAdmin && (<NavLink to="/booking" className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-plus-circle-fill"></i>Book a Show</NavLink>)}
    {isAdmin && (<NavLink to="/booking" className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-plus-circle-fill"></i>Add a Show</NavLink>)}
              {isAdmin && (<NavLink to="/history"
               onClick={async (e) => {
              e.preventDefault(); 
              const token = sessionStorage.getItem("token");
              if (!token) 
                return alert("Please login first");

              try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/previous-data`, {
                  headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 200) {
                  navigate("/history");
                } 
                else {
                  alert(res.data.message || "Only admin can access this page");
                }
              } 
              catch (err) {
              console.log("Axios Error Object:", err); // ✅ see full error in console
              console.log("Response:", err.response);   // ✅ see server response (status, data)
              console.log("Request:", err.request);     // ✅ see request sent
              console.log("Message:", err.message);     // ✅ error message string

              if (err.response?.status === 403) {
                alert("Only admin can access this page");
              } 
              else if (err.response?.status === 401) {
                alert("Invalid or expired token");
              } 
              else {
                alert("Something went wrong");
              }
            }
            }}
               className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-stack"></i>Ticket History</NavLink>)}
               <NavLink to="/movie" className={({ isActive }) =>
      `${styles.link} ${isActive ? styles.active : ""}`
    }><i className="bi bi-camera-reels-fill"></i>Movie</NavLink>
           </nav>
           </span>
        </div>
        <div className={styles.second}>
           {isLogged?(<button type="button" style={{backgroundColor:"red"}} onClick={() => {
            setIsLogged(false);
            setIsAdmin(false);
            sessionStorage.removeItem("token");
  }}>LOG OUT</button>):(<button type="button" onClick={openLogin}>LOG IN</button>)}
        </div>
    </div>
   );
}
export default SideBar;
import styles from "../styles/Layout.module.css"
import SideBar from "./SideBar";
function Layout(){
   return(
    <div className={styles.app}>
    <div className={styles.appLayout}>
       <div className={styles.sideBar}><SideBar /></div>
       <div className={styles.contentPage}>Muthu</div>
    </div>
    </div>
   );
}
export default Layout;

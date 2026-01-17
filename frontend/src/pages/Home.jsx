import styles from "../styles/Home.module.css"
import {useState} from "react"
import { NavLink } from "react-router-dom";
import screen from "../assets/Screen.jpg"
function Home(){
    const[selectedType,setSelectedType]=useState("All");
    const types=[
        {value:"all",label:"All"},
        {value:"adventure",label:"Adventure"},
        {value:"comedy",label:"Comedy"},
        {value:"drama",label:"Drama"},
        {value:"romance",label:"Romance"}
    ];

    const shows=[
        {img:screen,Movie:"Avengers",perDay:"3 Shows per Day",screen:["2D","3D"],lang:["Tamil","English"]},
        {img:screen,Movie:"Avengers",perDay:"3 Shows per Day",screen:["2D"],lang:["Tamil"]},
        {img:screen,Movie:"Avengers",perDay:"3 Shows per Day",screen:["2D"],lang:["Tamil"]},
        {img:screen,Movie:"Avengers",perDay:"3 Shows per Day",screen:["2D"],lang:["Tamil","English"]},
        {img:screen,Movie:"Avengers",perDay:"3 Shows per Day",screen:["2D"],lang:["Tamil"]},
        {img:screen,Movie:"Avengers",perDay:"3 Shows per Day",screen:["2D","3D"],lang:["Tamil"]}

    ];
    return(
        <div className={styles.home}>
                <div className={styles.home1}>
                    <div className={styles.div1}>
                    <nav className={styles.top}>
                        <NavLink className={styles.date}>Today</NavLink>
                        <NavLink className={styles.date}>View Previous Data</NavLink>
                    </nav>
                    </div>
                    <div className={styles.div2}>
                        <input type="search" placeholder="Search" className={styles.search}/>
                        <button type="button" className={styles.searchbtn}><i className="bi bi-search"></i></button>
                    </div>
                </div>
                <div className={styles.home2}>
                <div className={styles.home2child1}>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count1}>0</h3>
                        <h3>Today's Total Show</h3>
                    </div>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count2}>0</h3>
                        <h3>Total Orders</h3>
                    </div>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count3}>0</h3>
                        <h3>Total Seats Booked</h3>
                    </div>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count4}>${Number(100000).toLocaleString("en-IN")}</h3>
                        <h3>Total Revenue</h3>
                    </div>
                </div>
                <div className={styles.home2child2}>
                    <div className={styles.leftHome2}>
                        <div className={styles.child1}>Muthu</div>
                        <div className={styles.child2}>Pavithra</div>
                    </div>
                    <div className={styles.rightHome2}>
                        <div className={styles.showTime}>
                            <span className={styles.name}>Current Running Show</span>
                            <span>
                                <select 
                                value={selectedType}
                                onChange={(e)=>setSelectedType(e.target.value)}
                                className={styles.option}>
                                {types.map((t,index)=>(
                                    <option key={index} value={t.value}>{t.label}</option>
                                ))}
                                </select>
                                </span>
                        </div>
                        <div className={styles.showList}>
                            {shows.map((s,index)=>(
                            <div key={index} className={styles.lists}>
                               <div className={styles.div1}>
                               <div className={styles.movieImage}><img src={s.img} alt="" /></div>
                               <div className={styles.Movies}>
                                <h4>{s.Movie}</h4>
                                <h4>{s.perDay}</h4>
                                </div>
                               </div>
                               <div className={styles.div2}>
                                {/* Screen types */}
                                <span className={styles.screen}>
                                    {s.screen.map((type, i) => (
                                    <h5 key={i}>{type}</h5>
                                    ))}
                                </span>

                                {/* Languages */}
                                <span className={styles.language}>
                                    {s.lang.map((l, i) => (
                                    <h5 key={i}>{l}</h5>
                                    ))}
                                </span>
                                </div>
                            </div>))
                           }
                        </div>
                    </div>
                </div>
                </div>
        </div>
    );

}
export default Home;
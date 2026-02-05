import styles from "../styles/Home.module.css"
import {useState,useEffect} from "react"
import { NavLink } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {useNavigate} from "react-router-dom"
import axios from "axios";
 const showCycle = [
                { openFrom: "00:00", openTo: "09:00", show: "09:00 - 12:00" },
                { closedFrom: "09:00", closedTo: "12:00" },

                { openFrom: "12:00", openTo: "12:30", show: "12:30 - 15:30" },
                { closedFrom: "12:30", closedTo: "15:30" },

                { openFrom: "15:30", openTo: "16:30", show: "16:30 - 19:30" },
                { closedFrom: "16:30", closedTo: "19:30" },

                { openFrom: "19:30", openTo: "21:00", show: "20:00 - 23:00" },
                { closedFrom: "20:00", closedTo: "20:04" },
            ];

function getScreenStatus() {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const toMin = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  for (let slot of showCycle) {
    if (slot.openFrom) {
      if (nowMin >= toMin(slot.openFrom) && nowMin < toMin(slot.openTo)) {
        return { status: "OPEN", show: slot.show };
      }
    }

    if (slot.closedFrom) {
      if (nowMin >= toMin(slot.closedFrom) && nowMin < toMin(slot.closedTo)) {
        return { status: "CLOSED" };
      }
    }
  }

  return { status: "END" };
}

function Home(){
    const[selectedType,setSelectedType]=useState("all");
    const[shows,setShows]=useState([]);
    const[searchText,setSearchText]=useState("");
    const {scrolled}=useOutletContext();
    const navigate=useNavigate();
    const types=[
        {value:"all",label:"All"},
        {value:"adventure",label:"Adventure"},
        {value:"comedy",label:"Comedy"},
        {value:"action",label:"Action"},
        {value:"drama",label:"Drama"},
        {value:"romance",label:"Romance"},
        {value:"love",label:"Love"},
        {value:"horror",label:"Horror"}
    ];
    const [screenStatus, setScreenStatus] = useState(getScreenStatus());
    const filteredShows = shows.filter((movie) => {
  // 🔍 1. Search has first priority
  if (searchText.trim() !== "") {
    return movie.movie_name
      .toLowerCase()
      .includes(searchText.toLowerCase());
  }

  // 🎭 2. Type filter (only if search empty)
  if (selectedType !== "all") {
    return movie.movie_type.includes(selectedType);
  }

  // 📽️ 3. Default
  return true;
});

    useEffect(() => {
        const interval = setInterval(() => {
            setScreenStatus(getScreenStatus());
        }, 60000); // every 1 min

        return () => clearInterval(interval);
     }, []);

    useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_URL}/api/movies`)
    .then((res) => {
      setShows(res.data);
    })
    .catch((err) => {
      console.error("API error:", err);
    });
}, []);
    return(
        <div className={styles.home}>
                <div className={`${styles.home1} ${scrolled ? styles.scrolled : ""}`}>
                    <div className={styles.div1}>
                    <nav className={styles.top}>
                        <NavLink className={styles.date}>Today</NavLink>
                        <NavLink className={styles.date}>View Previous Data</NavLink>
                    </nav>
                    </div>
                    <div className={styles.div2}>
                        <input type="search" placeholder="Search Movie..." className={styles.search} value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                        <button type="button" onClick={()=>setSelectedType("all")} className={styles.searchbtn}><i className="bi bi-search"></i></button>
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
                        <div className={styles.child1}>
                            <div className={styles.chart}>
                                {shows.map((show, index) => (
                                    <div key={index} className={styles.barRow}>
                                    <div
                                        className={styles.barFill}
                                        style={{ width: show.percent ,background:show.gradient,color:show.text}}
                                    >{show.percent}
                                    </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.chartList}>
                                <ul className={styles.movielist}>
                                    {shows.map((show, index) => (
                                    <li key={index}>{show.movie_name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.child2}>
                            {shows.map((movie,index)=>(
                            <div className={styles.screenList} key={index}>
                               <span><h4 className={styles.screenTitle}>Screen {index+1}</h4></span>
                                <span>{screenStatus.status === "OPEN" ? (
                                        <>
                                        <p className={styles.movieName}>{movie.movie_name}</p>
                                        <p className={styles.movieTime}>{screenStatus.show}</p>
                                        <button className={styles.bookBtn} onClick={() => navigate(
                                        `/booking/seat/${encodeURIComponent(movie.movie_name)}`,
                                        { state: { movieData: movie } }
                                        )}>Booking</button>
                                        </>
                                    ) : (
                                        <>
                                        <p className={styles.movieName}>{movie.movie_name}</p>
                                        <p style={{ color: "red", fontWeight: "bold" }}>
                                        CLOSED
                                        </p>
                                        </>
                                    )}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.rightHome2}>
                        <div className={styles.showTime}>
                            <span className={styles.name}>Current Running Show</span>
                            <span>
                                <select 
                                value={selectedType}
                                onChange={(e)=>{
                                    setSelectedType(e.target.value);
                                    setSearchText("")}}
                                className={styles.option}>
                                {types.map((t,index)=>(
                                    <option key={index} value={t.value}>{t.label}</option>
                                ))}
                                </select>
                                </span>
                        </div>
                        <div className={styles.showList}>
                            {filteredShows.length===0?
                            (
                              <p className={styles.notFound}>Movies Not Found!</p>
                            ):
                            (
                            filteredShows.map((s,index)=>(
                            <div key={index} className={styles.lists}>
                               <div className={styles.div1}>
                               <div className={styles.movieImage}><img src={s.img} alt="" /></div>
                               <div className={styles.Movies}>
                                <h4>{s.movie_name}</h4>
                                <h4>{s.per_day}</h4>
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
                           )}
                        </div>
                    </div>
                </div>
                </div>
        </div>
    );

}
export default Home;
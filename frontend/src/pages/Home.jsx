import styles from "../styles/Home.module.css"
import { useState, useEffect, useContext } from "react";
import { useOutletContext,NavLink } from "react-router-dom";
import { MoviesContext } from "../context/MoviesContent";
import DateBooking from "./DateBooking";
import PreviousDateSelector from "./PreviousDateSelector";
import axios from "axios";

function convertToMinutes(duration) {
  const parts = duration.match(/\d+/g); //It split the hour and min ["2","30"]

  if (!parts) 
    return 0;

  const hours = parseInt(parts[0]); //2
  const minutes = parts[1] ? parseInt(parts[1]) : 0; //30

  return (hours * 60) + minutes;
}


function generateShowSlots(movie) {
  const durationMin = convertToMinutes(movie.duration); //150
  const BREAK_TIME = 30; 

  let start = (9 * 60) + 30; // 9:30 AM === 570
  const shows = [];

  for (let i = 0; i < 4; i++) {
    const end = start + durationMin; //570 + 150 = 720
    shows.push({ start, end });
    start = end + BREAK_TIME;
  }

  return shows;
}

function formatTime(minutes) {
  let h = Math.floor(minutes / 60);
  const m = minutes % 60;

  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${String(m).padStart(2,"0")} ${ampm}`;
}

function isSlotAvailable(show, selectedDate) //150min ,17 feb
 {
  const today = new Date();
  const selected = new Date(selectedDate);

  const todayStr = today.toISOString().split("T")[0]; 
  const selectedStr = selected.toISOString().split("T")[0];

  const nowMin = today.getHours() * 60 + today.getMinutes();

  if (selectedStr < todayStr) 
    return false;

  if (selectedStr === todayStr) {
    if (show.start <= nowMin) 
      return false;
  }

  return true;
}

function generateDates(start, end){
  const dates = [];

  const today = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  let current =
    today > startDate ? new Date(today) : new Date(startDate);

  while (current <= endDate) {
     const formattedDate = current.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    dates.push({
      fullDate: current.toISOString().split("T")[0], 
      displayDate: formattedDate, 
    });

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

function Home() {
  const { scrolled, isAdmin ,isLogged} = useOutletContext();
  const { currentMovies,loading } = useContext(MoviesContext);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [screenMovies, setScreenMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const[lastCount,setLastCount]=useState(6);
  const [activeCategory, setActiveCategory] = useState("today");
  const [dateSelectorOpen, setDateSelectorOpen] = useState(false);
  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    totalSeats: 0,
    totalRevenue: 0
  });

  useEffect(()=>{

    if(!isAdmin)
      return;

    const fetchDashboard=async()=>{
  try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/dashboard`);

      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  
  fetchDashboard();
}, [isAdmin]);

useEffect(() => {
  const fetchSeatsPercentage = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/seatsPercentage`
      );

      console.log(response.data.message);

    } catch (err) {
      console.error("Error fetching seats %:", err);
    }
  };

  fetchSeatsPercentage();
}, []);

  const types = [
    {value:"all",label:"All"}, {value:"adventure",label:"Adventure"}, {value:"comedy",label:"Comedy"},
    {value:"action",label:"Action"}, {value:"drama",label:"Drama"}, {value:"romance",label:"Romance"},
    {value:"love",label:"Love"}, {value:"horror",label:"Horror"},{value:"crime",label:"Crime"},{value:"thriller",label:"Thriller"}
  ];

   const handleCategoryClick = async (category) => {

  if (category === "previous") {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/previous-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert(res.data.message);
      setActiveCategory(category);
      setDateSelectorOpen(true);
    } catch (err) {
      console.log("Error:", err);
      if (err.response?.status === 403) {
        alert("Only admin can view previous data");
      } else if (err.response?.status === 401) {
        alert("Invalid or expired token");
      } else {
        alert("Failed to fetch data");
      }
    }
  }

  if (category === "today") {
    setActiveCategory(category);
    setScreenMovies(currentMovies);
  }
};
  const totalShows = currentMovies.reduce((total, movie) => {
  const number = movie.per_day.split(" ")[0];
  return total + Number(number);
  }, 0);


  const filteredShows = currentMovies.filter(movie => {
    if (searchText.trim() !== "") 
        return movie.movie_name.toLowerCase().includes(searchText.toLowerCase());
    if (selectedType !== "all") 
        return movie.movie_type.includes(selectedType);
    return true;
  });

  useEffect(() => {
  if (currentMovies.length > 0) {
    setScreenMovies(currentMovies); // Use all current movies from context
  }
  if (filteredShows.length > 0) {
    setLastCount(filteredShows.length);
  }
}, [currentMovies,filteredShows]);

    return(
        <div className={styles.home} style={{overflowX:"hidden"}}>
                <div className={`${styles.home1} ${scrolled ? styles.scrolled : ""}`}>
                    <div className={styles.div1}>
                    <nav className={styles.top}>
                        <NavLink className={`${styles.date} ${
                              activeCategory === "today" ? styles.activeNow : ""
                            }`} style={{color:"rgb(255, 255, 4)"}} onClick={()=>handleCategoryClick("today")}>Today Running Show</NavLink>
                        {isAdmin && (<NavLink  className={`${styles.date} ${
                              activeCategory === "previous" ? styles.activeNow : ""
                            }`} onClick={()=>handleCategoryClick("previous")}>View Previous Data</NavLink>)}
                    </nav>
                    </div>
                    <div className={styles.div2}>
                        <input type="search" placeholder="Search Movie..." className={styles.search} value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                        <button type="button" onClick={()=>setSelectedType("all")} className={styles.searchbtn}><i className="bi bi-search"></i></button>
                    </div>
                </div>
                <div className={styles.home2}>
                {isAdmin && (<div className={styles.home2child1}>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count1}>{totalShows}</h3>
                        <h3>Today's Total Show</h3>
                    </div>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count2}>{dashboard.totalOrders}</h3>
                        <h3>Total Orders</h3>
                    </div>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count3}>{dashboard.totalSeats}</h3>
                        <h3>Total Seats Booked</h3>
                    </div>
                    <div className={styles.mainDetails}>
                        <h3 className={styles.count4}>${Number(dashboard.totalRevenue).toLocaleString("en-IN")}</h3>
                        <h3>Total Revenue</h3>
                    </div>
                </div>)}
                <div className={styles.home2child2}>
                    <div className={styles.leftHome2}>
                        <div className={styles.child1}>
                            <div className={styles.chart}>
                              {loading ? (
                              Array.from({ length: lastCount }).map((_, index) => (
                                <div key={index} className={styles.barSkeleton}></div>
                              ))
                            ) : 
                                (screenMovies.map((show, index) => (
                                    <div key={index} className={styles.barRow} >
                                    <div
                                        className={styles.barFill}
                                        style={{ width: `${parseFloat(show.percent)}%` ,background:show.gradient,color:show.text ,borderRadius: "8px"}}
                                    >
                                    </div><span className={styles.Percentage} style={{ left: `${parseFloat(show.percent)+1}%` }}>{show.percent ? `${show.percent}%` : ""}</span>
                                    <span className={styles.tooltip}>{show.movie_name}</span>
                                    </div>
                                )))
                              }</div>
                            <div className={styles.chartList}>
                                <ul className={styles.movielist}>
                                  {loading ? (
                              Array.from({ length: lastCount }).map((_, index) => (
                                <div key={index} style={{width:"100px",height:"15px",marginBottom:"10px"}} className={styles.nameSkeleton}></div>
                              ))
                            ) :
                              (screenMovies.map((show, index) => (
                                    <li key={index}><h4 style={{fontWeight:"500",letterSpacing:"1px"}}>{show.movie_name}</h4></li>
                                    )))}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.child2}>
                           {loading ? (
                            <div className={styles.loadingWrapper}>
                                <div className={styles.SpinSkeleton}></div>
                            </div>
                            ):
                            (screenMovies.map((movie,index)=>(
                            <div className={styles.screenList} key={index} style={{animationDelay:`${index*0.3}s`}}>
                               <span><h4 className={styles.screenTitle} style={{fontWeight:"500",letterSpacing:"1px"}}>Screen {index+1}</h4></span>
                                <span>
                                        <p className={styles.movieName}>{movie.movie_name}</p>
                                        <button className={styles.bookBtn} onClick={()=>{
                                          if(isLogged)
                                           setSelectedMovie(movie);
                                          else
                                            alert("Please login to book tickets");
                                          }}>Booking</button>
                                </span>
                            </div>
                            )))}
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
                        {loading ? (
                            <>
                            {Array.from({length:lastCount}).map((_,index)=>(
                              <div key={index} className={`${styles.emptyList} ${loading?"":styles.fadeOut}`}>
                              </div>
                            ))}
                            </>
                        ) : filteredShows.length === 0 ? (
                            <p className={styles.notFound}>Movies Not Found!</p>
                        ) : (
                            filteredShows.map((s, index) => (
                            <div key={index} className={styles.lists} style={{ 
                             animationDelay: `${index * 0.3}s`}}>
                                <div className={styles.div1}>
                                <div className={styles.movieImage}><img src={s.img} alt="" /></div>
                                <div className={styles.Movies}>
                                    <h4 style={{fontWeight:"500",letterSpacing:"1px"}}>{s.movie_name}</h4>
                                    <h4 style={{fontWeight:"500"}}>{s.per_day}</h4>
                                </div>
                                </div>
                                <div className={styles.div2}>
                                {/* Screen types */}
                                <span className={styles.screen}>
                                    {s.screen.map((type, i) => <h5 key={i}>{type}</h5>)}
                                </span>

                                {/* Languages */}
                                <span className={styles.language}>
                                    {s.lang.map((l, i) => <h5 key={i}>{l}</h5>)}
                                </span>
                                </div>
                            </div>
                            ))
                        )}
                        </div>

                    </div>
                </div>
                {dateSelectorOpen && (
                  <PreviousDateSelector
                    onClose={() => {setDateSelectorOpen(false)
                      }
                    }/>)}
                </div>
                {selectedMovie && (
                   <DateBooking
                    selectedMovie={selectedMovie}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    setSelectedMovie={setSelectedMovie}
                    generateDates={generateDates}
                    generateShowSlots={generateShowSlots}
                    formatTime={formatTime}
                    isSlotAvailable={isSlotAvailable}
                    checkStatus={false} 
                    isAdmin={isAdmin}
                    />
                          )}
                
        </div>
    );

}
export default Home;

import { useContext, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MoviesContext } from "../context/MoviesContent";
import styles from "../styles/Movie.module.css";
import styles1 from "../styles/Home.module.css";
import DateBooking from "./DateBooking";


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

function Movie() {
  const { movies, loading,currentMovies } = useContext(MoviesContext); 
  const { scrolled } = useOutletContext();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);



  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm("");
  };

  const moviesWithStatus = movies.map((m) => {
    const isOngoing = currentMovies.some((cm) => cm.id === m.id); 
    return { ...m, status: isOngoing ? "OnGoing" : "UpComing" };
  });

  useEffect(() => {
    let temp = moviesWithStatus;

    if (searchTerm) {
      temp = temp.filter(m =>
        m.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setActiveCategory("All");
    } else if (activeCategory !== "All") {
      temp = temp.filter(m => m.industry === activeCategory);
    }

    setFilteredMovies(temp);
  }, [movies, activeCategory, searchTerm]);



  return (
    <div className={styles1.movieHome}>
        <div className={`${styles1.movieHome1} ${scrolled ? styles1.scrolled : ""}`}>
            <div className={styles1.div1}>
                    <nav className={styles1.top}>
                        <button className={`${styles1.date} ${
      activeCategory === "All" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("All")}>All</button>
                        <button className={`${styles1.date} ${
      activeCategory === "Hollywood" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("Hollywood")}>Hollywood</button>
                        <button className={`${styles1.date} ${
      activeCategory === "Kollywood" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("Kollywood")}>Kollywood</button>
                        <button className={`${styles1.date} ${
      activeCategory === "Bollywood" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("Bollywood")}>Bollywood</button>
                        <button className={`${styles1.date} ${
      activeCategory === "Tollywood" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("Tollywood")}>Tollywood</button>
                    </nav>
            </div>
            <div className={styles1.div2}>
                    <input type="search" placeholder="Search Movie..." className={styles1.search} value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button type="button" className={styles1.searchbtn}><i className="bi bi-search"></i></button>
            </div>
        </div>
        <div className={styles.movieHome2}>
  {loading ? (
    <>
    {Array.from({ length: filteredMovies.length }).map((_, index) => (
      <div key={index} className={`${styles.emptyBox} ${loading?"":styles.fadeOut}`}>
        
      </div>
    ))}
    </>
  ) : (
    filteredMovies.map((m,index) => (
      <div key={index} className={styles.moviesListBox} style={{animationDelay:`${index*0.2}s`}} onClick={()=>setSelectedMovie(m)}>
        <div className={styles.poster}>
          <img src={m.img} alt="" />
          <div
            className={styles.ribbon}
             style={{
                    backgroundColor: m.status === "OnGoing" ? "rgb(54, 202, 9)" : "rgb(243, 145, 8)",
                  }}
          >
            {m.status}
          </div>
          </div>
        <div className={styles.detail}>
          <span>
            <h4 style={{fontWeight:"500",letterSpacing:"1px"}}>{m.movie_name}</h4>
            <h4 style={{fontWeight:"400",letterSpacing:"1px"}}>{m.per_day}</h4>
          </span>
          <span>
            {m.screen.map((type, i) => (
              <h5 key={i}>{type}</h5>
            ))}
          </span>
        </div>
      </div>
    ))
  )}
</div>
   {selectedMovie && (
           <DateBooking selectedMovie={selectedMovie}
           selectedDate={selectedDate}
           setSelectedDate={setSelectedDate}
           selectedTime={selectedTime}
           setSelectedTime={setSelectedTime}
           setSelectedMovie={setSelectedMovie}
           generateDates={generateDates}
           generateShowSlots={generateShowSlots}
           formatTime={formatTime}
           isSlotAvailable={isSlotAvailable}
           checkStatus={true} 
           />
          )}

    </div>
  );
}

export default Movie;

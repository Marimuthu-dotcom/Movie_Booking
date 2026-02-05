import styles1 from "../styles/Home.module.css"
import styles from "../styles/Booking.module.css"
import { useState,useEffect } from "react"
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import axios from "axios";
function Booking(){
    const [isFav, setIsFav] = useState({});
    const [movies,setMovies]=useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [activeCategory, setActiveCategory] = useState("All");
    const {scrolled}=useOutletContext();
    const [loading, setLoading] = useState(true);
    const favCount = Object.values(isFav).filter(Boolean).length;
  const navigate = useNavigate();
  const handleBookNow = (movie) => {
  navigate(`seat/${encodeURIComponent(movie.movie_name)}`, {
    state: { movieData: movie } // pass full movie object
  });
};

  const handleCategoryClick = (category) => {
  setActiveCategory(category); // UI highlight
  setCategory(category);       // movies filter
  setSearchTerm("");           // (optional but recommended)
};

    useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/movies`)
    .then(res => {
      setMovies(res.data);
      setFilteredMovies(res.data);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);

   useEffect(() => {
  let temp = movies;

  if (searchTerm) {
    // If search box has value, ignore category and search across all movies
    temp = temp.filter((m) =>
      m.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setActiveCategory("All"); // no category highlight during search
  } else if (category !== "All") {
    // Only apply category filter if search box is empty
    temp = temp.filter((m) => m.industry === category);
  }

  setFilteredMovies(temp);
}, [searchTerm, category, movies]);

const toggleFav = async (movieName) => {
  const movie = movies.find((m) => m.movie_name === movieName);
  const alreadyFav = isFav[movieName];

  // UI change (touch panna koodaadhu – instant feel)
  setIsFav((prev) => ({
    ...prev,
    [movieName]: !prev[movieName],
  }));

  try {
    if (!alreadyFav) {
      // ➕ ADD to DB
      await axios.post(`${import.meta.env.VITE_API_URL}/api/favmovies`, {
        movie_name: movie.movie_name,
        img: movie.img,
      });
    } else {
      // ❌ REMOVE from DB
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/favmovies/${movie.movie_name}`
      );
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/favmovies`)
    .then((res) => {
      const favMap = {};
      res.data.forEach((m) => {
        favMap[m.movie_name] = true;
      });
      setIsFav(favMap);
    })
    .catch((err) => console.error(err));
}, []);




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
                </nav>
            </div>
            <div className={styles1.div2}>
                    <button className={styles.FavList} onClick={()=>navigate("/watchlist")}><i style={{fontSize:"24px",color:"rgb(158, 156, 156)"}} className="bi bi-plus-circle"></i>{favCount > 0 && <span className={styles.favCount}>{favCount}</span>}</button>
                    <input type="search" placeholder="Search Movie..." className={styles1.search} value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button type="button" className={styles1.searchbtn}><i className="bi bi-search"></i></button>
            </div>
        </div>
        <div className={styles.movieHome2}>
             <Outlet
                context={{
                filteredMovies,
                isFav,
                toggleFav,
                handleBookNow,
                 loading
                }}
            />
        </div>
    </div>
    );
}
export default Booking;

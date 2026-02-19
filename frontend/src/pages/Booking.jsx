import styles1 from "../styles/Home.module.css"
import styles from "../styles/Booking.module.css"
import { useState, useEffect, useContext } from "react"
import { useNavigate, Outlet ,useOutletContext} from "react-router-dom";
import axios from "axios";
import { MoviesContext } from "../context/MoviesContent";

function Booking() {
  const { movies, currentMovies,loading } = useContext(MoviesContext);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFav, setIsFav] = useState({});
  const { scrolled } = useOutletContext();
  const navigate = useNavigate();

  const favCount = Object.values(isFav).filter(Boolean).length;

  useEffect(() => {
    let temp = currentMovies;

    if (searchTerm) {
      temp = temp.filter((m) =>
        m.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setActiveCategory("All");
    } else if (category !== "All") {
      temp = temp.filter((m) => m.industry === category);
    }

    setFilteredMovies(temp);
  }, [searchTerm, category, movies]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setCategory(cat);
    setSearchTerm("");
  };

  const handleBookNow = (movie) => {
    navigate(`/booking/seat/${encodeURIComponent(movie.movie_name)}`, {
      state: { movieData: movie }
    });
  };

  const toggleFav = async (movieName) => {
    const movie = currentMovies.find((m) => m.movie_name === movieName);
    const alreadyFav = isFav[movieName];

    setIsFav(prev => ({ ...prev, [movieName]: !prev[movieName] }));

    try {
      if (!alreadyFav) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/favmovies`, {
          movie_name: movie.movie_name,
          img: movie.img
        });
      } else {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/favmovies/${movie.movie_name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/favmovies`)
      .then(res => {
        const favMap = {};
        res.data.forEach((m) => { favMap[m.movie_name] = true });
        setIsFav(favMap);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles1.movieHome}>
      <div className={`${styles1.movieHome1} ${scrolled ? styles1.scrolled : ""}`}>
        <div className={styles1.div1}>
          <nav className={styles1.top}>
            {["All", "Hollywood", "Kollywood", "Bollywood","Tollywood"].map((cat, i) => (
              <button
                key={i}
                className={`${styles1.date} ${activeCategory === cat ? styles1.activeNow : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
        <div className={styles1.div2}>
          <button className={styles.FavList} onClick={() => navigate("/watchlist")}>
            <i className="bi bi-plus-circle" style={{ fontSize: 24, color: "rgb(158,156,156)" }}></i>
            {favCount > 0 && <span className={styles.favCount}>{favCount}</span>}
          </button>
          <input
            type="search"
            placeholder="Search Movie..."
            className={styles1.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles1.searchbtn}><i className="bi bi-search"></i></button>
        </div>
      </div>
      <div className={styles.movieHome2}>
        <Outlet context={{ filteredMovies, isFav, toggleFav, handleBookNow, loading }} />
      </div>
    </div>
  );
}

export default Booking;

import styles from "../styles/Movie.module.css";
import styles1 from "../styles/Home.module.css";
import styles2 from "../styles/Watchlist.module.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { MoviesContext } from "../context/MoviesContent";

function Watchlist() {
  const { scrolled } = useOutletContext();
  const navigate = useNavigate();
  const { movies} = useContext(MoviesContext);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);

  // Fetch favorite movies from DB
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/favmovies`)
      .then(res => setWatchlist(res.data))
      .catch(err => console.error(err))
      .finally(()=>setLoading(false))
  }, []);

  // Open overlay with full movie details from context
  const handleBookNow = (movieName) => {
    const movie = movies.find(m => m.movie_name === movieName);
    if (!movie) return;
    setSelectedMovie(movie);
    setShowOverlay(true);
  };

  return (
    <div className={styles1.movieHome}>
      <div className={`${styles1.movieHome1} ${scrolled ? styles1.scrolled : ""}`}>
        <div className={styles2.div1}>
          <span className={styles2.watchlistTitle}>Add Watchlist</span>
        </div>

        <div className={styles2.div2}>
          <button
            className={styles2.searchbtn}
            onClick={() => navigate("/booking")}
          >
           <i className="bi bi-box-arrow-in-left"></i>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles2.movieHome2}>
          {loading ? (
             <div className={styles1.loadingWrapper}>
                 <div className={styles1.SpinSkeleton}></div>
             </div>
                              ) : watchlist.length === 0 ? (
            <h2 className={styles2.empty}>Your Watchlist is Empty!</h2>
          ) : (
            watchlist.map((m, i) => (
              <div key={i} className={`${styles.moviesListBox} ${styles2.moviesListBoxCustom}`} style={{animationDelay:`${i*0.2}s`}}>
                <div
                  className={styles.poster}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleBookNow(m.movie_name)}
                >
                  <img src={m.img} alt="" />
                </div>
                <div className={styles2.detail}>
                  <button
                    className={styles2.bookNowBtn}
                    onClick={async () => {
                      try {
                        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies`);
                        const allMovies = res.data;

                        const fullMovie = allMovies.find(movie => movie.movie_name === m.movie_name);
                        if (!fullMovie) return;

                        // Navigate with full movie object
                        navigate(`/booking/seat/${encodeURIComponent(fullMovie.movie_name)}`, {
                          state: { movieData: fullMovie }
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}

      </div>
    </div>
  );
}

export default Watchlist;



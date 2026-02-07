import styles from "../styles/Movie.module.css";
import styles1 from "../styles/Home.module.css";
import styles2 from "../styles/Watchlist.module.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { MoviesContext } from "../context/MoviesContent";

function Watchlist() {
  const { scrolled } = useOutletContext();
  const navigate = useNavigate();
  const { movies } = useContext(MoviesContext);

  const [watchlist, setWatchlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Fetch favorite movies from DB
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/favmovies`)
      .then(res => setWatchlist(res.data))
      .catch(err => console.error(err));
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
        {watchlist.length===0?
        (<h2 className={styles2.empty}>Your Watchlist is Empty!</h2>
       ) : 
      (watchlist.map((m,i)=>(
        <div key={i} className={`${styles.moviesListBox} ${styles2.moviesListBoxCustom}`}>
            <div className={styles.poster} role="button" tabIndex={0} onClick={()=>handleBookNow(m.movie_name)}><img src={m.img} alt="" /></div>
            <div className={styles2.detail}>
                   <button
  className={styles2.bookNowBtn}
  onClick={async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies`);
      const allMovies = res.data;

      const fullMovie = allMovies.find(movie => movie.movie_name === m.movie_name);
      if (!fullMovie) 
        return;

      // Navigate with full movie object
      navigate(`/booking/seat/${encodeURIComponent(fullMovie.movie_name)}`, {
        state: { movieData: fullMovie }
      });
    } catch (err) {
      console.error(err);
    }
  }}
>
  BookNow
</button>

            </div>
        </div>)))}
      </div>
      { showOverlay && selectedMovie && (
  <div className={styles2.overlay}>
    <div className={styles2.overlayContent}>
      <div className={styles2.movieImg}><img src={selectedMovie.img} alt="" /></div>
      <div className={styles2.movieReviews}>
        <div className={styles2.movieTitle}>
          <h2>{selectedMovie.movie_name}</h2>
          <button className={styles2.closeBtn} onClick={()=>setShowOverlay(false)}><i className="bi bi-x-octagon"></i></button>
        </div>
        <div className={styles2.moviePreviews}>
             <div className={styles2.story}>
              <h3 className={styles2.heads}>Story</h3>
              <p style={{lineHeight:"1.3"}}>{selectedMovie.story}</p>
              </div>
              <div className={styles2.story}>
                <h3 className={styles2.heads}>Genre</h3>
                <p>{selectedMovie.genre}</p>
              </div>
              <div className={styles2.story}>
                 <h3 className={styles2.heads}>Duration</h3>
                <p>{selectedMovie.duration}</p>
              </div>
             <div className={styles2.story}>
  <h3 className={styles2.heads}>Rating</h3>

  {/* Replace <p> */}
  <div style={{ display: 'flex', alignItems: 'center'}}>
    {[...Array(5)].map((_, i) => {
      const rating = selectedMovie.rating; // rating 0-10
      const fillPercentage = (rating / 10) * 100; // % for 5 stars

      // Each star = 20% => calculate if full, half, empty
      const starPercentage = Math.min(Math.max(fillPercentage - i*20, 0), 20);

      return (
        <div key={i} style={{ position: 'relative', width: '24px', height: '24px', marginRight: '4px' ,marginTop:'7px'}}>
          {/* Background Star - gray */}
          <FaStar style={{ color: 'gray', position: 'absolute', top:0, left:0 }} />
          {/* Filled Star - gold */}
          <FaStar style={{ 
            color: 'yellow', 
            position: 'absolute', 
            top:0, 
            left:0, 
            width: `${starPercentage*5}%`, // 20% = full star
            overflow: 'hidden', 
            clipPath: `inset(0 ${100-starPercentage*5}% 0 0)` 
          }} />
        </div>
      )
    })}
    <p style={{ marginLeft: 'auto', fontWeight: 'bold', color: 'white' }}>{selectedMovie.rating}</p>
  </div>
</div>
<div style={{display:"flex",
     flexDirection:"column",
     gap:"5px"
}}>
      <h3 className={styles2.heads}>Total Seats</h3>
      <p>{selectedMovie.total_seats}</p>
      <h3 className={styles2.heads}>Available Seats</h3>
      <p>{selectedMovie.remaining_seats}</p>
</div>
<div style={{marginTop:"5px"}}>
    <h3 style={{textAlign:"center"}}>This movie is saved in your Favourites, Seats are available - <span style={{color:"red"}}>book your tickets now!</span></h3>
</div>

        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Watchlist;



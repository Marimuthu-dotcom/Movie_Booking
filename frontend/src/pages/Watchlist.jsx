import styles from "../styles/Movie.module.css";
import styles1 from "../styles/Home.module.css";
import styles2 from "../styles/Watchlist.module.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Watchlist() {
  const { scrolled } = useOutletContext();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);


  useEffect(() => {
    axios.get("http://localhost:5000/api/favmovies")
      .then(res => setWatchlist(res.data))
      .catch(err => console.error(err));
  }, []);

 const handleBookNow = async (movieName) => {
  try {
    const res = await axios.get("http://localhost:5000/api/movies");
    const movies = res.data;
    const movie = movies.find((m) => m.movie_name === movieName);

    if (!movie) 
      return;
    setSelectedMovie(movie);
    setShowOverlay(true);

  } catch (err) {
    console.error(err);
  }
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
                   <button className={styles2.bookNowBtn}>BookNow</button>
            </div>
        </div>)))}
      </div>
      {showOverlay && selectedMovie && (
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
              <h3 style={{display:"block"}}>Story</h3>
              <p>{selectedMovie.story}</p>
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



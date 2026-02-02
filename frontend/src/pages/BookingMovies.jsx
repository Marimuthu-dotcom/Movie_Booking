import styles from "../styles/Booking.module.css";
import { useOutletContext } from "react-router-dom";


function BookingMovies() {
  const { filteredMovies, isFav, toggleFav, handleBookNow } =
    useOutletContext();


  return (
    <>
     <div className={styles.title}><h2>Movies of the Day</h2></div>
                 {filteredMovies.length>0?(
                 filteredMovies.map((m,index)=>(
                 <div key={index}className={styles.movieBox}>
                      <div className={styles.moviePoster}>
                         <img src={m.img} alt="" />
                         <div className={styles.category}>
                         <h4 className={styles.movieTitle}>{m.movie_name}</h4>
                         <h5 className={styles.based}>{m.based}</h5>
                         </div>
                      </div>
                      <div className={styles.description}>
                          <div className={styles.movieName}>
                             <h4>{m.movie_name}</h4>
                             <button
                             onClick={() =>
                                toggleFav(m.movie_name)
                             }
                             className={`${styles.fav} ${isFav[m.movie_name] ? styles.active : ""}`}
                             >
                             <i className={`bi ${isFav[m.movie_name] ? "bi-heart-fill" : "bi-heart"}`}></i>
                             </button>
     
                          </div>
                          <div className={styles.story}>
                              <h4>Description</h4>
                              <p>{m.movie_description}</p>
                          <span className={styles.movieType}>
                             <h4>Genre</h4>
                             <p>{m.genre}</p>
                          </span>
                          </div>
                          <div className={styles.bookShow}> 
                             <span className={styles.duration}>
                                 <h4>Duration</h4>
                                 <p style={{color: "rgb(237, 192, 31)", fontWeight: "600"}}>{m.duration}</p>
                             </span>
                             <span className={styles.price}>
                                 <h4>Ticket Price</h4>
                                 <p style={{color: "rgb(237, 192, 31)", fontWeight: "600"}}>$200</p>
                             </span>
                             <span className={styles.seatsInfo}>
                                 <span className={styles.total}>
                                     <h4>Total Seats</h4>
                                     <p style={{color: "rgb(237, 192, 31)", fontWeight: "600"}}>{m.total_seats}</p>
                                 </span>
                                 <span className={styles.remaining}>
                                     <h4>Available Seats</h4>
                                     <p style={{color: "rgb(237, 192, 31)", fontWeight: "600"}}>{m.remaining_seats}</p>
                                 </span>
                             </span>
                             <button type="button" onClick={() => handleBookNow(m)} className={styles.bookBtn}>Book Now!</button>
                          </div>
                      </div>
                 </div>))):(
                     <div className={styles.noResult}>
                     <h2 >No Movies Found!</h2>
                     </div>
                 )}
    </>
  );
}

export default BookingMovies;

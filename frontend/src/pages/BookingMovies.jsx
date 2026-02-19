import styles from "../styles/Booking.module.css";
import { useOutletContext } from "react-router-dom";
import DateBooking from "./DateBooking";
import { useState } from "react";

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

function BookingMovies() {
  const { filteredMovies, isFav, toggleFav,loading } =
    useOutletContext();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <>
     <div className={styles.title}><h2>Movies of the Day</h2></div>
                {loading ? (
                    <div className={styles.loadingWrapper}>
                       <div className={styles.SpinSkeleton}></div>
                    </div>
                    ) : (
                  filteredMovies.map((m, index) => (
                    <div key={index} className={styles.movieBox} style={{animationDelay:`${index*0.3}s`}}>
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
                            onClick={() => toggleFav(m.movie_name)}
                            className={`${styles.fav} ${isFav[m.movie_name] ? styles.active : ""}`}
                          >
                            <i className={`bi ${isFav[m.movie_name] ? "bi-heart-fill" : "bi-heart"}`}></i>
                          </button>
                        </div>
                        <div className={styles.story}>
                          <h4 style={{ color: "rgb(237, 192, 31)" }}>Description</h4>
                          <p>{m.movie_description}</p>
                          <span className={styles.movieType}>
                            <h4 style={{ color: "rgb(237, 192, 31)" }}>Genre</h4>
                            <p>{m.genre}</p>
                          </span>
                        </div>
                        <div className={styles.bookShow}>
                          <span className={styles.duration}>
                            <h4>Duration</h4>
                            <p style={{ color: "rgb(237, 192, 31)", fontWeight: "600" }}>{m.duration}</p>
                          </span>
                          <span className={styles.price}>
                            <h4>Ticket Price</h4>
                            <p style={{ color: "rgb(237, 192, 31)", fontWeight: "600" }}>$200</p>
                          </span>
                          <span className={styles.seatsInfo}>
                            <span className={styles.total}>
                              <h4>Total Seats</h4>
                              <p style={{ color: "rgb(237, 192, 31)", fontWeight: "600" }}>{m.total_seats}</p>
                            </span>
                            <span className={styles.remaining}>
                              <h4>Available Seats</h4>
                              <p style={{ color: "rgb(237, 192, 31)", fontWeight: "600" }}>{m.remaining_seats}</p>
                            </span>
                          </span>
                          <button type="button" onClick={() => setSelectedMovie(m)} className={styles.bookBtn}>Book Now!</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                           checkStatus={false} 
                           />
                )}

    </>
  );
}

export default BookingMovies;

import styles from "../styles/Movie.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DateBooking({selectedMovie,selectedDate,setSelectedDate,selectedTime,setSelectedTime,setSelectedMovie,generateDates,generateShowSlots,formatTime,isSlotAvailable,checkStatus}){

const navigate = useNavigate();
const[closing,setClosing]=useState(false);

const handleClose = () => {
  setClosing(true);
  setTimeout(() => {
    setSelectedMovie(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClosing(false);
    
  }, 300); 
};


return (
<div
    className={`${styles.overlay} ${closing? styles.fadeOut:""}`}
    onClick={() => setSelectedMovie(null)}
  >
    <div
      className={`${styles.bookingBox} ${closing? styles.slideOut:""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.bookingHeader}>
        <h2 className={styles.movieTitle}>
          {selectedMovie.movie_name}
        </h2>
        <button
          className={styles.closeBtn}
          onClick={handleClose}
        >
          ✕
        </button>
      </div>
      <div className={styles.section}>
        <h4 style={{fontFamily: "Roboto, serif"}}>Select Date</h4>
        <div className={styles.dateContainer}>
          {generateDates(
            selectedMovie.start_date,
            selectedMovie.end_date).map((date, i) => (
            <button
              key={i}
              onClick={() =>{ setSelectedDate(date.fullDate);
                setSelectedTime(null);
              }}
              className={`${styles.dateBox} ${
              selectedDate === date.fullDate? styles.activeDate : ""
              }`}
              style={{fontFamily: "Roboto, serif"}}
            >
              {date.displayDate}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
            <h4 style={{fontFamily: "Roboto, serif"}}>Select Show Time</h4>
            <div className={styles.timeContainer}>
              {!selectedDate && (
                <p style={{color:"gray",fontFamily: "Roboto, serif"}}>Please select date first</p>
              )}

             {selectedDate && selectedMovie.duration && generateShowSlots(selectedMovie).map((show, i) => {

                const available = isSlotAvailable(show, selectedDate);

                return (
                  <button
                    key={i}
                    disabled={!available}
                    className={`${styles.timeBox}`}
                    style={{
                      background: selectedTime===i ? "green" : "#333",
                      color:"#fff",
                      cursor: available ? "pointer" : "not-allowed",
                      opacity: available ? 1 : 0.5,fontFamily: "Roboto, serif"
                    }}
                    onClick={() => setSelectedTime(i)}
                  >
                    {formatTime(show.start)} - {formatTime(show.end)}
                  </button>
                );
              })}

            </div>
          </div>


                {/* Book Button */}
                <div className={styles.bottomSection}>
                  <button
                    className={styles.bookBtn}
                  onClick={() => {
                    if (checkStatus && selectedMovie.status !== "OnGoing") {
                      alert("Sorry, This movie is not available for booking yet!");
                      return;
                    }
                    if (!selectedDate || selectedTime === null)
                    {
                      alert("Please select date and show time");
                      return;
                    }
                    navigate(`/booking/seat/${encodeURIComponent(selectedMovie.movie_name)}`, {
                      state: {
                        movieData: selectedMovie,
                        selectedDate,
                        selectedTime
                      }
                    });
                  }}
                  >
                    Book Show
                  </button>
                </div>

              </div>
            </div>);

}
export default DateBooking;
import styles1 from "../styles/Home.module.css"
import styles2 from "../styles/TicketHistory.module.css"
import { useOutletContext } from "react-router-dom";
import { useContext } from "react";
import { MoviesContext } from "../context/MoviesContent";
import {useRef,useState} from "react";


function TicketHistory() {
  const {orders,currentMovies}=useContext(MoviesContext);
  const dateRef = useRef();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeMovie, setActiveMovie] = useState(null);

const filteredOrders = orders.filter((order) => {
  if (selectedDate && !activeMovie) {
    return new Date(order.date).toISOString().split("T")[0] === selectedDate;
  }
  if (!selectedDate && activeMovie) {
    return order.movie_name === activeMovie;
  }
  if (selectedDate && activeMovie) {
    return (
      new Date(order.date).toISOString().split("T")[0] === selectedDate &&
      order.movie_name === activeMovie
    );
  }
  return true;
});

    const {scrolled}=useOutletContext();
    
  return (
    <div className={styles1.movieHome}>
        <div className={`${styles2.movieHome1} ${scrolled ? styles1.scrolled : ""}`}>
            <div className={styles1.div1}>
                <nav className={styles2.top}>
                <button type="button" className={styles2.date}>Recent Orders</button>
                </nav>
            </div>
        </div>
        <div className={styles2.movieHome2}>
  <div className={styles2.historyCard}>

    <div className={styles2.historyHeader}>
      <div className={styles2.orderHead}><h2>Recent Orders</h2></div>
      <div className={styles2.filterDate}>
        <div className={styles2.filter} onClick={()=>setShowFilterPopup(true)}><span><i className="bi bi-filter"></i></span><span>{activeMovie ? activeMovie : "Filter"}</span></div>
       {showFilterPopup && (
  <div className={styles2.popupOverlay}>
    <div className={styles2.popupBox}>
      <div><h3>Select Movie</h3></div>

      <div className={styles2.movieList}>
        {currentMovies.map((movie, index) => (
          <button
            key={index}
            className={`${styles2.movieItem} ${
    activeMovie === movie.movie_name ? styles2.active : ""
  }`}
            onClick={() => {
              setActiveMovie(
    activeMovie === movie.movie_name ? null : movie.movie_name
  );
            }}
          >
            
          {movie.movie_name}
          </button>
        ))}
      </div>

      <div className={styles2.buttons}>
        <button className={styles2.cancel} style={{color:"white",backgroundColor:"red",fontFamily:"Roboto,serif",border:"none"}} onClick={() => {setShowFilterPopup(false)
setActiveMovie(null);
        }}>Close</button>
        <button className={styles2.submit} style={{color:"white",backgroundColor:"Green",fontFamily:"Roboto,serif",border:"none"}} onClick={() => setShowFilterPopup(false)}>Submit</button>
        </div>
    </div>
  </div>
)}
        <div className={styles2.date} onClick={() => dateRef.current.showPicker()}><span></span>{selectedDate ?selectedDate: "Select Date"}<span><i className="bi bi-calendar-check"></i></span></div>
     <input
      type="date"
      ref={dateRef}
      style={{ display: "none" }}
      onChange={(e) => {
        setSelectedDate(e.target.value);
      }}
    />
     </div>
    </div>

    <table className={styles2.historyTable}>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Movie</th>
          <th>Seats</th>
          <th>Date</th>
          <th>Show Time</th>
          <th>Payment</th>
          <th>Payment Mode</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
  {filteredOrders.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center", color: "#aaa" }}>
        No Orders Found
      </td>
    </tr>
  ) : (
    filteredOrders.map((order, index) => (
      <tr key={index}>
        <td>#{order.orderNo}</td>
        <td>{order.movie_name}</td>
        <td>{order.seats}</td>
        <td>{new Date(order.date).toISOString().split("T")[0]}</td>
        <td>{order.timing}</td>
        <td>${order.total_amount}</td>
        <td>{order.payment_mode}</td>
        <td>
          <button style={{padding:"0px 4px",borderRadius:"10px",border:"none"}}><i className="bi bi-eye-fill"></i></button>
        </td>
      </tr>
    ))
  )}
</tbody>

    </table>

  </div>
</div>

    </div>
  );
}

export default TicketHistory;

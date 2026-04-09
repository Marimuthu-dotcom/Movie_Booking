import styles1 from "../styles/Home.module.css"
import styles2 from "../styles/TicketHistory.module.css"
import { useOutletContext } from "react-router-dom";
import { useContext } from "react";
import { MoviesContext } from "../context/MoviesContent";
import {useRef,useState} from "react";


function TicketHistory() {
  const {orders}=useContext(MoviesContext);
  const dateRef = useRef();
  const [selectedDate, setSelectedDate] = useState(null);

const filteredOrders = selectedDate
  ? orders.filter((order) => {
      return order.date === selectedDate;
    })
  : orders;

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
        <div className={styles2.filter}><span><i className="bi bi-filter"></i></span><span>Filter</span></div>
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
        <td>{order.date}</td>
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

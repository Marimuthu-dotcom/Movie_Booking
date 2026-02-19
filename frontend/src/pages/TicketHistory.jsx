import styles1 from "../styles/Home.module.css"
import styles2 from "../styles/TicketHistory.module.css"
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

function TicketHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const storedOrders =
    JSON.parse(localStorage.getItem("ticketOrders")) || [];
  setOrders(storedOrders);
}, []);

  
  const date = new Date().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
    const {scrolled}=useOutletContext();
  return (
    <div className={styles1.movieHome}>
        <div className={`${styles2.movieHome1} ${scrolled ? styles1.scrolled : ""}`}>
            <div className={styles1.div1}>
                <nav className={styles2.top}>
                <button type="button" className={styles2.date}>Recent Orders</button>
                <button type="button" className={styles2.date}>View Previous Orders</button>
                </nav>
            </div>
        </div>
        <div className={styles2.movieHome2}>
  <div className={styles2.historyCard}>

    <div className={styles2.historyHeader}>
      <div className={styles2.orderHead}><h2>Recent Orders</h2></div>
      <div className={styles2.filterDate}>
        <div className={styles2.filter}><span><i className="bi bi-filter"></i></span><span>Filter</span></div>
        <div className={styles2.date}><span></span>{date}<span><i className="bi bi-calendar-check"></i></span></div>
     </div>
    </div>

    <table className={styles2.historyTable}>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Screen</th>
          <th>Seats</th>
          <th>Show Time</th>
          <th>Payment</th>
          <th>Payment Mode</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
  {orders.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center", color: "#aaa" }}>
        No Orders Found
      </td>
    </tr>
  ) : (
    orders.map((order, index) => (
      <tr key={index}>
        <td>#{order.orderId}</td>
        <td>{order.screen}</td>
        <td>{order.seats.join(", ")}</td>
        <td>{order.showTime}</td>
        <td>${order.amount}</td>
        <td>{order.paymentMode}</td>
        <td>
          <i className="bi bi-eye-fill"></i>
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

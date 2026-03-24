import styles from "../styles/SeatSelectionPage.module.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { RiArmchairFill } from "react-icons/ri";
import { MoviesContext } from "../context/MoviesContent";
import axios from "axios";

function SeatSelection() {
  const navigate = useNavigate();
  const { movieName } = useParams();
  const decodedMovieName = decodeURIComponent(movieName);
  const location = useLocation();
  
  const { movies } = useContext(MoviesContext);
  const [movieData, setMovieData] = useState(location.state?.movieData || null);
  const { selectedDate, selectedTime } = location.state;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const MAX_SELECTION = 10;
  const SEAT_PRICE = 200;
 const timing=`${selectedTime.start} - ${selectedTime.end}`;

  const totalPrice = selectedSeats.length * SEAT_PRICE;
  const discountRate = 0.05;
  const taxRate = 0.025;
  const discount = selectedSeats.length >= 8 ? totalPrice * discountRate : 0;
  const tax1 = totalPrice * taxRate;
  const tax2 = totalPrice * taxRate;
  const total = (totalPrice - discount) + tax1 + tax2;
  const [orderId, setOrderId] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const newId = Math.floor(100000 + Math.random() * 900000);
      setOrderId(newId);

      // 🔥 Wait until movies is loaded
      if (movies.length > 0) {
        const movie = movies.find(m => m.movie_name === decodedMovieName);

        if (movie) {
          setMovieData(movie);
        } else {
          setError(true);
        }
      }

      // Fetch booked seats
      if (selectedDate && selectedTime) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/booked-seats`,
          {
            params: {
              movie: decodedMovieName,
              date: selectedDate,
              showTime: `${selectedTime.start} - ${selectedTime.end}`
            }
          }
        );

        setBookedSeats(res.data.bookedSeats || []);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  fetchData();
}, [decodedMovieName, movies, selectedDate, selectedTime]);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) 
      return;
    if (selectedSeats.includes(seatId)) 
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    else if (selectedSeats.length < MAX_SELECTION) 
      setSelectedSeats([...selectedSeats, seatId]);
    else 
      alert("Maximum 10 seats only!");
  };
   const billDetails = [
    { label: "Subtotal", amount: totalPrice.toFixed(2) },
    { label: "Discount", amount: discount.toFixed(2) },
    { label: "Tax 1", amount: tax1.toFixed(2) },
    { label: "Tax 2", amount: tax2.toFixed(2) },
  ];
  const [payment, setPayment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const paymentOptions = ["Cash", "UPI", "Card"];
  const isValidNumber = customerNumber.length >= 10;
  const canProceed = customerName.trim() !== "" && isValidNumber && selectedSeats.length > 0 && payment !== "";

  const handleProceed = async() => {
    if (!canProceed) 
      return;

    const order = {
    orderId,
    movie: movieData.movie_name,
    date: selectedDate,
    showTime: timing,
    seats: selectedSeats,
    customerName:customerName,
    customerNumber:customerNumber,
    paymentMode: payment, 
    amount: total
  };

   try {
     const token = sessionStorage.getItem("token"); 
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/booking`, order, {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  });


    if (res.status === 200) {
      navigate("/history");
    } 
    else {
      alert("Booking failed. Please try again.");
    }
    alert(res.data.message);
  } 
  catch (err) {
    console.error("Full error:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);  // Backend error message
      console.error("Response status:", err.response.status); // HTTP status
      console.error("Response headers:", err.response.headers);
    } 
    else if (err.request) {
      console.error("Request sent but no response received", err.request);
    } 
    else {
      console.error("Error setting up request", err.message);
    }
    alert("Something went wrong while booking!");
  }
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "120px", color: "white" ,fontFamily:"Roboto,sans-serif"}}>Loading… please wait</h2>;
  if (error) return <h2 style={{ textAlign: "center", marginTop: "120px", color: "red" }}>Movie not found</h2>;

 
  return (
    <div className={styles.bookPage}>
      <div className={styles.seatInfo}>
        <div className={styles.movieDetails}>
          <div className={styles.firstDiv}>
            <h2 style={{fontWeight:"600"}}>
              <i
                className={`bi bi-arrow-left-short ${styles.backIcon}`}
                onClick={() => navigate("/booking")}
              ></i>
              Book a show
            </h2>
          </div>
          <div className={styles.secondDiv}>
            <div className={styles.movieImg}>
              <img src={movieData.img} alt="" />
            </div>
            <div className={styles.movieDescription}>
              <div className={styles.MovieName}>
                <h3 style={{ color: "rgb(237, 192, 31)" ,fontWeight:"800"}}>{movieData.movie_name}</h3>
                <p>Time: {timing}</p>
                <p style={{backgroundColor: "rgb(237, 192, 31)"}}>2D</p>
              </div>
              <div className={styles.story} style={{ color: "white" }}>{movieData.story}</div>
            </div>
          </div>
        </div>

  <div className={styles.seats}>
  <div className={styles.seatWrapper}>
    {[...Array(8)].map((_, rowIndex) => {
      const rowChar = String.fromCharCode(65 + rowIndex);

      return (
        <div
          key={rowChar}
          className={`${styles.row} ${
            rowIndex === 1 || rowIndex === 5 ? styles.rowGap : ""
          }`}
        >
          {/* Row Label */}
          <span className={styles.rowLabel}>{rowChar}</span>

          {/* Column 1 : 1–5 */}
          <div className={styles.column}>
            {[...Array(5)].map((_, i) => {
              const seatId = `${rowChar}${i + 1}`;
              return (
                <span
                  key={seatId}
                  title={seatId}
                  className={styles.seat}
                  onClick={() => toggleSeat(seatId)}>
                    <RiArmchairFill className={styles.seatIcon} style={{ color: bookedSeats.includes(seatId) ? "red" : selectedSeats.includes(seatId) ? "rgb(20, 208, 20)" : "" ,
                    cursor: bookedSeats.includes(seatId) ? "not-allowed" : selectedSeats.includes(seatId) ? "cursor" : ""}}/>
                  </span>
              );
            })}
          </div>

          {/* Column 2 : 6–25 */}
          <div className={`${styles.column} ${styles.middleColumn}`}>
            {[...Array(20)].map((_, i) => {
              const seatId = `${rowChar}${i + 6}`;
              return (
                <span
                  key={seatId}
                  title={seatId}
                  className={styles.seat}
                  onClick={() => toggleSeat(seatId)}>
                    <RiArmchairFill className={styles.seatIcon} style={{ color: bookedSeats.includes(seatId) ? "red" : selectedSeats.includes(seatId) ? "rgb(20, 208, 20)" : "" }}/>
                  </span>
              );
            })}
          </div>

          {/* Column 3 : 26–30 */}
          <div className={styles.column}>
            {[...Array(5)].map((_, i) => {
              const seatId = `${rowChar}${i + 26}`;
              return (
                <span
                  key={seatId}
                  title={seatId}
                  className={styles.seat}
                  onClick={() => toggleSeat(seatId)}>
                    <RiArmchairFill className={styles.seatIcon} style={{ color: bookedSeats.includes(seatId) ? "red" : selectedSeats.includes(seatId) ? "rgb(20, 208, 20)" : "" }}/>
                  </span>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>

  <div className={styles.screenContainer}>
  <div className={styles.curvedScreen}></div>
  <p className={styles.screenText}>SCREEN THIS SIDE</p>
</div>
<div className={styles.legend}>
  <div className={styles.legendItem}>
    <span className={`${styles.legendSeat} ${styles.available}`}></span>
    <p style={{fontWeight:"600",fontFamily:"Roboto, serif"}}>Available</p>
  </div>

  <div className={styles.legendItem}>
    <span className={`${styles.legendSeat} ${styles.selected}`}></span>
    <p style={{fontWeight:"600",fontFamily:"Roboto, serif"}}>Selected</p>
  </div>

  <div className={styles.legendItem}>
    <span className={`${styles.legendSeat} ${styles.booked}`}></span>
    <p style={{fontWeight:"600",fontFamily:"Roboto, serif"}}>Booked</p>
  </div>
</div>

</div>
</div>

      <div className={styles.paymentInfo}>
        <div className={styles.Div1}>
          <h3>Incomplete Order</h3>
          <p>In Progress</p>
        </div>
        <div className={styles.Div2}>
          <span className={styles.orderId}>
            Order Id <small>#{orderId}</small>
          </span>
          <span className={styles.selectedSeats}>
            <span className={styles.head}>
              <h3 style={{ fontSize: "0.950rem" }}>Selected Seats</h3>
            </span>
            <span className={styles.calculateAmount}>
              <p style={{color: "white"}}>Recliner</p>
              <p style={{ color: "rgb(237, 192, 31)" }}>{SEAT_PRICE}</p>
            </span>
            <span className={styles.allocatedSeat}>
              {selectedSeats.map((seat)=><p key={seat}>{seat}</p>)}
            </span>
          </span>
        </div>

        <div className={styles.Div3}>
          {billDetails.map((item, index) => (
            <div key={index} className={styles.cost}>
              <p style={{color: "white"}}>{item.label}</p>
              <p style={{color: "rgb(237, 192, 31)"}}>{item.amount}</p>
            </div>
          ))}
        </div>

        <div className={styles.Total}>
          <p>Grand Total</p>
          <p style={{color:"rgb(38, 215, 18)"}}>${total}</p>
        </div>

        <div className={styles.Div4}>
          <div className={styles.cashWay}>
            <div className={styles.head}>
              <h3>Payment</h3>
            </div>
            <div className={styles.cashMethod}>
              {paymentOptions.map((cash, item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="payment"
                    value={cash}
                    checked={payment === cash}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  {cash}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.customerDetail}>
            <h3>Customer Details</h3>
            <form className={styles.Form}>
              <input type="text" placeholder="Customer Name" value={customerName}
        onChange={(e) => setCustomerName(e.target.value)} required/>
              <input type="text" placeholder="Customer Number" value={customerNumber}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {  // numbers only
            setCustomerNumber(value);
          }
        }} required/>
              <div className={styles.buttonContainer}>
                <button type="button">Cancel</button>
                <button type="button" disabled={!canProceed} onClick={handleProceed}
  className={!canProceed ? styles.btnDisabled : styles.btnActive}>Proceed</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;

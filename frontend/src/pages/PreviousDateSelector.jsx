import { useState } from "react";
import styles from "../styles/PreviousDateSelector.module.css";

function PreviousDateSelector({ onClose }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const handleSubmit = () => {
  if (!day || !month || !year) {
    alert("Please fill all fields");
    return;
  }

  const d = Number(day);
  const m = Number(month);
  const y = Number(year);

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };
  if (m === 2) {
    if (isLeapYear(y)) {
      if (d > 29) {
        alert("February has only 29 days in leap year");
        return;
      }
    } else {
      if (d > 28) {
        alert("February has only 28 days");
        return;
      }
    }
  }

  if (d === 30 && m === 2) {
    alert("February doesn't have 30 days");
    return;
  }

  const valid31Months = [1, 3, 5, 7, 8, 10, 12];

  if (d === 31 && !valid31Months.includes(m)) {
    alert("This month doesn't have 31 days");
    return;
  }

  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  console.log("Selected Date:", formattedDate);
  if(formattedDate){
  alert(`Selected Date: ${formattedDate}`);
  handleClose();
  }
};

  const handleClose = () => {
  setIsClosing(true);  

  setTimeout(() => {
    onClose();         
  }, 300);
};
  return (
    <div className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""}`}>
      <div className={`${styles.DateContainer} ${isClosing ? styles.slideDown : styles.slideUp}`}>
        <h3 style={{fontFamily:"Roboto, serif",color:"orange"}}>Enter Date (<span style={{color:"white"}}>Admin</span>)</h3>
        <div className={styles.inputContainer}>
          <input
            type="number"
            placeholder="DD"
            value={day}
            onChange={(e) => {
                let value = e.target.value;

                if (value === "" || (value >= 1 && value <= 31)) {
                setDay(value.slice(0, 2));
                }
            }}
            className={styles.dateInput}
          />

          <input
            type="number"
            placeholder="MM"
            value={month}
            onChange={(e) => {
                let value = e.target.value;

                if (value === "" || (value >= 1 && value <= 12)) {
                setMonth(value.slice(0, 2));
                }
            }}
            className={styles.dateInput}
            
          />

          <input
            type="number"
            placeholder="YYYY"
            value={year}
            onChange={(e) => {
                let value = e.target.value;
                const currentYear = new Date().getFullYear();

                if (value === "" || value.length < 4) {
                    setYear(value);
                    return;
                }

                if (value >= 2000 && value <= currentYear) {
                setYear(value);
                }
            }}
            className={styles.dateInput}
            style={{ width: "40%"}}
          />

        </div>
       
       <div className={styles.buttonContainer}>
        <button
          onClick={handleSubmit}
          className={styles.submitBtn}
        >
          Submit
        </button>

        <button onClick={handleClose} style={{backgroundColor: "red",color:"white"}}>
          Close
        </button>
        </div>

      </div>
    </div>
  );
}

export default PreviousDateSelector;

import { useState } from "react";
import styles1 from "../styles/Movie.module.css"
import styles from "../styles/AddShows.module.css";
import axios from "axios";

function AddShows() {
  const initialState ={
    movie_index: "",
    movie_name: "",
    img: "",
    per_day: "",
    screen: [],
    lang: [],
    gradient: "",
    movie_type: [],
    industry: "",
    based: "",
    duration: "",
    durationHours:"",
    durationMinutes:"",
    total_seats: "",
    movie_description: "",
    genre: [],
    story: "",
    start_day: "",
    start_month: "",
    start_year: "",
    end_day: "",
    end_month: "",
    end_year: "",
    start_date: "",
    end_date: ""
  };

  const [movie,setMovie]=useState(initialState);
  const [imageFile,setImageFile]=useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMovie({
      ...movie,
      [name]: value
    });
  };

  const handleMultiSelect = (e) => {
  const { name, value, checked } = e.target;

  if (checked) {
    setMovie({
      ...movie,
      [name]: [...movie[name], value]
    });
  } else {
    setMovie({
      ...movie,
      [name]: movie[name].filter((item) => item !== value)
    });
  }
};

  const handleReset = () => {
  setMovie(initialState);
};
 

const isFormValid = () => {
  return (
    movie.movie_index &&
    movie.movie_name &&
    movie.img &&
    movie.per_day &&
    movie.screen.length > 0 &&
    movie.lang.length > 0 &&
    movie.movie_type.length > 0 &&
    movie.industry &&
    movie.based &&
    movie.durationHours &&
    movie.durationMinutes &&
    movie.total_seats &&
    movie.movie_description &&
    movie.genre.length > 0 &&
    movie.story &&
    movie.start_day &&
    movie.start_month &&
    movie.start_year &&
    movie.end_day &&
    movie.end_month &&
    movie.end_year
  );
};

const isValidDateFormat = (day, month, year) => {
  day = Number(day);
  month = Number(month);
  year = Number(year);

  if (month < 1 || month > 12) 
    return false;

  if (day < 1) 
    return false;

  const isLeap =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInMonth = {
    1: 31,
    2: isLeap ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
  };

  return day <= daysInMonth[month];
};
 
const isValidDates = () => {
  const {
    start_day, start_month, start_year,
    end_day, end_month, end_year
  } = movie;

  if(!isValidDateFormat(start_year,start_month,start_day)){
    alert("Invalid Start date Format");
    return false;
  }

  if(!isValidDateFormat(end_year,end_month,end_day)){
    alert("Invalid End date Format");
    return false;
  }

  const startDate = new Date(start_year, start_month - 1, start_day);
  const endDate = new Date(end_year, end_month - 1, end_day);

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  // conditions
  if (startDate < today) {
    alert("Start date must be today or future");
    return false;
  }

  if (endDate < today) {
    alert("End date must be today or future");
    return false;
  }

  if (endDate < startDate) {
    alert("End date must be greater than Start date");
    return false;
  }

  return true;
};

    const formatDate = (day, month, year) => {
      const d = String(day).padStart(2, "0");
      const m = String(month).padStart(2, "0");
      return `${year}-${m}-${d}`;
    };

    const uploadImage = async () => {
    const formData = new FormData(); 
    formData.append("image", imageFile);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/upload`,
      formData
    );

   return res.data.path;
};

  const handleSubmit =async (e) => {
    e.preventDefault();

    if (!isValidDates()) 
      return;

    const finalDuration = `${movie.durationHours}h ${movie.durationMinutes}m`;

    const start_date =formatDate(movie.start_day,movie.start_month,movie.start_year);
    const end_date = formatDate(movie.end_day,movie.end_month,movie.end_year);

    let imagePath = "";

    if (imageFile) {
      imagePath = await uploadImage();
    }

    const finalData = {
      movie_index: movie.movie_index,
      movie_name: movie.movie_name,
      img: imagePath,
      per_day: `${movie.per_day} shows per day`,
      screen: JSON.stringify(movie.screen),
      lang: JSON.stringify(movie.lang),
      movie_type: JSON.stringify(movie.movie_type),
      industry: movie.industry,
      based: movie.based,
      duration: finalDuration,
      total_seats: movie.total_seats,
      movie_description: movie.movie_description,
      story: movie.story,
      genre: movie.genre.join(","),
      start_date,
      end_date
    };

    try {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/add-movie`,
    finalData
  );

  if (res.status === 200) {
    alert("Movie added successfully");
  }
} catch (err) {
  console.error(err);
  alert("Error adding movie");
}


    console.log(finalData);
    console.log(movie.movie_type);
  };

  const industryOption=["Hollywood","Kollywood","Bollywood","Tollywood","Sandalwood","Mollywood"];
  const languageOption = ["English","Tamil","Telugu","Malayalam"];
  const screenTypes=["2D","3D","IMAX"];
  const movieTypes=["Action","Love","Thriller","Horror","Drama","Crime","Sci-Fi","Adventure","Fantasy"];

  return (
    <div className={styles1.movieHome}>
    <div style={{padding:"11px"}} className={styles1.movieHome1}>
    </div>
    <div className={styles.detailsContainer}>
    <div className={styles.mainContainer}>
    <div>
        <h2 style={{fontFamily:"Roboto, serif",color:"white",letterSpacing:"1px",fontSize:"25px",textTransform:"uppercase"}}>Add Movie</h2>
    </div>
    <div className={styles.formContainer}>
    <form onSubmit={handleSubmit} className={styles.Form}>
      <div className={styles.inputField}>
        <span className={styles.label}><label>Movie Number</label></span>
        <span className={styles.input}><input
          type="number"
          name="movie_index"
          value={movie.movie_index}
          onChange={handleChange}
          placeholder="Enter movie number"
          required
        /></span>
      </div>
      <div className={styles.inputField}>
        <span className={styles.label}><label>Movie Name</label></span>
        <span className={styles.input}>
          <input
          type="text"
          name="movie_name"
          value={movie.movie_name}
          onChange={handleChange}
          placeholder="Enter movie name"
          required
        /></span>
      </div>
      <div className={styles.inputField}>
      <span className={styles.label}>
      <label>Upload Image</label></span>
      <span className={styles.input}>
        <label><input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        required
      /></label></span>
      </div>
      <div className={styles.inputField}>
        <span className={styles.label}><label>Shows Per Day</label></span>
        <span className={styles.input}><input
          type="number"
          name="per_day"
          value={movie.per_day}
          onChange={handleChange}
          placeholder="Enter shows per day"
          required
        /></span>
      </div>
      <div className={styles.inputField}>
      <span className={styles.label}><label>Screen Type</label></span>
          <span className={styles.input}>
            {screenTypes.map((item)=>(
              <label key={item}>
            <input
            type="checkbox"
            name="screen"
            value={item}
            checked={movie.screen.includes(item)}
            onChange={handleMultiSelect}
          /> {item}
          </label>))}
          </span>
          </div>
          <div className={styles.inputField}>
      <span className={styles.label}><label>Language</label></span>
          <span className={styles.input}>
            {languageOption.map((item)=>(
            <label key={item}>
              <input
            type="checkbox"
            name="lang"
            value={item}
            checked={movie.lang.includes(item)}
            onChange={handleMultiSelect}
          /> {item}
          </label>
          ))}
          </span>
          </div>
          <div className={styles.inputField}>
            
         <span className={styles.label}>
          <label>Movie Category</label></span>
          <span className={styles.input}>
            <label ><input
            type="checkbox"
            name="movie_type"
            value="action"
            checked={movie.movie_type.includes("action")}
            onChange={handleMultiSelect}
          /> Action</label>

           <label><input
            type="checkbox"
            name="movie_type"
            value="love"
            checked={movie.movie_type.includes("love")}
            onChange={handleMultiSelect}
          /> Love</label>

           <label><input
            type="checkbox"
            name="movie_type"
            value="thriller"
            checked={movie.movie_type.includes("thriller")}
            onChange={handleMultiSelect}
          /> Thriller</label>

           <label><input
            type="checkbox"
            name="movie_type"
            value="horror"
            checked={movie.movie_type.includes("horror")}
            onChange={handleMultiSelect}
          /> Horror</label>

           <label><input
            type="checkbox"
            name="movie_type"
            value="drama"
            checked={movie.movie_type.includes("drama")}
            onChange={handleMultiSelect}
          /> Drama</label>

           <label><input
            type="checkbox"
            name="movie_type"
            value="adventure"
            checked={movie.movie_type.includes("adventure")}
            onChange={handleMultiSelect}
          /> Adventure</label>
          
           <label><input
            type="checkbox"
            name="movie_type"
            value="crime"
            checked={movie.movie_type.includes("crime")}
            onChange={handleMultiSelect}
          /> Crime</label>

           <label><input
            type="checkbox"
            name="movie_type"
            value="romance"
            checked={movie.movie_type.includes("romance")}
            onChange={handleMultiSelect}
          /> Romance</label>
          </span>
          </div>
          <div className={styles.inputField}>
          <span className={styles.label}>
            <label>Industry</label>
          </span>

          <span className={styles.input}>{industryOption.map((item)=>(
            <label key={item}><input
              type="radio"
              name="industry"
              value={item}
              checked={movie.industry === item}
              onChange={handleChange}
            /> {item}
            </label>
        ))}
          </span>
        </div>
        <div className={styles.inputField}>
          <span className={styles.label}>
            <label>Based On</label>
          </span>
          <span className={styles.input}>
            <textarea 
              name="based"
              value={movie.based}
              onChange={handleChange}
              placeholder="Enter source material (e.g., book, true story)"
              rows={4}
              required
            />
            </span>
          </div>
          <div className={styles.inputField}>
            <span className={styles.label}>
          <label>Duration</label></span>

          <span className={styles.input}><input
            type="number"
            name="durationHours"
            placeholder="Hours"
            min="0"
            max="5"
            onChange={(e) =>
              setMovie({
                ...movie,
                durationHours: e.target.value
              })
            }
            style={{ width: "100px",padding:"10px"}}
            required
          />

          <span style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px",fontFamily:"Roboto, serif",color:"#ccc"}}>hr</span>

          <input
            type="number"
            name="durationMinutes"
            placeholder="Minutes"
            min="0"
            max="59"
            onChange={(e) =>
              setMovie({
                ...movie,
                durationMinutes: e.target.value
              })
            }
            style={{ width: "100px",padding:"10px"}}
            required
          />

          <span style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px",fontFamily:"Roboto, serif",color:"#ccc"}}>min</span>

          </span>
        </div>
        <div className={styles.inputField}>
        <span className={styles.label}><label>No. of Seats</label></span>
        <span className={styles.input}><input
          type="number"
          name="total_seats"
          value={movie.total_seats}
          onChange={handleChange}
          placeholder="Enter total seats"
          required
        /></span>
      </div>
      <div className={styles.inputField}>
          <span className={styles.label}>
            <label>Movie Description</label>
          </span>
          <span className={styles.input}>
            <textarea 
              name="movie_description"
              value={movie.movie_description}
              onChange={handleChange}
              placeholder="Write movie description"
              rows={5}
              required
            />
            </span>
          </div>
      <div className={styles.inputField}>
      <span className={styles.label}><label>Movie Genre</label></span>
          <span className={styles.input}>
            {movieTypes.map((item)=>(
              <label key={item}>
            <input
            type="checkbox"
            name="genre"
            value={item}
            checked={movie.genre.includes(item)}
            onChange={handleMultiSelect}
          /> {item}
          </label>))}
          </span>
          </div>
          <div className={styles.inputField}>
          <span className={styles.label}>
            <label>Based On</label>
          </span>
          <span className={styles.input}>
            <textarea 
              name="story"
              value={movie.story}
              onChange={handleChange}
              placeholder="Write a Story about this movie (e.g., book, true story)"
              rows={6}
              required
            />
            </span>
          </div>
          <div className={styles.inputField}>
          <span className={styles.label}><label>Start Date:</label></span>

          <span className={styles.input}>
            <input
            type="number"
            placeholder="DD"
            min="1"
            max="31"
            onChange={(e) =>
              setMovie({
                ...movie,
                start_day: e.target.value
              })
            }
            style={{ width: "80px" ,padding:"10px"}}
            required
          />
          <span className={styles.label} style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px"}}></span>
          <input
            type="number"
            placeholder="MM"
            min="1"
            max="12"
            onChange={(e) =>
              setMovie({
                ...movie,
                start_month: e.target.value
              })
            }
            style={{ width: "80px" ,padding:"10px"}}
            required
          />
          <span className={styles.label} style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px"}}></span>
          <input
            type="number"
            placeholder="YYYY"
            min="2000"
            onChange={(e) =>
              setMovie({
                ...movie,
                start_year: e.target.value
              })
            }
            style={{ width: "100px" ,padding:"10px"}}
            required
          />
          <span className={styles.label} style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px"}}></span>
          </span>
        </div>
        <div className={styles.inputField}>
          <span className={styles.label}><label>End Date:</label></span>

          <span className={styles.input}>
            <input
            type="number"
            placeholder="DD"
            min="1"
            max="31"
            onChange={(e) =>
              setMovie({
                ...movie,
                end_day: e.target.value
              })
            }
            style={{ width: "80px" ,padding:"10px"}}
            required
          />
          <span className={styles.label} style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px"}}></span>
          <input
            type="number"
            placeholder="MM"
            min="1"
            max="12"
            onChange={(e) =>
              setMovie({
                ...movie,
                end_month: e.target.value
              })
            }
            style={{ width: "80px",padding:"10px" }}
            required
          />
          <span className={styles.label} style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px"}}></span>
          <input
            type="number"
            placeholder="YYYY"
            min="2000"
            onChange={(e) =>
              setMovie({
                ...movie,
                end_year: e.target.value
              })
            }
            style={{ width: "100px" ,padding:"10px"}}
            required
          />
          <span className={styles.label} style={{marginLeft:"4px",marginRight:"10px",fontWeight:"500",fontSize:"16px"}}></span>
          </span>
        </div>
        <div className={styles.buttons}>
          <button className={styles.btn} type="submit" disabled={!isFormValid()}>Submit</button>
          <button className={styles.btn} type="reset" onClick={handleReset}>Clear</button>
        </div>
    </form>
    </div>
    </div>
    </div>
    </div>
  );
}

export default AddShows;
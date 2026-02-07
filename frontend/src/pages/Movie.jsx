import { useContext, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MoviesContext } from "../context/MoviesContent";
import styles from "../styles/Movie.module.css";
import styles1 from "../styles/Home.module.css";

function Movie() {
  const { movies, loading } = useContext(MoviesContext); // ✅ use context
  const { scrolled } = useOutletContext();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm("");
  };

  useEffect(() => {
    let temp = movies;

    if (searchTerm) {
      temp = temp.filter(m =>
        m.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setActiveCategory("All");
    } else if (activeCategory !== "All") {
      temp = temp.filter(m => m.industry === activeCategory);
    }

    setFilteredMovies(temp);
  }, [movies, activeCategory, searchTerm]);
  return (
    <div className={styles1.movieHome}>
        <div className={`${styles1.movieHome1} ${scrolled ? styles1.scrolled : ""}`}>
            <div className={styles1.div1}>
                    <nav className={styles1.top}>
                        <button className={`${styles1.date} ${
      activeCategory === "All" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("All")}>All</button>
                        <button className={`${styles1.date} ${
      activeCategory === "Hollywood" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("Hollywood")}>Hollywood</button>
                        <button className={`${styles1.date} ${
      activeCategory === "Kollywood" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("Kollywood")}>Kollywood</button>
                        <button className={`${styles1.date} ${
      activeCategory === "Bollywood" ? styles1.activeNow : ""
    }`} onClick={()=>handleCategoryClick("Bollywood")}>Bollywood</button>
                    </nav>
            </div>
            <div className={styles1.div2}>
                    <input type="search" placeholder="Search Movie..." className={styles1.search} value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button type="button" className={styles1.searchbtn}><i className="bi bi-search"></i></button>
            </div>
        </div>
        <div className={styles.movieHome2}>
  {loading ? (
    <div className={styles.loading}>
      <h2 style={{ color: "white" ,fontFamily: "Roboto, serif"}}>Loading Movies…</h2>
    </div>
  ) : filteredMovies.length > 0 ? (
    filteredMovies.map((m,index) => (
      <div key={index} className={styles.moviesListBox}>
        <div className={styles.poster}><img src={m.img} alt="" /></div>
        <div className={styles.detail}>
          <span>
            <h4>{m.movie_name}</h4>
            <h4>{m.per_day}</h4>
          </span>
          <span>
            {m.screen.map((type, i) => (
              <h5 key={i}>{type}</h5>
            ))}
          </span>
        </div>
      </div>
    ))
  ) : (
    <div className={styles.noResult}>
      <h2>No Movies Found!</h2>
    </div>
  )}
</div>

    </div>
  );
}

export default Movie;

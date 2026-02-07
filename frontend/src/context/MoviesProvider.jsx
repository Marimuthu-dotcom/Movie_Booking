import { useState, useEffect } from "react";
import axios from "axios";
import { MoviesContext } from "./MoviesContent";

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/movies`)
      .then(res => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <MoviesContext.Provider value={{ movies, loading }}>
      {children}
    </MoviesContext.Provider>
  );
}



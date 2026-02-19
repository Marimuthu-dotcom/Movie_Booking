import { useState, useEffect } from "react";
import axios from "axios";
import { MoviesContext } from "./MoviesContent";

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);          // All Movies
  const [currentMovies, setCurrentMovies] = useState([]); // Running / Current Movies
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [allRes, currentRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/movies`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/current-movie`)
        ]);

        setMovies(allRes.data);
        setCurrentMovies(currentRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <MoviesContext.Provider value={{ movies, currentMovies, loading }}>
      {children}
    </MoviesContext.Provider>
  );
}

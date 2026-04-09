import { useState, useEffect } from "react";
import axios from "axios";
import { MoviesContext } from "./MoviesContent";

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);    
  const [currentMovies, setCurrentMovies] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [allRes, currentRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/movies`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/current-movie`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/auth/orders`)
        ]);

        setMovies(allRes.data);
        setCurrentMovies(currentRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <MoviesContext.Provider value={{ movies, currentMovies, loading ,orders ,setOrders}}>
      {children}
    </MoviesContext.Provider>
  );
}

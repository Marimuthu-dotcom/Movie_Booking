import {BrowserRouter,Routes,Route} from "react-router-dom";
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Movie from "./pages/Movie"
import Booking from "./pages/Booking";
import BookingMovies from "./pages/BookingMovies";
import SeatSelection from "./pages/SeatSelectionPage";
import TicketHistory from "./pages/TicketHistory";
import Watchlist from "./pages/Watchlist";
function App() {

  return (
    <BrowserRouter>
    <Routes>
         <Route path="/" element={<Layout />}>
         <Route index element={<Home />} />
         <Route path="movie" element={<Movie />} />
         <Route path="history" element={<TicketHistory />} />
         <Route path="booking" element={<Booking />} >
            <Route index element={<BookingMovies />} />  {/* default content for movieHome2 */}
            <Route path="seat/:movieName" element={<SeatSelection />} />
        </Route>
         <Route path="watchlist" element={<Watchlist />} />
         </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App;

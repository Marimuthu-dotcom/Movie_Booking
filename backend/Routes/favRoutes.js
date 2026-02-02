const express = require("express");
const router = express.Router();
const { addFav, getFavMovies ,removeFav} = require("../controller/FavController");

// POST favorite movie
router.post("/favmovies", addFav);
router.get("/favmovies", getFavMovies); 
router.delete("/favmovies/:movie_name", removeFav)

module.exports = router;

const express = require("express");
const router = express.Router();
const { getUsers, getCurrMovie } = require("../controller/MoviesController");

router.get("/movies", getUsers);
router.get("/current-movie",getCurrMovie);

module.exports = router;

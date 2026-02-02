const express = require("express");
const router = express.Router();
const { getUsers } = require("../controller/MoviesController");

router.get("/movies", getUsers);

module.exports = router;


const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const userRoutes = require("./Routes/moviesRoutes");
const favRoutes = require("./Routes/favRoutes");

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", favRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
})
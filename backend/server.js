const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const userRoutes = require("./Routes/moviesRoutes");
const favRoutes = require("./Routes/favRoutes");

app.use(cors({origin:"*"}));
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", favRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
const PORT =process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
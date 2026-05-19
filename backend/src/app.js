const express = require("express");
const cors = require("cors");

const gameRoutes = require("./routes/game.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Steam Games Backend API is running");
});

app.use("/api/v1/games", gameRoutes);

module.exports = app;
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    appid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    release_year: {
      type: String,
    },

    release_date: {
      type: String,
    },

    genres: {
      type: String,
    },

    categories: {
      type: String,
    },

    price: {
      type: String,
    },

    recommendations: {
      type: String,
    },

    developer: {
      type: String,
    },

    publisher: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
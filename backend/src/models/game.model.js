const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    appid: {
      type: String,
      required: [true, "App ID is required"],
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Game name is required"],
      trim: true,
      index: true
    },
    release_year: {
      type: String,
      trim: true
    },
    release_date: {
      type: String,
      trim: true
    },
    genres: {
      type: [String],
      default: [],
      index: true
    },
    categories: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0
    },
    recommendations: {
      type: Number,
      min: [0, "Recommendations cannot be negative"],
      default: 0
    },
    developer: {
      type: String,
      required: [true, "Developer is required"],
      trim: true,
      index: true
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
      trim: true
    },
    platforms: {
      type: [String],
      default: ["windows"]
    },
    description: {
      type: String,
      trim: true
    },
    header_image: {
      type: String,
      trim: true
    },
    is_free: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true // Timestamp tracking system (createdAt & updatedAt)
  }
);

// Search optimization indexing
gameSchema.index({ name: "text", developer: "text", publisher: "text", description: "text" });

module.exports = mongoose.model("Game", gameSchema);
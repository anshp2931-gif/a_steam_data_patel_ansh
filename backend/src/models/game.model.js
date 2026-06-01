const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
  },
  { timestamps: true }
);

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String }
});

const leaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  rank: { type: Number }
});

const historySchema = new mongoose.Schema({
  version: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  source: { type: String },
  date: { type: Date, default: Date.now }
});

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
    tags: {
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
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    recommendations: {
      type: Number,
      min: [0, "Recommendations cannot be negative"],
      default: 0
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
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
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    isEarlyAccess: {
      type: Boolean,
      default: false
    },
    isVrOnly: {
      type: Boolean,
      default: false
    },
    screenshots: {
      type: [String],
      default: []
    },
    trailers: [
      {
        name: { type: String },
        url: { type: String }
      }
    ],
    reviews: [reviewSchema],
    system_requirements: {
      minimum: { type: String, default: "OS: Windows 10, Processor: Intel Core i5, Memory: 8 GB RAM, Graphics: GTX 960" },
      recommended: { type: String, default: "OS: Windows 10/11, Processor: Intel Core i7, Memory: 16 GB RAM, Graphics: GTX 1060 / RTX 3060" }
    },
    dlc: {
      type: [String],
      default: []
    },
    achievements: [achievementSchema],
    leaderboards: [leaderboardSchema],
    history: [historySchema],
    news: [newsSchema]
  },
  {
    timestamps: true // Timestamp tracking system (createdAt & updatedAt)
  }
);

// Search optimization indexing
gameSchema.index({ name: "text", developer: "text", publisher: "text", description: "text" });

module.exports = mongoose.model("Game", gameSchema);
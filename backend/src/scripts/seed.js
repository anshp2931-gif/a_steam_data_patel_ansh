require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Game = require("../models/game.model");
const User = require("../models/user.model");
const connectDB = require("../config/db");

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("Clearing existing database collections...");
    await Game.deleteMany({});
    await User.deleteMany({});
    console.log("Database cleared successfully.");

    // Load games dataset
    const gamesDataPath = path.join(__dirname, "../data/steam_games.json");
    const games = JSON.parse(fs.readFileSync(gamesDataPath, "utf-8"));

    console.log(`Loading and seeding ${games.length} games into MongoDB...`);
    await Game.insertMany(games);
    console.log("Games seeded successfully.");

    console.log("Creating default administrator and standard user accounts...");

    // Create Admin User
    await User.create({
      username: "admin",
      email: "admin@steamgames.com",
      password: "adminpassword123", // Will be hashed automatically by user schema pre-save hook
      role: "admin"
    });

    // Create Standard User
    await User.create({
      username: "anshpatel",
      email: "ansh@steamgames.com",
      password: "userpassword123",
      role: "user"
    });

    console.log("Default users created successfully:");
    console.log("- Admin User: admin@steamgames.com / adminpassword123");
    console.log("- Standard User: ansh@steamgames.com / userpassword123");

    console.log("Database seeding completed successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Error during database seeding:", error.message);
    process.exit(1);
  }
};

seedDatabase();

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Game = require("../models/game.model");
const User = require("../models/user.model");
const connectDB = require("../config/db");

const backupDatabase = async () => {
  try {
    await connectDB();

    console.log("Starting data backup from MongoDB database...");

    const games = await Game.find({});
    const users = await User.find({}).select("-password"); // Exclude password hashes for security

    const backupDir = path.join(__dirname, "../../backups");

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const gamesBackupPath = path.join(backupDir, `games-backup-${timestamp}.json`);
    const usersBackupPath = path.join(backupDir, `users-backup-${timestamp}.json`);

    fs.writeFileSync(gamesBackupPath, JSON.stringify(games, null, 2), "utf-8");
    fs.writeFileSync(usersBackupPath, JSON.stringify(users, null, 2), "utf-8");

    console.log(`Backup completed successfully! 🎉`);
    console.log(`- Games backed up: ${games.length} to ${gamesBackupPath}`);
    console.log(`- Users backed up: ${users.length} to ${usersBackupPath}`);

    process.exit(0);
  } catch (error) {
    console.error("Database backup failed:", error.message);
    process.exit(1);
  }
};

backupDatabase();

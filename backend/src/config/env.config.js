const envConfig = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "superSecretJwtKeySteamBackend2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per window
  debugMode: process.env.DEBUG_MODE === "true" || process.env.NODE_ENV === "development",
};

module.exports = envConfig;

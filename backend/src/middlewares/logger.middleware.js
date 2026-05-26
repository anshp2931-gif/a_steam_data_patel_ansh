const envConfig = require("../config/env.config");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Once response finishes, calculate duration and print log
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logString = `[API Log] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (envConfig.debugMode) {
      // Detailed debug mode logs
      console.log(`${logString} | IP: ${req.ip} | User-Agent: ${req.get("user-agent")}`);
    } else {
      // Basic log for production/monitoring
      console.log(logString);
    }
  });

  next();
};

module.exports = requestLogger;

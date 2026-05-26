const ApiError = require("../utils/ApiError");
const envConfig = require("../config/env.config");

const ipRequestCounts = new Map();

/**
 * Basic Memory-Based Rate Limiting Middleware
 * Prevents API abuse and improves system security
 */
const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const currentTime = Date.now();

  const windowMs = envConfig.rateLimitWindowMs;
  const maxRequests = envConfig.rateLimitMax;

  if (!ipRequestCounts.has(ip)) {
    ipRequestCounts.set(ip, {
      count: 1,
      resetTime: currentTime + windowMs
    });
    return next();
  }

  const clientData = ipRequestCounts.get(ip);

  // If window duration expired, reset counter
  if (currentTime > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = currentTime + windowMs;
    ipRequestCounts.set(ip, clientData);
    return next();
  }

  // Increment request count
  clientData.count += 1;
  ipRequestCounts.set(ip, clientData);

  if (clientData.count > maxRequests) {
    const remainingTimeSeconds = Math.ceil((clientData.resetTime - currentTime) / 1000);
    return next(
      new ApiError(
        429,
        `Too many requests from this IP. Please try again after ${remainingTimeSeconds} seconds.`
      )
    );
  }

  next();
};

module.exports = rateLimiter;

const ApiError = require("../utils/ApiError");

/**
 * Role-Based Access Control Middleware
 * Restricts access to routes based on user role(s)
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required for this operation."));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

module.exports = { authorizeRoles };

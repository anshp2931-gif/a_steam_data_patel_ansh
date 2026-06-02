// Validate user registration input
const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ success: false, message: "Username must be at least 3 characters long." });
  }
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Please provide a valid email address." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
  }
  next();
};

// Validate user login input
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required to log in." });
  if (!password) return res.status(400).json({ success: false, message: "Password is required to log in." });
  next();
};

// Validate game input
const validateGameInput = (req, res, next) => {
  const { appid, name, price, developer, publisher } = req.body;

  if (req.method === "POST") {
    if (!appid || appid.trim() === "") return res.status(400).json({ success: false, message: "Game appid is required." });
    if (!name || name.trim() === "") return res.status(400).json({ success: false, message: "Game name is required." });
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) return res.status(400).json({ success: false, message: "A valid non-negative price is required." });
    if (!developer || developer.trim() === "") return res.status(400).json({ success: false, message: "Developer name is required." });
    if (!publisher || publisher.trim() === "") return res.status(400).json({ success: false, message: "Publisher name is required." });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      return res.status(400).json({ success: false, message: "Price must be a non-negative number." });
    }
  }
  next();
};

module.exports = { validateUserRegistration, validateUserLogin, validateGameInput };

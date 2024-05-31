const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from the Authorization header
    const decoded = jwt.verify(token, "ricorico"); // Verify the token using the secret key

    // Attach the decoded token to the request object
    req.user = decoded;

    next(); // Move to the next middleware
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to check if the user is a manager
const isManager = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from the Authorization header
    const decoded = jwt.verify(token, "ricorico"); // Verify the token using the secret key

    // Find the user in the database based on the decoded username
    const user = await User.findOne({ username: decoded.user });

    // Check if the user is a manager
    if (!user || !user.IsManager) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next(); // Move to the next middleware
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { isAuthenticated, isManager };

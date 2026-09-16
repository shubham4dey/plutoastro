// 
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader || req.header("Authorization");

    if (!token) {
      console.error("❌ AUTH: No token provided for", req.originalUrl);
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    // Extract token from "Bearer <token>" format
    const tokenString = token.replace("Bearer ", "");

    if (!tokenString || tokenString === "") {
      console.error("❌ AUTH: Empty token for", req.originalUrl);
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(
      tokenString,
      process.env.JWT_SECRET
    );

    req.admin = decoded;

    next();
  } catch (error) {
    console.error(
      `❌ AUTH ERROR (${req.originalUrl}):`,
      error.name,
      "-",
      error.message
    );
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = auth;
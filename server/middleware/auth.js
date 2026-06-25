// 
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    console.log("TOKEN =", token);
    console.log("JWT_SECRET =", process.env.JWT_SECRET);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    console.log("DECODED =", decoded);

    req.admin = decoded;

    next();
  } catch (error) {
    console.log("AUTH ERROR =", error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = auth;
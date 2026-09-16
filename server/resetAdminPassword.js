const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

const EMAIL = "admin@gmail.com";

// YAHAN APNA NAYA PASSWORD LIKHO
const NEW_PASSWORD = "Pluto@Admin2026!";

const resetPassword = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const admin = await Admin.findOne({ email: EMAIL });

    if (!admin) {
      console.log(`❌ Admin not found: ${EMAIL}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    admin.password = hashedPassword;

    await admin.save();

    console.log("=================================");
    console.log("✅ ADMIN PASSWORD RESET SUCCESS");
    console.log("=================================");
    console.log(`Email: ${admin.email}`);
    console.log("New password has been set.");
    console.log("=================================");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

resetPassword();
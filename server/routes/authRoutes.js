const express = require("express");

const router = express.Router();

const User = require("../models/User");

const Wallet = require("../models/Wallet");

/* ======================================

   SAVE USER FROM FIREBASE TO MONGODB

====================================== */

router.post("/save-user", async (req, res) => {

  try {

    const { uid, email, displayName, phone } = req.body;

    console.log("\n📥 ========== SAVE USER ==========");

    console.log("Email:", email);

    console.log("Firebase UID:", uid);

    console.log("Display Name:", displayName);

    if (!email || !uid) {

      return res.status(400).json({

        success: false,

        message: "Email and Firebase UID are required",

      });

    }

    // ✅ UPSERT: Email se dhundo → agar hai to UPDATE karo, nahi hai to CREATE karo

    // Ye duplicate users ko prevent karega aur purane user ka firebaseUid bhi update karega

    const user = await User.findOneAndUpdate(

      { email }, // Primary lookup by email

      {

        firebaseUid: uid,

        name: displayName || "User",

        email: email,

        phone: phone || "",

        password: "firebase-auth", // Placeholder - Firebase handles auth

        status: "active",

        role: "user",

      },

      {

        upsert: true,              // ✅ Agar user nahi hai to create karo

        new: true,                 // ✅ Updated document return karo

        setDefaultsOnInsert: true, // ✅ Default values set karo on create

        runValidators: true,       // ✅ Schema validators run karo

      }

    );

    console.log("✅ User saved/updated:", user._id);

    // ✅ Ensure wallet exists for this user

    let wallet = await Wallet.findOne({ userId: user._id });

    if (!wallet) {

      wallet = await Wallet.create({

        userId: user._id,

        balance: 0,

      });

      console.log("💰 New wallet created for user");

    } else {

      console.log("💰 Existing wallet found, balance:", wallet.balance);

    }

    console.log("=================================\n");

    res.json({

      success: true,

      message: "User saved successfully",

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        firebaseUid: user.firebaseUid,

      },

      wallet: {

        balance: wallet.balance,

      },

    });

  } catch (error) {

    console.error("❌ Error saving user:", error);

    console.log("=================================\n");

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

});

module.exports = router;

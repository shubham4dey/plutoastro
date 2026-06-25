const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true // Optional field - Firebase users ke liye
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  password: {
    type: String
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
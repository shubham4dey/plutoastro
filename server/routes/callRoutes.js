const express = require("express");
const router = express.Router();

const {
  startCall,
  acceptCall,
  endCall,
  getCallSession, // ✅ NEW
} = require("../controllers/callController");
 
router.post("/start", startCall);
router.post("/accept", acceptCall);
router.post("/end", endCall);
router.get("/session/:roomId", getCallSession);
 
module.exports = router;
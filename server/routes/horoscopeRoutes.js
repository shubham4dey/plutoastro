const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET Horoscope by zodiac sign
router.get("/:sign", async (req, res) => {
  try {
    const { sign } = req.params;
    
    console.log(` Generating horoscope for ${sign}...`);
    
    // Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate a detailed daily horoscope for ${sign} zodiac sign. Include:
    - Overall theme of the day
    - Career and work prospects
    - Love and relationships
    - Health and wellness
    - Lucky number, color, and time
    
    Keep it positive, inspiring, and around 150-200 words. Write in English.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const horoscopeText = response.text();
    
    console.log(`✅ Horoscope generated for ${sign}`);
    
    res.json({
      success: true,
      horoscope: horoscopeText
    });
    
  } catch (error) {
    console.error('❌ Horoscope Error:', error);
    
    // Fallback response
    const fallbackHoroscope = `Today's horoscope for ${req.params.sign}: Focus on your goals and stay positive. This is a good time for reflection and planning. Trust your instincts and embrace new opportunities. Lucky Color: Purple, Lucky Number: 7`;
    
    res.status(500).json({
      success: false,
      message: error.message,
      horoscope: fallbackHoroscope
    });
  }
});

module.exports = router;
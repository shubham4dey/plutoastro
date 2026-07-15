const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET Horoscope by zodiac sign (and optional period)
const handleHoroscope = async (req, res) => {
  try {
    let { sign, period } = req.params;
    
    // Default to 'daily' if no period is provided
    if (!period) period = 'daily';
    
    sign = sign.toLowerCase();
    period = period.toLowerCase();
    
    // Validate period to prevent invalid API calls
    const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validPeriods.includes(period)) {
      period = 'daily';
    }

    console.log(` Generating AI horoscope for ${sign} (${period}) using Gemini 3.5 Flash...`);

    // ✅ Gemini 3.5 Flash Model
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Create personalized prompt for Gemini
    const horoscopePrompt = `
You are an expert Vedic astrologer. Generate a detailed ${period} horoscope prediction for the zodiac sign "${sign}".

Provide the response in the following JSON format (no markdown, no extra text):
{
  "overall": "Detailed overall prediction for this period",
  "love": "Love and relationship prediction",
  "career": "Career and professional prediction",
  "health": "Health and wellness prediction",
  "lucky_number": 7,
  "lucky_color": "Purple",
  "lucky_time": "Evening",
  "lucky_stone": "Crystal",
  "compatibility": ["Leo", "Sagittarius", "Gemini"],
  "mood": "Positive and Energetic",
  "planetary": "Planetary movements and influences"
}

Make predictions specific to ${sign} sign and ${period} period. Be detailed, positive, and practical.
`;

    // Generate content using Gemini
    const result = await model.generateContent(horoscopePrompt);
    const responseText = result.response.text();
    
    // Parse JSON from Gemini response
    let apiData;
    try {
      // Clean up any markdown formatting
      const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      apiData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Invalid response format from Gemini");
    }

    // Map API response to the format your frontend expects
    const formattedData = {
      overall: apiData.overall || "Cosmic energies are aligning for you today.",
      love: apiData.love || "Focus on open communication and understanding.",
      career: apiData.career || "Stay focused on your professional goals.",
      health: apiData.health || "Maintain a balanced lifestyle with adequate rest.",
      lucky: {
        numbers: apiData.lucky_number ? [apiData.lucky_number] : [7],
        color: apiData.lucky_color || "Purple",
        time: apiData.lucky_time || "Evening",
        stone: apiData.lucky_stone || apiData.lucky_stone || "Crystal"
      },
      compatibility: apiData.compatibility || ["Leo", "Sagittarius", "Gemini"],
      mood: apiData.mood || "Positive and Energetic",
      planetary: apiData.planetary || "Planetary movements are aligning to support your endeavors."
    };

    console.log(`✅ AI horoscope generated for ${sign} using Gemini 3.5 Flash`);
    
    return res.json({
      success: true,
      source: "Gemini-3.5-Flash",
      data: formattedData
    });

  } catch (error) {
    console.error('❌ Horoscope Gemini Error:', error.message);
    
    // Safe fallback response that matches frontend structure (No UI break)
    const fallbackData = {
      overall: `Today's horoscope for ${req.params.sign}: Focus on your goals and stay positive. This is a good time for reflection and planning. Trust your instincts and embrace new opportunities.`,
      love: "Relationships are in a harmonious phase.",
      career: "Professional growth is on the horizon.",
      health: "Focus on maintaining a balanced lifestyle.",
      lucky: {
        numbers: [7],
        color: "Purple",
        time: "Evening",
        stone: "Crystal"
      },
      compatibility: ["Leo", "Sagittarius", "Gemini"],
      mood: "Positive",
      planetary: "Planetary movements are aligning to support your endeavors."
    };
    
    // Return 200 OK with fallback data so frontend doesn't show error screen
    res.status(200).json({
      success: true,
      source: "Fallback",
      data: fallbackData
    });
  }
};

// Express 5 compatible routes (No '?' allowed in path parameter)
router.get("/:sign/:period", handleHoroscope); // Handles: /aries/weekly
router.get("/:sign", handleHoroscope);         // Handles: /aries (defaults to daily)

module.exports = router;
import { createSlice } from "@reduxjs/toolkit";

// Load follow data from localStorage
const loadFollowFromStorage = () => {
  try {
    const storedFollow = localStorage.getItem("followedAstrologers");
    return storedFollow ? JSON.parse(storedFollow) : [];
  } catch (error) {
    console.error("Error loading follow data from localStorage:", error);
    return [];
  }
};

// Save follow data to localStorage
const saveFollowToStorage = (followList) => {
  try {
    localStorage.setItem("followedAstrologers", JSON.stringify(followList));
  } catch (error) {
    console.error("Error saving follow data to localStorage:", error);
  }
};

const followSlice = createSlice({
  name: "follow",
  initialState: {
    follow: loadFollowFromStorage(), // Load from localStorage on init
  },
  reducers: {
    addFollow: (state, action) => {
      const astrologer = action.payload;

      // Check if already followed (by _id)
      const exists = state.follow.find((a) => a._id === astrologer._id);

      if (!exists) {
        // Store complete astrologer data
        const newFollow = {
          _id: astrologer._id,
          name: astrologer.name || "Unknown",
          image: astrologer.image || "",
          skills: astrologer.skills || [],
          experience: astrologer.experience || 0,
          pricePerMinute: astrologer.pricePerMinute || 0,
          rating: astrologer.rating || 0,
          status: astrologer.status || "offline",
          languages: astrologer.languages || [],
          totalCallDurationInMin: astrologer.totalCallDurationInMin || 0,
          totalChatDurationInMin: astrologer.totalChatDurationInMin || 0,
          verified: astrologer.verified || false,
        };

        state.follow.push(newFollow);

        // Save to localStorage
        saveFollowToStorage(state.follow);
      }
    },
    clearFollow: (state) => {
      state.follow.length = 0;
      // Clear from localStorage
      localStorage.removeItem("followedAstrologers");
    },
    removeFollow: (state, action) => {
      // Fix: Compare by _id instead of object reference
      state.follow = state.follow.filter(
        (item) => item._id !== action.payload._id
      );

      // Save to localStorage
      saveFollowToStorage(state.follow);
    },
  },
});

export default followSlice.reducer;
export const { addFollow, clearFollow, removeFollow } = followSlice.actions;
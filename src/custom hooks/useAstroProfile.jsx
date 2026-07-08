import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAstroProfile } from "../store/AstroSlice";

const useAstroProfile = (id) => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://plutoastro-api.onrender.com/api/astrologers/${id}`
      );

      const json = await response.json();

      console.log("Profile API Response:", json); // Debug

      // Extract astrologer data from response
      if (json.success && json.astrologer) {
        dispatch(addAstroProfile(json.astrologer));
      } else if (json._id || json.name) {
        // Direct astrologer object
        dispatch(addAstroProfile(json));
      } else {
        console.error("Invalid response format:", json);
        dispatch(addAstroProfile(null));
      }
    } catch (error) {
      console.error("Error fetching astrologer profile:", error);
      dispatch(addAstroProfile(null));
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
};

export default useAstroProfile;
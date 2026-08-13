import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAstroProfile } from "../store/AstroSlice";

const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const useAstroProfile = (id) => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API}/api/astrologers/${id}`
      );

      const json = await response.json();

      console.log("Profile API Response:", json);

      if (json.success && json.astrologer) {
        dispatch(addAstroProfile(json.astrologer));
      } else if (json._id || json.name) {
        dispatch(addAstroProfile(json));
      } else {
        dispatch(addAstroProfile(null));
      }
    } catch (error) {
      console.error(error);
      dispatch(addAstroProfile(null));
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);
};

export default useAstroProfile;
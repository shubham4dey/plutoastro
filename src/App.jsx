import React, { useState, useEffect } from "react";
import Body from "./components/Body";
import PromotionalPopup from "./components/PromotionalPopup";

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenPromoPopup");
    
    // 2 second baad popup dikhao
    const timer = setTimeout(() => {
      if (!hasSeenPopup) {
        setShowPopup(true);
        localStorage.setItem("hasSeenPromoPopup", "true");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && <PromotionalPopup onClose={handleClosePopup} />}
      <Body />
    </>
  );
}

export default App;
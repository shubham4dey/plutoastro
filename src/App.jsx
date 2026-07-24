import React, { useState, useEffect } from "react";
import Body from "./components/Body";
import PromotionalPopup from "./components/PromotionalPopup";

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPromoPopup");
    
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
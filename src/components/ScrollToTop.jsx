import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Har route change par scroll ko top par le jao
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
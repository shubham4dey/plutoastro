import { useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
 
// Main Components
import Hero from "./Hero";
import Chat from "./Chat";
import Call from "./Call";
import AstroProfile from "./AstroProfile";
import Header from "./Header";
import Following from "./Following";
import Chatbot from "./Chatbot";
import AstroKundli from "./AstroKundli";
import LoginForm from "./LoginForm";
import Horoscope from "./Horoscope";
import FootIcons from "./FootIcons";
import AstrologersTalk from "./AstrologersTalk";
import AstrologersCallPage from "./AstrologersCallPage";
import About from "./About";
import Error from "./Error";
import Footer from "./Footer";
import TarotReading from "../pages/TarotReading";
 
// AI Pages
import AIAstro from "../pages/AIAstro";
import AIAstroProfile from "../pages/AIAstroProfile";
import AIChat from "../pages/AIChat";
 
// Admin Pages
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AstrologersAdmin from "../pages/AstrologersAdmin";
import AIAstrologersAdmin from "../pages/AIAstrologersAdmin";
import UsersAdmin from "../pages/UsersAdmin";
import OrdersAdmin from "../pages/OrdersAdmin";
import BecomeAstrologer from "../pages/BecomeAstrologer";
 
// ✅ NEW: Astrologer Applications Admin Page
import AstrologerApplications from "../pages/AstrologerApplications";
 
// ✅ NEW: Zodiac Page
import Zodiac from "../pages/Zodiac";
 
// ✅ NEW: Astrologer Login & Dashboard Pages
import AstrologerLogin from "../pages/AstrologerLogin";
import AstrologerDashboard from "../pages/AstrologerDashboard";
 
// ✅ NEW: Privacy Policy Page
import PrivacyPolicy from "../pages/PrivacyPolicy";
 
// ✅ NEW: ScrollToTop Component (Fixes page loading from bottom)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
 
const appLayout = createBrowserRouter([
  // =========================
  // ADMIN ROUTES (No Header/Footer)
  // =========================
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/astrologers",
    element: <AstrologersAdmin />,
  },
  {
    path: "/admin/ai-astrologers",
    element: <AIAstrologersAdmin />,
  },
  {
    path: "/admin/users",
    element: <UsersAdmin />,
  },
  {
    path: "/admin/orders",
    element: <OrdersAdmin />,
  },
  {
    path: "/admin/applications",
    element: <AstrologerApplications />,
  },
 
  // =========================
  // ✅ ASTROLOGER ROUTES (No Header/Footer - Standalone Pages)
  // =========================
  {
    path: "/astrologer-login",
    element: <AstrologerLogin />,
  },
  {
    path: "/astrologer-dashboard",
    element: <AstrologerDashboard />,
  },
 
  // =========================
  // MAIN WEBSITE (With Header & Footer)
  // =========================
  {
    path: "/",
    // ✅ FIXED LAYOUT: Flex column ensures Header top, Footer bottom always
    element: (
<div className="flex flex-col min-h-screen">
        {/* ✅ ScrollToTop added here to force page to top on every route change */}
<ScrollToTop />
<Header />
<FootIcons />
        {/* ✅ flex-grow pushes the footer to the bottom */}
<main className="flex-grow relative">
<Outlet />
</main>
<Footer />
</div>
    ),
    errorElement: <Error />,
    children: [
      { index: true, element: <Hero /> },
      { path: "chat", element: <Chat /> },
      { path: "call", element: <Call /> },
      { path: "ai-astro", element: <AIAstro /> },
      { path: "ai-astro/:id", element: <AIAstroProfile /> },
      { path: "ai-chat", element: <AIChat /> },
      { path: "ai-chat/:id", element: <AIChat /> },
      { path: "astroProfile/:id", element: <AstroProfile /> },
      { path: "following", element: <Following /> },
      { path: "chatbot", element: <Chatbot /> },
      { path: "kundligpt", element: <AstroKundli /> },
      { path: "horoscope/:type?/:sign?", element: <Horoscope /> },
      { path: "astrologerschat/:id", element: <AstrologersTalk /> },
      { path: "astrologerscall", element: <AstrologersCallPage /> },
      { path: "tarot", element: <TarotReading /> },
      { path: "zodiac", element: <Zodiac /> },
      { path: "login", element: <LoginForm /> },
      { path: "about", element: <About /> },
      { path: "become-astrologer", element: <BecomeAstrologer /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> }, // ✅ YE LINE ADD KI HAI
      { path: "error", element: <Error /> },
      { path: "*", element: <Error /> },
    ],
  },
]);
 
function Body() {
  return <RouterProvider router={appLayout} />;
}
 
export default Body;
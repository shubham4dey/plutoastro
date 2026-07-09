import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
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

const appLayout = createBrowserRouter([
  // =========================
  // ADMIN ROUTES
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

  // =========================
  // MAIN WEBSITE
  // =========================

  {
    path: "/",
    element: (
      <>
        <Header />
        <FootIcons />
        <Outlet />
        <Footer />
      </>
    ),

    errorElement: <Error />,

    children: [
      {
        index: true,
        element: <Hero />,
      },

      {
        path: "chat",
        element: <Chat />,
      },

      {
        path: "call",
        element: <Call />,
      },

      // =========================
      // AI ASTROLOGY
      // =========================

      {
        path: "ai-astro",
        element: <AIAstro />,
      },

      {
        path: "ai-astro/:id",
        element: <AIAstroProfile />,
      },

      {
        path: "ai-chat",
        element: <AIChat />,
      },

      {
        path: "ai-chat/:id",
        element: <AIChat />,
      },

      // =========================
      // NORMAL ASTROLOGY
      // =========================

      {
        path: "astroProfile/:id",
        element: <AstroProfile />,
      },

      {
        path: "following",
        element: <Following />,
      },

      {
        path: "chatbot",
        element: <Chatbot />,
      },

      {
        path: "kundligpt",
        element: <AstroKundli />,
      },

      // ✅ UPDATED HOROSCOPE ROUTE
      {
        path: "horoscope/:type?/:sign?",
        element: <Horoscope />,
      },

      {
        path: "astrologerschat/:id",
        element: <AstrologersTalk />,
      },

      {
        path: "astrologerscall",
        element: <AstrologersCallPage />,
      },

      {
        path: "tarot",
        element: <TarotReading />,
      },

      {
        path: "zodiac",
        element: <div>Zodiac Signs Page</div>,
      },

      {
        path: "login",
        element: <LoginForm />,
      },

      {
        path: "about",
        element: <About />,
      },
      {
        path: "become-astrologer",
        element: <BecomeAstrologer />,
      },

      {
        path: "error",
        element: <Error />,
      },

      // 404
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

function Body() {
  return (
    <RouterProvider
      router={appLayout}
    />
  );
}

export default Body;
import { useEffect } from "react";
 
import PaymentsAdmin from "../pages/PaymentsAdmin";
 
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
 
// NEW REAL CHAT

import LiveChat from "./LiveChat";

import AstrologerLiveChat from "./AstrologerLiveChat";
 
// NEW CALL PAGES

import UserCall from "../pages/UserCall";

import AstrologerCall from "../pages/AstrologerCall";
 
// ✅ NEW: WhatsApp-style Chat Inbox

import ChatInbox from "./ChatInbox";
 
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

import AstrologerApplications from "../pages/AstrologerApplications";
 
// Other Pages

import Zodiac from "../pages/Zodiac";

import AstrologerLogin from "../pages/AstrologerLogin";

import AstrologerDashboard from "../pages/AstrologerDashboard";

import PrivacyPolicy from "../pages/PrivacyPolicy";

import Wallet from "../pages/Wallet";
 
const ScrollToTop = () => {

  const { pathname } = useLocation();
 
  useEffect(() => {

    window.scrollTo(0, 0);

  }, [pathname]);
 
  return null;

};
 
const appLayout = createBrowserRouter([

  /* =========================

        ADMIN

  ========================= */
 
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

  {

    path: "/admin/payments",

    element: <PaymentsAdmin />,

  },
 
  /* =========================

      ASTROLOGER

  ========================= */
 
  {

    path: "/astrologer-login",

    element: <AstrologerLogin />,

  },

  {

    path: "/astrologer/dashboard",

    element: <AstrologerDashboard />,

  },

  {

    path: "/astrologer/livechat/:id",

    element: <AstrologerLiveChat />,

  },

  {

    path: "/astrologer/call/:id",

    element: <AstrologerCall />,

  },
 
  /* =========================

        WEBSITE

  ========================= */
 
  {

    path: "/",
 
    element: (
<div className="flex flex-col min-h-screen">
<ScrollToTop />
<Header />
<FootIcons />
<main className="flex-grow relative">
<Outlet />
</main>
<Footer />
</div>

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

        path: "wallet",

        element: <Wallet />,

      },

      {

        path: "call",

        element: <Call />,

      },

      {

        path: "call/:id",

        element: <UserCall />,

      },

      // ✅ NEW: WhatsApp-style Chat Inbox

      {

        path: "messages",

        element: <ChatInbox />,

      },
 
      /* =========================

            AI ASTRO

      ========================= */
 
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
 
      /* =========================

          ASTRO PROFILE

      ========================= */
 
      {

        path: "astroProfile/:id",

        element: <AstroProfile />,

      },
 
      /* =========================

          AI CHAT

      ========================= */
 
      {

        path: "astrologerschat/:id",

        element: <AstrologersTalk />,

      },
 
      /* =========================

          REAL CHAT

      ========================= */
 
      {

        path: "livechat/:id",

        element: <LiveChat />,

      },
 
      /* =========================

          OTHER PAGES

      ========================= */
 
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

      {

        path: "horoscope/:type?/:sign?",

        element: <Horoscope />,

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

        element: <Zodiac />,

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

        path: "privacy-policy",

        element: <PrivacyPolicy />,

      },

      {

        path: "error",

        element: <Error />,

      },

      {

        path: "*",

        element: <Error />,

      },

    ],

  },

]);
 
function Body() {

  return <RouterProvider router={appLayout} />;

}
 
export default Body;
 
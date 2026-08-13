import React from "react";
import {
  FaHome,
  FaUser,
  FaComments,
  FaPhoneAlt,
  FaWallet,
  FaChartLine,
  FaBell,
  FaCog,
  FaStar,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const menu = [
  { title: "Dashboard", icon: <FaHome /> },
  { title: "My Profile", icon: <FaUser /> },
  { title: "Availability", icon: <FaCalendarAlt /> },
  { title: "Chats", icon: <FaComments /> },
  { title: "Calls", icon: <FaPhoneAlt /> },
  { title: "Wallet", icon: <FaWallet /> },
  { title: "Reviews", icon: <FaStar /> },
  { title: "Analytics", icon: <FaChartLine /> },
  { title: "Notifications", icon: <FaBell /> },
  { title: "Settings", icon: <FaCog /> },
];

export default function AstrologerSidebar() {
  return (
    <div className="w-64 min-h-screen bg-[#12051d] border-r border-purple-700 text-white p-5">
      <h2 className="text-2xl font-bold text-purple-400 mb-10">
        PlutoAstro
      </h2>

      {menu.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-purple-700 transition mb-2"
        >
          {item.icon}
          <span>{item.title}</span>
        </div>
      ))}

      <div className="flex items-center gap-3 p-3 mt-10 cursor-pointer hover:bg-red-600 rounded-lg">
        <FaSignOutAlt />
        Logout
      </div>
    </div>
  );
}
import React from "react";
import { FaBell } from "react-icons/fa";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400">
          Manage your astrology business.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <FaBell className="text-white text-xl cursor-pointer" />

        <img
          src="https://i.pravatar.cc/50"
          alt=""
          className="rounded-full w-12 h-12"
        />
      </div>
    </div>
  );
}
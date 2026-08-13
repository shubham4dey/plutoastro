import React from "react";

export default function StatCard({
  title,
  value,
  icon,
  color = "from-purple-600 to-indigo-600",
}) {
  return (
    <div
      className={`bg-gradient-to-r ${color} rounded-xl p-5 text-white shadow-lg`}
    >
      <div className="text-3xl mb-3">{icon}</div>

      <h3 className="text-sm opacity-80">{title}</h3>

      <h1 className="text-3xl font-bold mt-2">{value}</h1>
    </div>
  );
}
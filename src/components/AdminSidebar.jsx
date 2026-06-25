import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] =
    useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      color:
        "from-blue-500 to-cyan-500",
    },
    {
      path: "/admin/astrologers",
      label: "Astrologers",
      icon: "ri-user-star-line",
      color:
        "from-purple-500 to-pink-500",
    },
    {
      path: "/admin/ai-astrologers",
      label: "AI Astrologers",
      icon: "ri-robot-2-line",
      color:
        "from-fuchsia-500 to-violet-500",
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: "ri-group-line",
      color:
        "from-green-500 to-emerald-500",
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon:
        "ri-shopping-bag-3-line",
      color:
        "from-yellow-500 to-orange-500",
    },
  ];

  const isActive = (path) =>
    location.pathname === path;

  return (
    <aside
      className={`
        min-h-screen
        bg-gradient-to-b
        from-purple-950
        via-indigo-950
        to-black
        border-r
        border-purple-700/30
        shadow-2xl
        flex
        flex-col
        transition-all
        duration-300
        ${
          collapsed
            ? "w-20"
            : "w-64"
        }
      `}
    >
      {/* Header */}
      <div className="p-5 border-b border-purple-700/30 flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3"
        >
          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-gradient-to-br
              from-purple-500
              to-pink-500
              flex
              items-center
              justify-center
              shadow-lg
            "
          >
            <i className="ri-planet-line text-2xl text-white"></i>
          </div>

          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-white">
                PlutoAstro
              </h2>

              <p className="text-xs text-purple-300">
                Admin Panel
              </p>
            </div>
          )}
        </Link>

        <button
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          className="text-purple-300 text-xl"
        >
          <i
            className={
              collapsed
                ? "ri-menu-unfold-line"
                : "ri-menu-fold-line"
            }
          ></i>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(
          (item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition-all
                duration-300
                ${
                  isActive(
                    item.path
                  )
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-purple-200 hover:bg-purple-800/50 hover:text-white"
                }
              `}
            >
              <div
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <i
                  className={`${item.icon} text-lg`}
                ></i>
              </div>

              {!collapsed && (
                <span className="font-medium">
                  {item.label}
                </span>
              )}

              {!collapsed &&
                isActive(
                  item.path
                ) && (
                  <i className="ri-arrow-right-s-line ml-auto text-lg"></i>
                )}
            </Link>
          )
        )}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="mx-4 mb-4 p-4 bg-purple-800/30 rounded-xl border border-purple-700/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-purple-300">
              System Status
            </span>

            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>

              <span className="text-xs text-green-400">
                Online
              </span>
            </div>
          </div>

          <p className="text-white text-sm font-semibold">
            PlutoAstro v1.0.0
          </p>
        </div>
      )}

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={logout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-gradient-to-r
            from-red-500
            to-pink-500
            hover:from-red-600
            hover:to-pink-600
            text-white
            font-semibold
            shadow-lg
            transition-all
            duration-300
          "
        >
          <i className="ri-logout-box-r-line text-lg"></i>

          {!collapsed && (
            <span>
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="pb-5 text-center">
          <p className="text-xs text-purple-400 opacity-60">
            © 2026 PlutoAstro
          </p>
        </div>
      )}
    </aside>
  );
}

export default AdminSidebar;
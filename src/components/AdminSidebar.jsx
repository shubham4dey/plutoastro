import React, { useState, useEffect } from "react";

import {

  Link,

  useLocation,

  useNavigate,

} from "react-router-dom";
 
function AdminSidebar() {

  const navigate = useNavigate();

  const location = useLocation();
 
  const [collapsed, setCollapsed] = useState(false);

  const [hoveredItem, setHoveredItem] = useState(null);
 
  const logout = () => {

    localStorage.removeItem("adminToken");

    navigate("/admin");

  };
 
  const menuItems = [

    {

      path: "/admin/dashboard",

      label: "Dashboard",

      icon: "ri-dashboard-line",

      color: "from-blue-500 to-cyan-500",

      glow: "shadow-blue-500/50",

    },

    {

      path: "/admin/astrologers",

      label: "Astrologers",

      icon: "ri-user-star-line",

      color: "from-purple-500 to-pink-500",

      glow: "shadow-purple-500/50",

    },

    {

      path: "/admin/applications",

      label: "Astrologer Requests",

      icon: "ri-user-add-line",

      color: "from-indigo-500 to-purple-500",

      glow: "shadow-indigo-500/50",

    },

    {

      path: "/admin/ai-astrologers",

      label: "AI Astrologers",

      icon: "ri-robot-2-line",

      color: "from-fuchsia-500 to-violet-500",

      glow: "shadow-fuchsia-500/50",

    },

    {

      path: "/admin/users",

      label: "Users",

      icon: "ri-group-line",

      color: "from-green-500 to-emerald-500",

      glow: "shadow-green-500/50",

    },

    {

      path: "/admin/orders",

      label: "Orders",

      icon: "ri-shopping-bag-3-line",

      color: "from-yellow-500 to-orange-500",

      glow: "shadow-orange-500/50",

    },

    // ✅ NEW: PAYMENTS LINK ADDED

    {

      path: "/admin/payments",

      label: "Payments",

      icon: "ri-wallet-3-line",

      color: "from-emerald-500 to-teal-500",

      glow: "shadow-emerald-500/50",

    },

  ];
 
  const isActive = (path) => location.pathname === path;
 
  const [particles, setParticles] = useState([]);
 
  useEffect(() => {

    const newParticles = Array.from({ length: 20 }, (_, i) => ({

      id: i,

      x: Math.random() * 100,

      y: Math.random() * 100,

      size: Math.random() * 3 + 1,

      duration: Math.random() * 20 + 10,

      delay: Math.random() * 5,

    }));

    setParticles(newParticles);

  }, []);
 
  return (
<aside

      className={`

        relative

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

        duration-500

        overflow-hidden

        ${collapsed ? "w-20" : "w-72"}

      `}
>

      {/* Animated Background */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">

        {particles.map((particle) => (
<div

            key={particle.id}

            className="absolute rounded-full bg-purple-400/20 animate-float-particle"

            style={{

              left: `${particle.x}%`,

              top: `${particle.y}%`,

              width: `${particle.size}px`,

              height: `${particle.size}px`,

              animationDuration: `${particle.duration}s`,

              animationDelay: `${particle.delay}s`,

            }}

          />

        ))}
</div>
 
      {/* Gradient Overlay */}
<div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-fuchsia-600/10 pointer-events-none" />
 
      {/* Header */}
<div className="relative p-6 border-b border-purple-700/30 flex items-center justify-between group">
<div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 
        <Link

          to="/admin/dashboard"

          className="relative flex items-center gap-4 z-10"
>
<div

            className={`

              relative

              w-14

              h-14

              rounded-2xl

              bg-gradient-to-br

              from-purple-500

              to-pink-500

              flex

              items-center

              justify-center

              shadow-lg

              shadow-purple-500/50

              transform

              transition-all

              duration-500

              hover:scale-110

              hover:rotate-12

              group-hover:shadow-purple-500/70

            `}
>
<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse-slow opacity-50" />
 
            <i className="ri-planet-line text-3xl text-white relative z-10"></i>
</div>
 
          {!collapsed && (
<div className="animate-slideIn">
<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">

                PlutoAstro
</h2>
<p className="text-xs text-purple-300/70 mt-1">

                Admin Panel
</p>
</div>

          )}
</Link>
 
        <button

          onClick={() => setCollapsed(!collapsed)}

          className="relative z-10 w-10 h-10 rounded-xl bg-purple-800/50 hover:bg-purple-700/50 flex items-center justify-center text-purple-300 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
>
<i

            className={`text-xl ${

              collapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"

            }`}
></i>
</button>
</div>
 
      {/* Menu */}
<nav className="relative flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">

        {menuItems.map((item, index) => (
<Link

            key={item.path}

            to={item.path}

            onMouseEnter={() => setHoveredItem(index)}

            onMouseLeave={() => setHoveredItem(null)}

            className={`

              relative

              flex

              items-center

              gap-4

              px-5

              py-4

              rounded-2xl

              transition-all

              duration-500

              overflow-hidden

              group

              ${

                isActive(item.path)

                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg ${item.glow} scale-105`

                  : "text-purple-200 hover:bg-purple-800/50 hover:text-white hover:scale-105"

              }

            `}

            style={{

              animation: `slideInLeft 0.5s ease-out ${index * 0.1}s both`,

            }}
>
<div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
 
            <div

              className={`

                relative

                w-11

                h-11

                rounded-xl

                flex

                items-center

                justify-center

                transition-all

                duration-500

                ${

                  isActive(item.path)

                    ? "bg-white/20 shadow-lg"

                    : "bg-purple-800/50 group-hover:bg-purple-700/50"

                }

              `}
>
<i className={`${item.icon} text-xl relative z-10`}></i>
 
              {isActive(item.path) && (
<div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} blur-lg opacity-50 animate-pulse`} />

              )}
</div>
 
            {!collapsed && (
<div className="flex-1 relative z-10">
<span className="font-semibold text-sm tracking-wide">

                  {item.label}
</span>
</div>

            )}
 
            {!collapsed && isActive(item.path) && (
<i className="ri-arrow-right-s-line text-xl animate-bounce"></i>

            )}
 
            {isActive(item.path) && (
<div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 rounded-l-2xl" />

            )}
</Link>

        ))}
</nav>
 
      {/* System Status */}

      {!collapsed && (
<div

          className="relative mx-4 mb-4 p-5 bg-purple-800/30 rounded-2xl border border-purple-700/30 overflow-hidden group hover:scale-105 transition-all duration-500"

          style={{ animation: "fadeInUp 0.6s ease-out 0.5s both" }}
>
<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 
          <div className="relative z-10">
<div className="flex justify-between items-center mb-3">
<span className="text-xs text-purple-300 font-medium">

                System Status
</span>
 
              <div className="flex items-center gap-2">
<div className="relative">
<div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
<div className="absolute inset-0 rounded-full bg-green-400 animate-ping" />
</div>
<span className="text-xs text-green-400 font-semibold">

                  Online
</span>
</div>
</div>
 
            <div className="flex items-center justify-between">
<p className="text-white text-sm font-bold">

                PlutoAstro v1.0.0
</p>
<i className="ri-shield-check-line text-green-400 text-lg"></i>
</div>
 
            <div className="mt-3 h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
<div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-progress" />
</div>
</div>
</div>

      )}
 
      {/* Logout */}
<div className="relative p-5">
<button

          onClick={logout}

          className="

            relative

            w-full

            flex

            items-center

            justify-center

            gap-3

            px-5

            py-4

            rounded-2xl

            bg-gradient-to-r

            from-red-500

            to-pink-500

            hover:from-red-600

            hover:to-pink-600

            text-white

            font-semibold

            shadow-lg

            shadow-red-500/30

            hover:shadow-red-500/50

            transition-all

            duration-500

            hover:scale-105

            hover:-translate-y-1

            group

            overflow-hidden

          "

          style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
>
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
 
          <i className="ri-logout-box-r-line text-xl relative z-10 group-hover:rotate-12 transition-transform duration-300"></i>
 
          {!collapsed && (
<span className="relative z-10">Logout</span>

          )}
</button>
</div>
 
      {!collapsed && (
<div className="relative pb-6 text-center">
<p className="text-xs text-purple-400/60">

            © 2026 PlutoAstro
</p>
<p className="text-xs text-purple-400/40 mt-1">

            All Rights Reserved
</p>
</div>

      )}
 
      <style>{`

        @keyframes float-particle {

          0%, 100% { transform: translateY(0) translateX(0); }

          25% { transform: translateY(-20px) translateX(10px); }

          50% { transform: translateY(-40px) translateX(-10px); }

          75% { transform: translateY(-20px) translateX(10px); }

        }

        .animate-float-particle { animation: float-particle linear infinite; }
 
        @keyframes slideInLeft {

          from { opacity: 0; transform: translateX(-30px); }

          to { opacity: 1; transform: translateX(0); }

        }
 
        @keyframes slideIn {

          from { opacity: 0; transform: translateX(-10px); }

          to { opacity: 1; transform: translateX(0); }

        }

        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
 
        @keyframes fadeInUp {

          from { opacity: 0; transform: translateY(20px); }

          to { opacity: 1; transform: translateY(0); }

        }
 
        @keyframes pulse-slow {

          0%, 100% { opacity: 0.5; transform: scale(1); }

          50% { opacity: 0.8; transform: scale(1.05); }

        }

        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
 
        @keyframes progress {

          from { width: 0%; }

          to { width: 75%; }

        }

        .animate-progress { animation: progress 2s ease-out forwards; }
 
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }

        .scrollbar-thin::-webkit-scrollbar-track {

          background: rgba(147, 51, 234, 0.1);

          border-radius: 10px;

        }

        .scrollbar-thin::-webkit-scrollbar-thumb {

          background: rgba(147, 51, 234, 0.5);

          border-radius: 10px;

        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {

          background: rgba(147, 51, 234, 0.7);

        }

      `}</style>
</aside>

  );

}
 
export default AdminSidebar;
 
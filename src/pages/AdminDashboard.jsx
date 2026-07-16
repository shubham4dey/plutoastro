import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAstrologers: 0,
    onlineAstrologers: 0,
    busyAstrologers: 0,
    offlineAstrologers: 0,
  });

  const [animatedStats, setAnimatedStats] = useState({
    totalAstrologers: 0,
    onlineAstrologers: 0,
    busyAstrologers: 0,
    offlineAstrologers: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        "https://plutoastro-backend.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setStats(data.stats);

        animateValue("totalAstrologers", data.stats.totalAstrologers);
        animateValue("onlineAstrologers", data.stats.onlineAstrologers);
        animateValue("busyAstrologers", data.stats.busyAstrologers);
        animateValue("offlineAstrologers", data.stats.offlineAstrologers);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    window.addEventListener("dashboardUpdate", fetchStats);

    const interval = setInterval(fetchStats, 30000);

    return () => {
      window.removeEventListener("dashboardUpdate", fetchStats);
      clearInterval(interval);
    };
  }, []);

  const animateValue = (key, end) => {
    let start = 0;

    const timer = setInterval(() => {
      start++;

      setAnimatedStats((prev) => ({
        ...prev,
        [key]: start,
      }));

      if (start >= end) {
        clearInterval(timer);
      }
    }, 20);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h1 className="loading-text">Loading Dashboard...</h1>
      </div>
    );
  }

  const chartData = [
    { name: "Online", value: stats.onlineAstrologers },
    { name: "Busy", value: stats.busyAstrologers },
    { name: "Offline", value: stats.offlineAstrologers },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="admin-layout">
      {/* ✅ VIDEO BACKGROUND - FULLY VISIBLE */}
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="video-element"
        >
          <source src="/hero-video-4.mp4" type="video/mp4" />
        </video>
        {/* Light overlay - video clearly dikhe */}
        <div className="video-overlay"></div>
      </div>

      {/* Animated Particles */}
      <div className="particles-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 15}s`,
              animationSize: `${Math.random() * 3 + 2}px`,
            }}
          />
        ))}
      </div>

      <AdminSidebar />

      <div className="admin-main">
        {/* Navbar */}
        <div className="admin-navbar">
          <div>
            <h1 className="dashboard-title">
              <span className="gradient-text">PlutoAstro</span> Dashboard
            </h1>
            <p className="welcome-text">Welcome Back Admin 👋</p>
          </div>

          <div className="navbar-right">
            <button
              className="action-btn secondary"
              onClick={fetchStats}
            >
              🔄 Refresh
            </button>

            <div className="admin-profile">
              <div className="profile-avatar">A</div>
              <span className="profile-name">Admin</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="admin-grid">
          <div className="admin-card card-total">
            <div className="card-glow"></div>
            <div className="card-icon">🔮</div>
            <h3>Total Astrologers</h3>
            <h1 className="stat-number">{animatedStats.totalAstrologers}</h1>
          </div>

          <div className="admin-card card-online">
            <div className="card-glow"></div>
            <div className="card-icon">🟢</div>
            <h3>Online</h3>
            <h1 className="stat-number">{animatedStats.onlineAstrologers}</h1>
          </div>

          <div className="admin-card card-busy">
            <div className="card-glow"></div>
            <div className="card-icon"></div>
            <h3>Busy</h3>
            <h1 className="stat-number">{animatedStats.busyAstrologers}</h1>
          </div>

          <div className="admin-card card-offline">
            <div className="card-glow"></div>
            <div className="card-icon">🔴</div>
            <h3>Offline</h3>
            <h1 className="stat-number">{animatedStats.offlineAstrologers}</h1>
          </div>
        </div>

        {/* Chart */}
        <div className="admin-section">
          <h2 className="section-title">Astrologers Status</h2>
          <div style={{ width: "100%", height: "350px" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={120}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(18, 18, 35, 0.95)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <button
              className="action-btn primary"
              onClick={() => navigate("/admin/astrologers")}
            >
              ➕ Add Astrologer
            </button>

            <button
              className="action-btn secondary"
              onClick={() => navigate("/")}
            >
              🌐 Website
            </button>

            <button
              className="action-btn secondary"
              onClick={() => localStorage.removeItem("adminToken")}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon online">●</div>
              <div className="activity-info">
                <p className="activity-text">
                  Total Astrologers: {stats.totalAstrologers}
                </p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon busy">●</div>
              <div className="activity-info">
                <p className="activity-text">
                  Busy Astrologers: {stats.busyAstrologers}
                </p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon total">●</div>
              <div className="activity-info">
                <p className="activity-text">
                  Online Astrologers: {stats.onlineAstrologers}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
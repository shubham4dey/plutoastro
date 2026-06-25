import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AIAstro() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [aiAstrologer, setAiAstrologer] = useState(null);

  useEffect(() => {
    fetchAIAstrologer();
  }, []);

  const fetchAIAstrologer = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ai-astrologers"
      );

      if (res.data && res.data.length > 0) {
        setAiAstrologer(res.data[0]);
      }
    } catch (error) {
      console.log("AI Astrologer Fetch Error:", error);
    }
  };

  const features = [
    {
      icon: "🔮",
      title: "Career Guidance",
      desc: "AI-based career guidance and predictions.",
    },
    {
      icon: "❤️",
      title: "Love & Relationships",
      desc: "Relationship and compatibility guidance.",
    },
    {
      icon: "📅",
      title: "Horoscope",
      desc: "Daily, weekly and monthly horoscope reports.",
    },
    {
      icon: "💎",
      title: "Remedies",
      desc: "Lucky colors, gemstones and remedies.",
    },
    {
      icon: "💼",
      title: "Finance",
      desc: "Money management and success guidance.",
    },
    {
      icon: "💍",
      title: "Marriage",
      desc: "Marriage compatibility and relationship insights.",
    },
  ];

  const handleStartChat = () => {
    if (!aiAstrologer?._id) {
      alert("AI Astrologer not found");
      return;
    }

    navigate(`/ai-chat/${aiAstrologer._id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#090015,#130024)",
        color: "#fff",
        paddingTop: "140px",
        paddingBottom: "80px",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          🤖 Pluto AI Astrology
        </h1>

        <p
          style={{
            fontSize: "22px",
            opacity: "0.9",
            marginBottom: "60px",
          }}
        >
          Your personal AI Astrologer available
          24×7 for guidance, predictions and remedies.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "25px",
          }}
        >
          {features.map((item) => (
            <div
              key={item.title}
              style={{
                background: "rgba(40,8,80,0.8)",
                padding: "35px 25px",
                borderRadius: "22px",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2
                style={{
                  fontSize: "32px",
                  marginBottom: "20px",
                }}
              >
                {item.icon}
              </h2>

              <h3
                style={{
                  marginBottom: "15px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  lineHeight: "1.7",
                  opacity: "0.9",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartChat}
          disabled={loading}
          style={{
            marginTop: "70px",
            background:
              "linear-gradient(90deg,#7c3aed,#a855f7)",
            color: "#fff",
            border: "none",
            padding: "18px 45px",
            borderRadius: "14px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow:
              "0px 10px 25px rgba(139,92,246,0.4)",
          }}
        >
          🚀 Start AI Chat
        </button>

        <p
          style={{
            marginTop: "25px",
            opacity: "0.8",
          }}
        >
          ⚡ Instant Answers • 🟢 Available 24×7 • 🔒 Private
        </p>
      </div>
    </div>
  );
}

export default AIAstro;
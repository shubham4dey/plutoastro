import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../image/bg1.jpg";
import {
  FaBriefcase,
  FaHeart,
  FaCalendarAlt,
  FaWallet,
  FaRing,
} from "react-icons/fa";
 
import { GiCrystalBall } from "react-icons/gi";
import { RiRobot2Line } from "react-icons/ri";
import { FaMagic } from "react-icons/fa";
 
function AIAstro() {
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(false);
  const [aiAstrologer, setAiAstrologer] = useState(null);
 
  useEffect(() => {
    fetchAIAstrologer();
  }, []);
 
  const fetchAIAstrologer = async () => {
    try {
      const res = await axios.get("https://https://plutoastro-production.up.railway.app/api/ai-astrologers");
 
      if (res.data && res.data.length > 0) {
        setAiAstrologer(res.data[0]);
      }
    } catch (error) {
      console.log("AI Astrologer Fetch Error:", error);
    }
  };
 
  const features = [
    {
      icon: <FaBriefcase size={36} className="text-purple-400" />,
      title: "Career Guidance",
      desc: "AI-based career guidance and predictions.",
    },
    {
      icon: <FaHeart size={36} className="text-pink-400" />,
      title: "Love & Relationships",
      desc: "Relationship and compatibility guidance.",
    },
    {
      icon: <FaCalendarAlt size={36} className="text-blue-400" />,
      title: "Horoscope",
      desc: "Daily, weekly and monthly horoscope reports.",
    },
    {
      icon: <GiCrystalBall size={38} className="text-violet-400" />,
      title: "Remedies",
      desc: "Lucky colors, gemstones and remedies.",
    },
    {
      icon: <FaWallet size={36} className="text-green-400" />,
      title: "Finance",
      desc: "Money management and success guidance.",
    },
    {
      icon: <FaRing size={36} className="text-yellow-400" />,
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
    <div className="relative w-full">
      <img
        src={bg}
        alt="bg"
        className="fixed top-0 left-0 w-full h-screen object-cover brightness-50 -z-40"
      />
 
      <div
        style={{
          minHeight: "100vh",
          color: "#fff",
          paddingTop: "140px",
          paddingBottom: "80px",
          paddingLeft: "20px",
          paddingRight: "20px",
          position: "relative",
          zIndex: 10,
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
              marginTop: "28px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <span
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#7c3aed,#c084fc)",
                boxShadow: "0 0 30px rgba(168,85,247,.55)",
              }}
            >
              <RiRobot2Line size={36} color="#fff" />
            </span>
 
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              Pluto AI Astrology
            </span>
          </h1>
 
          <p
            style={{
              fontSize: "22px",
              opacity: "0.9",
              marginBottom: "60px",
            }}
          >
            Your personal AI Astrologer available 24×7 for guidance, predictions
            and remedies.
          </p>
 
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
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
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    marginBottom: "22px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </div>
 
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
              background: "linear-gradient(90deg,#7c3aed,#a855f7)",
              color: "#fff",
              border: "none",
              padding: "18px 45px",
              borderRadius: "14px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0px 10px 25px rgba(139,92,246,0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaMagic size={20} />
            Start AI Chat
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
    </div>
  );
}
 
export default AIAstro;

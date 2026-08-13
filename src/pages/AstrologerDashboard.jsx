import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

import axios from "axios";

import AstrologerSidebar from "../components/astrologer/AstrologerSidebar";

import DashboardHeader from "../components/astrologer/DashboardHeader";

import StatCard from "../components/astrologer/StatCard";
 
import {

  FaWallet,

  FaComments,

  FaPhoneAlt,

  FaStar,

  FaRupeeSign,

  FaUsers,

} from "react-icons/fa";
 
const API = process.env.REACT_APP_API_URL || "https://plutoastro-backend.onrender.com";
 
// ✅ Socket for incoming calls

const socket = io(API, { transports: ["websocket"] });
 
export default function AstrologerDashboard() {

  const navigate = useNavigate();
 
  const [activeChats, setActiveChats] = useState([]);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
 
  // ✅ Incoming call state

  const [incomingCall, setIncomingCall] = useState(null);
 
  // ✅ NEW: Ringtone ke liye

  const ringtoneRef = useRef(null);
 
  const astrologerData = JSON.parse(

    localStorage.getItem("astrologerData") || "{}"

  );

  const astrologerId = astrologerData?._id;
 
  // ✅ Ringtone functions

  const startRingtone = () => {

    try {

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
 
      const ring = () => {

        const osc = ctx.createOscillator();

        const gain = ctx.createGain();

        osc.type = "sine";

        osc.frequency.setValueAtTime(941, ctx.currentTime);

        osc.frequency.setValueAtTime(1209, ctx.currentTime + 0.2);

        osc.connect(gain);

        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);

        osc.start();

        osc.stop(ctx.currentTime + 0.4);

      };
 
      ring();

      const int = setInterval(ring, 1200);

      ringtoneRef.current = { ctx, int };

    } catch (e) {

      console.error("Ringtone error:", e);

    }

  };
 
  const stopRingtone = () => {

    if (ringtoneRef.current) {

      clearInterval(ringtoneRef.current.int);

      ringtoneRef.current.ctx.close();

      ringtoneRef.current = null;

    }

  };
 
  // ✅ Real stats fetch karo

  useEffect(() => {

    if (!astrologerId) return;
 
    const loadStats = async () => {

      try {

        const res = await fetch(

          `${API}/api/chat-session/stats/${astrologerId}`

        );

        const data = await res.json();

        if (data.success) setStats(data.stats);

      } catch (err) {

        console.error("Stats load error:", err);

      }

    };
 
    loadStats();

  }, [astrologerId]);
 
  // ✅ Active chats fetch karo

  useEffect(() => {

    if (!astrologerId) return;
 
    const loadActiveChats = async () => {

      try {

        setLoading(true);

        const res = await fetch(

          `${API}/api/chat-session/astrologer/${astrologerId}`

        );

        const data = await res.json();
 
        if (data.success) {

          setActiveChats(data.sessions || []);

        }

      } catch (err) {

        console.error("Load active chats error:", err);

      } finally {

        setLoading(false);

      }

    };
 
    loadActiveChats();
 
    const interval = setInterval(loadActiveChats, 10000);

    return () => clearInterval(interval);

  }, [astrologerId]);
 
  // ✅ Incoming call listener (with ringtone)

  useEffect(() => {

    if (!astrologerId) return;
 
    socket.emit("join_astrologer_room", { astrologerId });
 
    const onIncoming = (data) => {

      console.log("📞 Incoming Call:", data);

      setIncomingCall(data);

      startRingtone(); // ✅ Ring bajao

    };
 
    socket.on("incoming_call", onIncoming);

    return () => {

      socket.off("incoming_call", onIncoming);

      stopRingtone(); // ✅ Cleanup

    };

  }, [astrologerId]);
 
  // ✅ Accept call

  const acceptCall = async () => {

    stopRingtone(); // ✅ Ring band karo

    const roomId = incomingCall.roomId;

    try {

      await axios.post(`${API}/api/call/accept`, { roomId });

    } catch (e) {

      console.error(e);

    }

    socket.emit("call_accepted", { roomId });

    setIncomingCall(null);

    navigate(`/astrologer/call/${roomId}`);

  };
 
  // ✅ Reject call

  const rejectCall = () => {

    stopRingtone(); // ✅ Ring band karo

    socket.emit("call_rejected", { roomId: incomingCall.roomId });

    setIncomingCall(null);

  };
 
  const handleOpenChat = (roomId) => {

    navigate(`/astrologer/livechat/${roomId}`);

  };
 
  return (
<div className="flex min-h-screen bg-[#080212]">
<AstrologerSidebar />
 
      <div className="flex-1 p-8 overflow-y-auto">
<DashboardHeader />
 
        {/* Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
<StatCard

            title="Today's Earnings"

            value={`₹${stats?.todayEarnings || 0}`}

            icon={<FaRupeeSign />}

            color="from-purple-600 to-pink-600"

          />
 
          <StatCard

            title="Total Earnings"

            value={`₹${stats?.totalEarnings || 0}`}

            icon={<FaWallet />}

            color="from-blue-600 to-cyan-600"

          />
 
          <StatCard

            title="Today's Chats"

            value={stats?.todayChats || 0}

            icon={<FaComments />}

            color="from-green-600 to-emerald-600"

          />
 
          <StatCard

            title="Total Chats"

            value={stats?.totalChats || 0}

            icon={<FaPhoneAlt />}

            color="from-orange-600 to-yellow-600"

          />
 
          <StatCard

            title="Rating"

            value="4.9 ⭐"

            icon={<FaStar />}

            color="from-pink-600 to-red-600"

          />
 
          <StatCard

            title="Total Customers"

            value={stats?.totalCustomers || 0}

            icon={<FaUsers />}

            color="from-indigo-600 to-violet-600"

          />
</div>
 
        {/* ✅ ACTIVE CHATS SECTION */}
<div className="mt-8 bg-[#14061f] rounded-xl p-6 border border-purple-700">
<div className="flex items-center justify-between mb-5">
<h2 className="text-white text-xl font-semibold flex items-center gap-2">

              💬 Active Chats

              {activeChats.length > 0 && (
<span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">

                  {activeChats.length}
</span>

              )}
</h2>
</div>
 
          {loading ? (
<div className="h-32 flex items-center justify-center text-gray-400">
<div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mr-3"></div>

              Loading chats...
</div>

          ) : activeChats.length === 0 ? (
<div className="h-32 flex items-center justify-center text-gray-500 text-center">
<div>
<div className="text-4xl mb-2">💤</div>
<p>No active chats right now</p>
<p className="text-xs mt-1">New chat requests will appear here</p>
</div>
</div>

          ) : (
<div className="space-y-3">

              {activeChats.map((chat) => (
<div

                  key={chat._id}

                  className="bg-[#1d0a2b] hover:bg-[#2a0f3a] p-4 rounded-lg transition-all border border-purple-800 hover:border-purple-500"
>
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">

                        {chat.userId?.name?.charAt(0)?.toUpperCase() || "U"}
</div>
 
                      <div>
<p className="text-white font-semibold">

                          {chat.userId?.name || "User"}
</p>
<p className="text-gray-400 text-xs">

                          {chat.userId?.email || ""}
</p>
<p className="text-purple-300 text-xs mt-0.5">

                          Started:{" "}

                          {new Date(chat.startedAt).toLocaleString("en-IN", {

                            hour: "2-digit",

                            minute: "2-digit",

                            day: "2-digit",

                            month: "short",

                          })}
</p>
</div>
</div>
 
                    <button

                      onClick={() => handleOpenChat(chat.roomId)}

                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2"
>
<FaComments className="text-xs" />

                      Open Chat
</button>
</div>
</div>

              ))}
</div>

          )}
</div>
 
        {/* Bottom Section */}
<div className="mt-8 grid lg:grid-cols-2 gap-6">
<div className="bg-[#14061f] rounded-xl p-6 border border-purple-700">
<h2 className="text-white text-xl font-semibold mb-4">

              Earnings Overview
</h2>
<div className="h-72 flex items-center justify-center text-gray-500">

              Chart Coming Soon...
</div>
</div>
 
          <div className="bg-[#14061f] rounded-xl p-6 border border-purple-700">
<h2 className="text-white text-xl font-semibold mb-4">

              Recent Activity
</h2>
<div className="space-y-4">
<div className="bg-[#1d0a2b] p-4 rounded-lg text-white">

                💬 New chat request received.
</div>
<div className="bg-[#1d0a2b] p-4 rounded-lg text-white">

                📞 Consultation completed.
</div>
<div className="bg-[#1d0a2b] p-4 rounded-lg text-white">

                💰 ₹850 credited to wallet.
</div>
<div className="bg-[#1d0a2b] p-4 rounded-lg text-white">

                ⭐ New 5-star review received.
</div>
</div>
</div>
</div>
</div>
 
      {/* ✅ INCOMING CALL POPUP */}

      {incomingCall && (
<div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
<div className="bg-[#14061f] border-2 border-purple-600 rounded-2xl p-8 text-center w-80 shadow-2xl shadow-purple-500/50">
<div className="text-5xl mb-4 animate-bounce">📞</div>
<h3 className="text-white text-xl font-bold">Incoming Call</h3>
<p className="text-gray-400 text-sm mt-1">

              User aapko call kar raha hai
</p>
<div className="flex justify-center gap-8 mt-6">
<button

                onClick={rejectCall}

                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-xl"
>

                ❌
</button>
<button

                onClick={acceptCall}

                className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-xl animate-pulse"
>

                ✅
</button>
</div>
</div>
</div>

      )}
</div>

  );

}
 
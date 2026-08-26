import './ChatInbox.css';
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import PreChatForm from "./PreChatForm";
import { rechargeWithRazorpay } from "../utils/razorpay";

const API = process.env.REACT_APP_API_URL || "https://plutoastro-backend.onrender.com";

const socket = io(API, { autoConnect: false, transports: ["websocket"] });

const ChatInbox = () => {
  const { id: initialRoomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);
  const userId = user?._id || localStorage.getItem("userId");

  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [endSummary, setEndSummary] = useState(null);

  // ✅ NEW: Recharge + Form + Waiting states
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(100);
  const [walletBalance, setWalletBalance] = useState(0);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [recharging, setRecharging] = useState(false);
  const [showPreChatForm, setShowPreChatForm] = useState(false);
  const [waitingTime, setWaitingTime] = useState(null);
  const [waitingAstrologer, setWaitingAstrologer] = useState("");
  const newRoomRef = useRef(null);

  // ✅ NEW: AI Onboarding States
  const [userInfo, setUserInfo] = useState({ name: "", dob: "", birthPlace: "" });
  const [onboardingStep, setOnboardingStep] = useState(0); // 0: none, 1: asked name, 2: asked dob, 3: asked place, 4: complete

  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const loadSessions = async () => {
    if (!user?.email) return [];
    try {
      const res = await axios.get(`${API}/api/chat-session/user-sessions/${user.email}`);
      if (res.data.success) {
        setSessions(res.data.sessions);
        return res.data.sessions;
      }
      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  useEffect(() => {
    socket.connect();
    (async () => {
      const list = await loadSessions();
      if (initialRoomId) {
        const s = list.find((x) => x.roomId === initialRoomId);
        if (s) setSelected(s);
      }
    })();
    // eslint-disable-next-line
  }, [user, initialRoomId]);

  useEffect(() => {
    if (!selected?.roomId) return;
    const roomId = selected.roomId;

    socket.emit("join_chat", { roomId });
    setChatEnded(selected.status === "ended");
    setEndSummary(null);
    setMessages([]);
    
    // ✅ Reset onboarding state when switching chats
    setOnboardingStep(0);
    setUserInfo({ name: "", dob: "", birthPlace: "" });

    axios
      .get(`${API}/api/chat/history/${roomId}`)
      .then((res) => {
        if (res.data.success) {
          const fetchedMessages = res.data.messages || [];
          setMessages(fetchedMessages);

          // ✅ NEW: If it's a fresh chat, trigger the beautiful intro
          if (fetchedMessages.length === 0 && selected.status === "active") {
            setTimeout(() => {
              const introMsg = {
                _id: "intro-init",
                senderType: "astrologer",
                text: `Namaste! Main hoon ${selected.astrologerId?.name || 'Astro Kiara'}, aapki personal Vedic astrologer.\n\nAapki accurate predictions ke liye, mujhe kuch basic details chahiye.\n\nSabse pehle, aapka pura naam kya hai?`,
                createdAt: new Date().toISOString(),
              };
              setMessages([introMsg]);
              setOnboardingStep(1);
            }, 500);
          }
        }
      })
      .catch(() => {});

    const onReceive = (msg) => {
      if (msg.roomId !== roomId) return;
      setTyping(false);
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      if (msg.senderType?.toLowerCase() === "astrologer") {
        socket.emit("seen", { roomId, userId });
      }
    };
    const onTyping = (d) => d.roomId === roomId && setTyping(true);
    const onStopTyping = () => setTyping(false);
    const onChatEnded = (d) => {
      if (d.roomId === roomId) {
        setChatEnded(true);
        if (d?.session) setEndSummary(d.session);
        setSelected((prev) => (prev ? { ...prev, status: "ended" } : prev));
        loadSessions();
      }
    };

    socket.on("receive_message", onReceive);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);
    socket.on("chat_ended", onChatEnded);

    return () => {
      socket.off("receive_message", onReceive);
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
      socket.off("chat_ended", onChatEnded);
    };
    // eslint-disable-next-line
  }, [selected?.roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ✅ UPDATED: Smart sendMessage with Onboarding + AI API Integration
  const sendMessage = async () => {
    if (!message.trim() || chatEnded) return;
    const currentMsg = message.trim();
    setMessage("");

    // 1. Add user message to UI immediately
    const tempUserMsg = {
      _id: `temp-user-${Date.now()}`,
      senderType: "user",
      text: currentMsg,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    // 2. Handle Onboarding locally for instant, smooth UX
    if (onboardingStep > 0 && onboardingStep < 4) {
      let nextStep = onboardingStep;
      let botReply = "";
      const updatedUserInfo = { ...userInfo };

      if (onboardingStep === 1) {
        updatedUserInfo.name = currentMsg;
        nextStep = 2;
        botReply = `Shukriya ${currentMsg}! \n\nAapki date of birth kya hai? (DD-MM-YYYY format mein)`;
      } else if (onboardingStep === 2) {
        updatedUserInfo.dob = currentMsg;
        nextStep = 3;
        botReply = `Perfect! \n\nAur aapka birth place (city) kya hai?`;
      } else if (onboardingStep === 3) {
        updatedUserInfo.birthPlace = currentMsg;
        nextStep = 4;
        botReply = `Bahut badhiya ${updatedUserInfo.name}! \n\nMaine aapki details note kar li hain:\n- Naam: ${updatedUserInfo.name}\n- DOB: ${updatedUserInfo.dob}\n- Birth Place: ${updatedUserInfo.birthPlace}\n\nAb aap mujhse kuch bhi puch sakte hain - career, love, health, ya koi bhi astrological question.\n\nBataiye, aaj main aapki kaise madad kar sakti hoon?`;
      }

      setUserInfo(updatedUserInfo);
      setOnboardingStep(nextStep);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            _id: `temp-bot-${Date.now()}`,
            senderType: "astrologer",
            text: botReply,
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 600);

      // Still save user's onboarding answer to socket history
      socket.emit("send_message", {
        roomId: selected.roomId,
        senderId: userId,
        senderType: "user",
        text: currentMsg,
      });
      return; // Stop here, let the user read the bot's onboarding reply
    }

    // 3. Normal AI / Socket Message Flow (Onboarding Complete)
    const astrologerId = selected.astrologerId?._id || selected.astrologerId;

    const aiPayload = {
      message: currentMsg,
      history: messages.map((m) => ({
        role: m.senderType === "user" ? "user" : "model",
        content: m.text || m.message,
      })),
      userName: userInfo.name,
      userDOB: userInfo.dob,
      userBirthPlace: userInfo.birthPlace,
    };

    try {
      // Try calling the AI backend endpoint first
      const res = await axios.post(`${API}/api/ai-astrologer/${astrologerId}/chat`, aiPayload);
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            _id: `ai-${Date.now()}`,
            senderType: "astrologer",
            text: res.data.message, // Backend already strips #, *, **
            createdAt: new Date().toISOString(),
          },
        ]);
        // Emit to socket so session history updates on the server
        socket.emit("send_message", {
          roomId: selected.roomId,
          senderId: astrologerId,
          senderType: "astrologer",
          text: res.data.message,
        });
        return;
      }
    } catch (err) {
      console.log("AI API call failed or not an AI astrologer, falling back to standard socket", err);
    }

    // Fallback: Normal socket message (for human astrologers)
    socket.emit("send_message", {
      roomId: selected.roomId,
      senderId: userId,
      senderType: "user",
      text: currentMsg,
    });
  };

  const handleAudio = async (e) => {
    const file = e.target.files[0];
    if (!file || chatEnded) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("audio", file);
    try {
      const res = await axios.post(`${API}/api/chat/upload-audio`, fd);
      if (res.data.success) {
        socket.emit("send_message", {
          roomId: selected.roomId,
          senderId: userId,
          senderType: "user",
          text: "🎤 Audio message",
          messageType: "audio",
          attachment: res.data.url,
        });
      }
    } catch (err) {
      toast.error("Audio upload failed", { position: "top-right", theme: "dark" });
    }
    setUploading(false);
    e.target.value = "";
  };

  const endChat = async () => {
    if (ending || chatEnded) return;
    setEnding(true);
    try {
      const res = await axios.post(`${API}/api/chat-session/end`, {
        roomId: selected.roomId,
      });
      if (res.data.success) {
        setChatEnded(true);
        setEndSummary(res.data);
        setSelected((prev) => (prev ? { ...prev, status: "ended" } : prev));
        socket.emit("chat_ended", { roomId: selected.roomId, session: res.data });
        toast.success(`Chat ended! Total: ₹${res.data.totalAmount}`, {
          position: "top-right",
          theme: "dark",
        });
        loadSessions();
      } else {
        toast.error(res.data.message || "Unable to end chat", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Chat already ended") {
        setChatEnded(true);
        toast.info("Chat pehle se ended hai", { position: "top-right", theme: "dark" });
      } else {
        toast.error(msg || "Failed to end chat", { position: "top-right", theme: "dark" });
      }
    } finally {
      setEnding(false);
    }
  };

  /* =========================================
     ✅ NEW: START NEW CHAT — FULL FLOW
  ========================================= */
  const startNewChat = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`${API}/api/chat-session/start`, {
        email: user.email,
        astrologerId: selected.astrologerId._id,
      });

      if (res.data.success && res.data.roomId) {
        newRoomRef.current = res.data.roomId;
        setShowPreChatForm(true);
      }
    } catch (err) {
      const errorData = err.response?.data;
      const statusCode = err.response?.status;

      if (statusCode === 400 && errorData?.recharge) {
        setWalletBalance(errorData.balance || 0);
        setRequiredAmount(errorData.required || 10);
        setShowRecharge(true);
        return;
      }

      toast.error(errorData?.message || "Chat start nahi hui", {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  const handleRecharge = async () => {
    if (!user) return;
    setRecharging(true);
    await rechargeWithRazorpay({
      email: user.email,
      amount: rechargeAmount,
      onSuccess: () => {
        toast.success(`✅ ₹${rechargeAmount} added!`, {
          position: "top-right",
          theme: "dark",
        });
        setShowRecharge(false);
        setRecharging(false);
        startNewChat();
      },
    });
    setRecharging(false);
  };

  const handleFormSubmit = async (formData) => {
    const roomId = newRoomRef.current;
    if (!roomId) return;

    try {
      await axios.post(`${API}/api/chat-session/save-form`, { roomId, formData });
      setShowPreChatForm(false);

      setWaitingTime(Math.random() > 0.5 ? 180 : 120);
      setWaitingAstrologer(selected.astrologerId?.name || "Astrologer");

      socket.emit("join_chat", { roomId });

      const onAstroJoined = () => {
        socket.off("astrologer_joined", onAstroJoined);
        toast.success(`🎉 ${selected.astrologerId?.name} join ho gaye!`, {
          position: "top-right",
          theme: "dark",
        });
        navigate(`/livechat/${roomId}`);
      };

      socket.on("astrologer_joined", onAstroJoined);

      const interval = setInterval(() => {
        setWaitingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            socket.off("astrologer_joined", onAstroJoined);
            navigate(`/livechat/${roomId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error("Form submit failed", { position: "top-right", theme: "dark" });
    }
  };

  const filtered = sessions.filter((s) =>
    (s.astrologerId?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full text-white flex justify-center px-2 lg:px-6 pb-4" style={{ paddingTop: "90px", height: "100vh" }}>
      <div className="flex w-full max-w-[1400px] flex-1 overflow-hidden rounded-2xl border border-purple-800/50 shadow-2xl shadow-purple-900/40 bg-[#101019]">
        
        {/* ═══ LEFT: CHATS LIST ═══ */}
        <div className={`flex-col border-r border-purple-800/40 bg-[#14141f] w-full md:w-[340px] md:shrink-0 ${selected ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-purple-800/40 bg-[#181826]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-purple-100">💬 My Chats</h2>
              <span className="text-xs bg-purple-700/50 px-2 py-1 rounded-full text-purple-200">{sessions.length}</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search astrologer..."
              className="w-full bg-[#20202e] rounded-full px-4 py-2 text-sm outline-none border border-transparent focus:border-purple-600"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-gray-500 text-center mt-10 text-sm">Koi chat nahi mili</p>
            )}

            {filtered.map((s) => (
              <div
                key={s._id}
                onClick={() => setSelected(s)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-purple-900/20 transition-all hover:bg-purple-900/20 ${
                  selected?._id === s._id ? "bg-purple-800/30" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-lg">
                    {s.astrologerId?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  {s.status === "active" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#14141f]"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold truncate text-sm">{s.astrologerId?.name || "Astrologer"}</p>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                      {new Date(s.lastTime).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{s.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ RIGHT: CHAT WINDOW ═══ */}
        <div className={`flex-1 flex-col ${selected ? "flex" : "hidden md:flex"}`}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-[#0d0d15]">
              <div className="text-center">
                <p className="text-6xl mb-4">🔮</p>
                <p className="font-semibold text-gray-400">PlutoAstro Web Chat</p>
                <p className="text-xs mt-2 text-gray-600">Kisi chat pe click karo — messages yahan khulenge</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#181826] border-b border-purple-800/40">
                <button onClick={() => setSelected(null)} className="md:hidden text-purple-300 text-xl mr-1">
                  ←
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold">
                  {selected.astrologerId?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{selected.astrologerId?.name || "Astrologer"}</p>
                  <p className={`text-[11px] ${selected.status === "active" ? "text-green-400" : "text-gray-500"}`}>
                    {typing ? "typing..." : selected.status === "active" ? "● Active Consultation" : "Chat ended"}
                  </p>
                </div>

                {selected.status === "active" && !chatEnded && (
                  <button
                    onClick={endChat}
                    disabled={ending}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    {ending ? "Ending..." : "End Chat"}
                  </button>
                )}
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-2"
                style={{
                  backgroundColor: "#0d0d15",
                  backgroundImage: "radial-gradient(rgba(150,80,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,80,180,0.05) 1px, transparent 1px)",
                  backgroundSize: "24px 24px, 24px 24px",
                  backgroundPosition: "0 0, 12px 12px",
                }}
              >
                {endSummary && (
                  <div className="mb-3 bg-gradient-to-r from-purple-900/70 to-pink-900/70 border border-purple-500/40 rounded-xl p-3 text-xs">
                    <p className="font-bold text-purple-200 mb-1">📊 Chat Summary</p>
                    <div className="flex gap-4 text-gray-300">
                      <span>⏱ {endSummary.duration || 1} min</span>
                      <span className="text-red-400">Total: ₹{endSummary.totalAmount || 0}</span>
                      <span className="text-green-400">Balance: ₹{endSummary.walletBalance || 0}</span>
                    </div>
                  </div>
                )}

                {messages.length === 0 && (
                  <p className="text-center text-xs text-gray-600 mt-10">— No messages yet —</p>
                )}

                {messages.map((msg) => {
                  const isOwn = msg.senderType?.toLowerCase() === "user";
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] px-3 py-2 text-sm shadow ${
                          isOwn
                            ? "bg-gradient-to-br from-purple-700 to-purple-800 rounded-xl rounded-br-sm"
                            : "bg-[#1e1e2c] rounded-xl rounded-bl-sm"
                        }`}
                      >
                        {msg.messageType === "audio" && msg.attachment ? (
                          <audio controls src={`${API}${msg.attachment}`} className="w-56" />
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.message || msg.text}</p>
                        )}
                        <p className="text-[9px] text-gray-400 text-right mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isOwn && <span className={msg.seen ? "text-cyan-400 font-bold" : ""}> ✓✓</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-[#1e1e2c] rounded-xl px-4 py-2 text-xs text-purple-300 italic">typing...</div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-[#181826] border-t border-purple-800/40">
                {chatEnded ? (
                  <button
                    onClick={startNewChat}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:opacity-90"
                  >
                    🔁 Start New Chat
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <input type="file" accept="audio/*" ref={fileRef} hidden onChange={handleAudio} />
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-11 h-11 rounded-full bg-purple-800/60 hover:bg-purple-700 flex items-center justify-center text-lg shrink-0"
                      title="Audio bhejo"
                    >
                      {uploading ? "⏳" : "🎤"}
                    </button>

                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={
                        onboardingStep === 1
                          ? "Apna pura naam likhein..."
                          : onboardingStep === 2
                          ? "DD-MM-YYYY format mein DOB likhein..."
                          : onboardingStep === 3
                          ? "Apna birth city likhein..."
                          : "Type a message..."
                      }
                      className="flex-1 bg-[#20202e] rounded-full px-4 py-3 outline-none text-sm border border-transparent focus:border-purple-600"
                    />

                    <button
                      onClick={sendMessage}
                      className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shrink-0 hover:scale-105 transition-all"
                    >
                      ➤
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ RECHARGE MODAL */}
      {showRecharge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4">
          <div className="bg-zinc-950 border-2 border-purple-800 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-purple-800/50">
            <h2 className="text-2xl font-bold text-purple-200 mb-2">💰 Insufficient Balance</h2>
            <p className="text-gray-300 mb-1">
              Available: <span className="text-red-400 font-semibold">₹{walletBalance}</span>
            </p>
            <p className="text-gray-300 mb-6">
              Required: <span className="text-green-400 font-semibold">₹{requiredAmount}/min</span>
            </p>

            <p className="text-purple-300 text-sm mb-2">Select recharge amount:</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setRechargeAmount(amt)}
                  className={`py-3 rounded-xl font-semibold border-2 transition-all ${
                    rechargeAmount === amt
                      ? "bg-purple-700 border-purple-400 text-white scale-105"
                      : "bg-black bg-opacity-50 border-purple-800 text-purple-300 hover:border-purple-500"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRecharge}
                disabled={recharging}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {recharging ? "Processing..." : `Recharge ₹${rechargeAmount}`}
              </button>
              <button
                onClick={() => setShowRecharge(false)}
                className="px-6 py-3 border-2 border-purple-800 rounded-xl text-purple-300 hover:bg-purple-900 transition-all"
              >
                Cancel
              </button>
            </div>

            <p className="text-gray-500 text-xs mt-4 text-center">🔒 Secured by Razorpay</p>
          </div>
        </div>
      )}

      {/* ✅ PRE-CHAT FORM MODAL */}
      {showPreChatForm && (
        <PreChatForm
          onSubmit={handleFormSubmit}
          astrologerName={selected?.astrologerId?.name}
          onClose={() => setShowPreChatForm(false)}
        />
      )}

      {/* ✅ WAITING SCREEN */}
      {waitingTime !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1b1b2f] rounded-2xl p-8 max-w-md w-full text-center border border-purple-600">
            <div className="text-6xl mb-4 animate-bounce">🔮</div>
            <h2 className="text-2xl font-bold text-white mb-2">{waitingAstrologer} Joining...</h2>
            <p className="text-gray-400 mb-4">Astrologer join karte hi chat turant khul jayegi</p>

            <div className="text-4xl font-bold text-purple-400 mb-6">
              {Math.floor(waitingTime / 60)}:{String(waitingTime % 60).padStart(2, "0")}
            </div>

            <div className="w-full bg-purple-900 bg-opacity-40 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInbox;
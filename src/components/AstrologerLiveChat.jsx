import React, { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import { io } from "socket.io-client";

import axios from "axios";

import { toast } from "react-toastify";
 
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
 
const socket = io(API, {

  autoConnect: false,

  transports: ["websocket"],

});
 
const AstrologerLiveChat = () => {

  const { id } = useParams();

  const roomId = id;
 
  const astrologerData = JSON.parse(

    localStorage.getItem("astrologerData") || "null"

  );

  const astrologerId =

    astrologerData?._id ||

    localStorage.getItem("astrologerId") ||

    "6a5dee5d10ed16329db231f6";
 
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [connected, setConnected] = useState(false);

  const [chatEnded, setChatEnded] = useState(false);

  const [endSummary, setEndSummary] = useState(null);

  const [ending, setEnding] = useState(false);

  const [typing, setTyping] = useState(false);

  const [sessionInfo, setSessionInfo] = useState(null); // ✅ NEW
 
  const typingTimer = useRef(null);

  const lastTypingSent = useRef(0);

  const bottomRef = useRef(null);
 
  const emitTyping = () => {

    if (chatEnded) return;
 
    const now = Date.now();

    if (now - lastTypingSent.current > 1000) {

      socket.emit("typing", { roomId, userId: astrologerId });

      lastTypingSent.current = now;

    }

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {

      socket.emit("stop_typing", { roomId, userId: astrologerId });

    }, 1500);

  };
 
  useEffect(() => {

    socket.connect();
 
    const onConnect = () => {

      console.log("✅ Astrologer Socket Connected:", socket.id);

      setConnected(true);

      socket.emit("join_chat", { roomId });

      socket.emit("astrologer_joined_chat", { roomId }); // ✅ NEW — user ko notify

    };
 
    const onDisconnect = () => setConnected(false);
 
    const onReceiveMessage = (msg) => {

      console.log("📩 Astrologer Receive:", msg);

      setTyping(false);

      setMessages((prev) => {

        const exists = prev.some((item) => {

          if (item._id && msg._id) return item._id === msg._id;

          return (

            item.roomId === msg.roomId &&

            item.senderId === msg.senderId &&

            (item.message || item.text) === (msg.message || msg.text)

          );

        });

        if (exists) return prev;

        return [...prev, msg];

      });
 
      if (msg.senderType?.toLowerCase() === "user") {

        socket.emit("seen", { roomId, userId: astrologerId });

      }

    };
 
    const onChatEnded = (data) => {

      console.log("🛑 Chat Ended:", data);

      setChatEnded(true);

      setTyping(false);

      if (data?.session) setEndSummary(data.session);

      toast.info("Chat ended by user", {

        position: "top-right",

        theme: "dark",

      });

    };
 
    const onTyping = () => setTyping(true);

    const onStopTyping = () => setTyping(false);
 
    const onSeen = (data) => {

      console.log("👀 Seen by user:", data);

      setMessages((prev) =>

        prev.map((m) =>

          m.senderType?.toLowerCase() === "astrologer"

            ? { ...m, seen: true }

            : m

        )

      );

    };
 
    socket.off("connect");

    socket.off("disconnect");

    socket.off("receive_message");

    socket.off("chat_ended");

    socket.off("typing");

    socket.off("stop_typing");

    socket.off("seen");
 
    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("receive_message", onReceiveMessage);

    socket.on("chat_ended", onChatEnded);

    socket.on("typing", onTyping);

    socket.on("stop_typing", onStopTyping);

    socket.on("seen", onSeen);
 
    loadMessages();

    loadSession(); // ✅ NEW
 
    return () => {

      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("receive_message", onReceiveMessage);

      socket.off("chat_ended", onChatEnded);

      socket.off("typing", onTyping);

      socket.off("stop_typing", onStopTyping);

      socket.off("seen", onSeen);

      clearTimeout(typingTimer.current);

      socket.disconnect();

    };

  }, [roomId]);
 
  useEffect(() => {

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages, typing]);
 
  const loadMessages = async () => {

    try {

      const res = await axios.get(`${API}/api/chat/history/${roomId}`);

      if (res.data.success) {

        const history = res.data.messages || [];

        setMessages(history);

        const isEnded = history.some((m) => m.chatStatus === "ended");

        if (isEnded) setChatEnded(true);

        socket.emit("seen", { roomId, userId: astrologerId });

      }

    } catch (err) {

      console.error("History Error:", err);

    }

  };
 
  // ✅ NEW: Session + form data fetch karo

  const loadSession = async () => {

    try {

      const res = await axios.get(`${API}/api/chat-session/session/${roomId}`);

      if (res.data.success) {

        setSessionInfo(res.data.session);

        console.log("📋 Session loaded:", res.data.session);

      }

    } catch (e) {

      console.error("Session load error:", e);

    }

  };
 
  const sendMessage = () => {

    if (!message.trim() || chatEnded) return;
 
    const payload = {

      roomId,

      senderId: astrologerId,

      senderType: "astrologer",

      text: message.trim(),

    };
 
    console.log("📤 Astrologer Sending:", payload);

    socket.emit("send_message", payload);

    socket.emit("stop_typing", { roomId, userId: astrologerId });

    clearTimeout(typingTimer.current);

    setMessage("");

  };
 
  const endChat = async () => {

    if (ending || chatEnded) return;

    setEnding(true);
 
    try {

      const res = await axios.post(`${API}/api/chat-session/end`, { roomId });
 
      if (res.data.success) {

        setChatEnded(true);

        setEndSummary(res.data);

        socket.emit("chat_ended", { roomId, session: res.data });

        toast.success(`Chat ended! Total: ₹${res.data.totalAmount}`, {

          position: "top-right",

          theme: "dark",

        });

      } else {

        if (res.data.message === "Chat already ended") {

          setChatEnded(true);

          toast.info("Chat pehle se ended hai", {

            position: "top-right",

            theme: "dark",

          });

        } else {

          toast.error(res.data.message || "Unable to end chat", {

            position: "top-right",

            theme: "dark",

          });

        }

      }

    } catch (err) {

      const msg = err.response?.data?.message;

      if (msg === "Chat already ended") {

        setChatEnded(true);

        toast.info("Chat pehle se ended hai", {

          position: "top-right",

          theme: "dark",

        });

      } else {

        toast.error(msg || "Failed to end chat", {

          position: "top-right",

          theme: "dark",

        });

      }

    } finally {

      setEnding(false);

    }

  };
 
  return (
<div className="min-h-screen bg-[#0f0f1a] flex justify-center items-center text-white p-4">
<div className="w-full max-w-4xl bg-[#1b1b2f] rounded-xl p-6">
<h2 className="text-2xl font-bold">🔮 Astrologer Chat</h2>
 
        <p className="mt-2 text-gray-400">

          Room: <span className="text-pink-300">{roomId}</span>
</p>
 
        <p className="mb-4">

          Status:
<span

            className={connected ? "text-green-400 ml-2" : "text-red-400 ml-2"}
>

            {connected ? "Connected" : "Disconnected"}
</span>

          {chatEnded && (
<span className="ml-3 text-red-400 font-semibold">

              🛑 Chat Ended
</span>

          )}
</p>
 
        {chatEnded && endSummary && (
<div className="mb-4 bg-gradient-to-r from-pink-900 to-purple-900 border border-pink-500 rounded-lg p-4">
<h3 className="text-white font-bold mb-2">📊 Chat Summary</h3>
<div className="grid grid-cols-3 gap-3 text-sm">
<div>
<p className="text-gray-300">Duration</p>
<p className="text-white font-bold">

                  {endSummary.duration || 1} min
</p>
</div>
<div>
<p className="text-gray-300">Total Amount</p>
<p className="text-red-400 font-bold">

                  ₹{endSummary.totalAmount || 0}
</p>
</div>
<div>
<p className="text-gray-300">Your Earning</p>
<p className="text-green-400 font-bold">

                  ₹{endSummary.astrologerAmount || 0}
</p>
</div>
</div>
</div>

        )}
 
        <div className="h-[500px] overflow-y-auto bg-[#141424] rounded-lg p-4">

          {/* ✅ NEW: User ka bhara hua form — sabse pehle */}

          {sessionInfo?.preChatForm && (
<div className="mb-4 bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-500/40 rounded-xl p-4 text-sm">
<p className="text-purple-300 font-bold mb-2 uppercase text-xs tracking-wider">

                📋 User Details
</p>
<div className="grid grid-cols-2 gap-2 text-gray-300">
<p>
<span className="text-purple-400">Name:</span>{" "}

                  {sessionInfo.preChatForm.name}
</p>
<p>
<span className="text-purple-400">DOB:</span>{" "}

                  {new Date(sessionInfo.preChatForm.dob).toLocaleDateString(

                    "en-IN"

                  )}
</p>
<p className="col-span-2">
<span className="text-purple-400">Rashi:</span>{" "}

                  {sessionInfo.preChatForm.rashi}
</p>
</div>
<p className="mt-2 text-white bg-black/30 rounded-lg p-2">

                💬 {sessionInfo.preChatForm.query}
</p>
</div>

          )}
 
          {messages.map((msg, index) => {

            const isOwn = msg.senderType?.toLowerCase() === "astrologer";

            return (
<div

                key={msg._id || index}

                className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
>
<div

                  className={`px-4 py-2 rounded-xl max-w-[70%] ${

                    isOwn ? "bg-pink-600" : "bg-gray-700"

                  }`}
>
<p className="text-[10px] opacity-70 mb-1">

                    {isOwn ? "You (Astrologer)" : "User"}
</p>

                  {msg.message || msg.text}

                  {isOwn && (
<p className="text-[10px] text-right mt-1">

                      {msg.seen ? (
<span className="text-green-300 font-bold">✓✓</span>

                      ) : (
<span className="text-gray-300">✓</span>

                      )}
</p>

                  )}
</div>
</div>

            );

          })}
 
          {typing && !chatEnded && (
<div className="mb-3 flex justify-start">
<div className="px-4 py-2 rounded-xl bg-gray-700">
<p className="text-[10px] opacity-70 mb-1">User</p>
<div className="flex gap-1 items-center">
<span className="text-pink-300 text-sm italic">typing</span>
<span className="flex gap-0.5">
<span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></span>
<span

                      className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"

                      style={{ animationDelay: "150ms" }}
></span>
<span

                      className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"

                      style={{ animationDelay: "300ms" }}
></span>
</span>
</div>
</div>
</div>

          )}
 
          <div ref={bottomRef} />
</div>
 
        <div className="flex gap-3 mt-4">

          {chatEnded ? (
<div className="flex-1 bg-[#24243c] rounded-lg p-4 text-center">
<p className="text-red-400 font-semibold">🛑 Chat Has Ended</p>
<p className="text-gray-400 text-sm mt-1">

                No more messages can be sent
</p>
</div>

          ) : (
<>
<input

                className="flex-1 bg-[#24243c] rounded-lg px-4 py-3 outline-none"

                value={message}

                placeholder="Reply type karo..."

                onChange={(e) => {

                  setMessage(e.target.value);

                  emitTyping();

                }}

                onKeyDown={(e) => {

                  if (e.key === "Enter") sendMessage();

                }}

              />
<button

                onClick={sendMessage}

                className="bg-pink-600 px-6 rounded-lg hover:bg-pink-700"
>

                Send
</button>
<button

                onClick={endChat}

                disabled={ending}

                className="bg-red-600 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
>

                {ending ? "Ending..." : "End Chat"}
</button>
</>

          )}
</div>
</div>
</div>

  );

};
 
export default AstrologerLiveChat;
 
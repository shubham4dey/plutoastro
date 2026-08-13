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
 
const LiveChat = () => {

  const { id } = useParams();

  const roomId = id;

  const userId = localStorage.getItem("userId") || "6a73179f5daf163fd9e69589";
 
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [connected, setConnected] = useState(false);
 
  // ✅ Chat End States

  const [chatEnded, setChatEnded] = useState(false);

  const [endSummary, setEndSummary] = useState(null);

  const [ending, setEnding] = useState(false);
 
  // ✅ Typing States

  const [typing, setTyping] = useState(false);

  const typingTimer = useRef(null);

  const lastTypingSent = useRef(0);
 
  const bottomRef = useRef(null);
 
  // ==========================

  // EMIT TYPING

  // ==========================
 
  const emitTyping = () => {

    if (chatEnded) return;

    const now = Date.now();

    if (now - lastTypingSent.current > 1000) {

      socket.emit("typing", { roomId, userId });

      lastTypingSent.current = now;

    }

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {

      socket.emit("stop_typing", { roomId, userId });

    }, 1500);

  };
 
  // ==========================

  // SOCKET

  // ==========================
 
  useEffect(() => {

    socket.connect();
 
    const onConnect = () => {

      console.log("✅ Socket Connected:", socket.id);

      setConnected(true);

      socket.emit("join_chat", { roomId });

    };
 
    const onDisconnect = () => {

      console.log("🔴 Socket Disconnected");

      setConnected(false);

    };
 
    const onReceiveMessage = (msg) => {

      console.log("📩 Receive:", msg);

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
 
      if (msg.senderType?.toLowerCase() === "astrologer") {

        socket.emit("seen", { roomId, userId });

      }

    };
 
    const onChatEnded = (data) => {

      console.log("🛑 Chat Ended:", data);

      setChatEnded(true);

      setTyping(false);

      if (data?.session) setEndSummary(data.session);

      toast.info("Chat ended by astrologer", {

        position: "top-right",

        theme: "dark",

      });

    };
 
    const onTyping = () => setTyping(true);

    const onStopTyping = () => setTyping(false);
 
    const onSeen = (data) => {

      console.log("👀 Seen by astrologer:", data);

      setMessages((prev) =>

        prev.map((m) =>

          m.senderType?.toLowerCase() === "user" ? { ...m, seen: true } : m

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
 
  // ==========================

  // AUTO SCROLL

  // ==========================
 
  useEffect(() => {

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages, typing]);
 
  // ==========================

  // LOAD HISTORY

  // ==========================
 
  const loadMessages = async () => {

    try {

      const res = await axios.get(`${API}/api/chat/history/${roomId}`);

      console.log("History:", res.data);
 
      if (res.data.success) {

        const history = res.data.messages || [];

        setMessages(history);
 
        const isEnded = history.some((m) => m.chatStatus === "ended");

        if (isEnded) setChatEnded(true);
 
        socket.emit("seen", { roomId, userId });

      }

    } catch (err) {

      console.error("History Error:", err);

    }

  };
 
  // ==========================

  // SEND MESSAGE

  // ==========================
 
  const sendMessage = () => {

    if (!message.trim() || chatEnded) return;
 
    const payload = {

      roomId,

      senderId: userId,

      senderType: "user",

      text: message.trim(),

    };
 
    console.log("📤 Sending:", payload);

    socket.emit("send_message", payload);

    socket.emit("stop_typing", { roomId, userId });

    clearTimeout(typingTimer.current);

    setMessage("");

  };
 
  // ==========================

  // END CHAT (FIXED)

  // ==========================
 
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

        // ✅ NEW: "Chat already ended" handle karo

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
 
      // ✅ NEW: 400 "Chat already ended" bhi handle karo

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
<h2 className="text-2xl font-bold">Live Chat</h2>
 
        <p className="mt-2 text-gray-400">

          Room: <span className="text-purple-300">{roomId}</span>
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
<div className="mb-4 bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-500 rounded-lg p-4">
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
<p className="text-gray-300">Wallet Balance</p>
<p className="text-green-400 font-bold">

                  ₹{endSummary.walletBalance || 0}
</p>
</div>
</div>
</div>

        )}
 
        <div className="h-[500px] overflow-y-auto bg-[#141424] rounded-lg p-4">

          {messages.map((msg, index) => {

            const isOwn = msg.senderType?.toLowerCase() === "user";
 
            return (
<div

                key={msg._id || index}

                className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
>
<div

                  className={`px-4 py-2 rounded-xl max-w-[70%] ${

                    isOwn ? "bg-purple-600" : "bg-gray-700"

                  }`}
>
<p className="text-[10px] opacity-70 mb-1">

                    {isOwn ? "You" : "Astrologer"}
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
<div className="px-4 py-2 rounded-xl bg-gray-700 max-w-[70%]">
<p className="text-[10px] opacity-70 mb-1">Astrologer</p>
<div className="flex gap-1 items-center">
<span className="text-purple-300 text-sm italic">typing</span>
<span className="flex gap-0.5">
<span

                      className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce"

                      style={{ animationDelay: "0ms" }}
></span>
<span

                      className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce"

                      style={{ animationDelay: "150ms" }}
></span>
<span

                      className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce"

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

                placeholder="Type message..."

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

                className="bg-purple-600 px-6 rounded-lg hover:bg-purple-700"
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
 
export default LiveChat;
 
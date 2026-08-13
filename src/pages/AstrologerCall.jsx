import React, { useEffect, useRef, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

import axios from "axios";
 
const API = process.env.REACT_APP_API_URL || "https://plutoastro-backend.onrender.com";
 
const socket = io(API, { transports: ["websocket"] });
 
const AstrologerCall = () => {

  const { id: roomId } = useParams();

  const navigate = useNavigate();
 
  const [status, setStatus] = useState("connecting");

  const [seconds, setSeconds] = useState(0);

  const [muted, setMuted] = useState(false);

  const [summary, setSummary] = useState(null);

  const [userName, setUserName] = useState("");

  const [micError, setMicError] = useState(false);
 
  const pcRef = useRef(null);

  const localStreamRef = useRef(null);

  const remoteAudioRef = useRef(null);

  const pendingOfferRef = useRef(null);

  const answeredRef = useRef(false);

  const readyIntervalRef = useRef(null);
 
  // Call timer

  useEffect(() => {

    let t;

    if (status === "active") {

      t = setInterval(() => setSeconds((s) => s + 1), 1000);

    }

    return () => clearInterval(t);

  }, [status]);
 
  // ✅ SMART NAME FETCH: User ka naam (agar "User" hai to email prefix dikhao)

  useEffect(() => {

    const load = async () => {

      try {

        const res = await axios.get(`${API}/api/call/session/${roomId}`);

        if (res.data.success) {

          const u = res.data.session.userId;

          const rawName = u?.name || "";

          const email = u?.email || "";
 
          // Agar name default "User" hai → email ka prefix dikhao

          const niceName =

            rawName && rawName.toLowerCase() !== "user"

              ? rawName

              : email

              ? email.split("@")[0]

              : "User";
 
          setUserName(niceName);

        }

      } catch (e) {

        console.error("Failed to load session:", e);

      }

    };

    load();

  }, [roomId]);
 
  useEffect(() => {

    let cancelled = false;
 
    const cleanup = () => {

      clearInterval(readyIntervalRef.current);

      pcRef.current?.close();

      localStreamRef.current?.getTracks().forEach((t) => t.stop());

    };
 
    // Room join

    socket.emit("join_call", { roomId });
 
    // callee_ready har 2 sec me bhejo (refresh-proof)

    socket.emit("callee_ready", { roomId });

    readyIntervalRef.current = setInterval(() => {

      if (answeredRef.current) {

        clearInterval(readyIntervalRef.current);

        return;

      }

      socket.emit("callee_ready", { roomId });

    }, 2000);
 
    console.log("📞 Astrologer joined call + callee_ready loop started");
 
    // Offer process karne ka logic

    const processOffer = async () => {

      if (!pcRef.current || !pendingOfferRef.current || answeredRef.current)

        return;
 
      try {

        answeredRef.current = true;

        clearInterval(readyIntervalRef.current);
 
        await pcRef.current.setRemoteDescription(

          new RTCSessionDescription(pendingOfferRef.current)

        );

        const answer = await pcRef.current.createAnswer();

        await pcRef.current.setLocalDescription(answer);

        socket.emit("answer", { roomId, answer });

        console.log("📤 Answer sent");

        setStatus("active");

      } catch (e) {

        answeredRef.current = false;

        console.error("Answer error:", e);

      }

    };
 
    // ✅ PC banane ka common helper

    const makePc = () => {

      const pc = new RTCPeerConnection({

        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],

      });

      pc.onicecandidate = (e) => {

        if (e.candidate) {

          socket.emit("ice-candidate", { roomId, candidate: e.candidate });

        }

      };

      pc.ontrack = (e) => {

        console.log("🎧 Remote audio track received");

        if (remoteAudioRef.current) {

          remoteAudioRef.current.srcObject = e.streams[0];

        }

      };

      return pc;

    };
 
    const setup = async () => {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({

          audio: true,

        });

        if (cancelled) {

          stream.getTracks().forEach((t) => t.stop());

          return;

        }
 
        setMicError(false);

        localStreamRef.current = stream;
 
        const pc = makePc();

        pcRef.current = pc;
 
        stream.getTracks().forEach((tr) => pc.addTrack(tr, stream));

        console.log("🎙️ Mic connected — full two-way audio mode");

      } catch (err) {

        // ✅ FALLBACK: mic blocked → bina mic ke call

        console.error("Mic blocked, fallback mode:", err.message);

        setMicError(true);
 
        const pc = makePc();

        pcRef.current = pc;
 
        // recvonly transceiver — sirf sun sakte ho

        pc.addTransceiver("audio", { direction: "recvonly" });

        console.log("🔇 Fallback mode — recv-only audio");

      }
 
      // Agar offer pehle aa chuka tha → process karo

      processOffer();

    };
 
    setup();
 
    const onOffer = ({ offer }) => {

      console.log("📥 Offer received");

      pendingOfferRef.current = offer;

      processOffer();

    };
 
    const onIce = async ({ candidate }) => {

      try {

        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));

      } catch (e) {

        console.error(e);

      }

    };
 
    const onEnded = () => {

      setStatus("ended");

      cleanup();

    };
 
    socket.on("offer", onOffer);

    socket.on("ice-candidate", onIce);

    socket.on("call_ended", onEnded);
 
    return () => {

      cancelled = true;

      socket.off("offer", onOffer);

      socket.off("ice-candidate", onIce);

      socket.off("call_ended", onEnded);

      cleanup();

    };

  }, [roomId]);
 
  const endCall = async () => {

    try {

      const res = await axios.post(`${API}/api/call/end`, { roomId });

      if (res.data.success) setSummary(res.data);

    } catch (e) {

      console.error(e);

    }

    socket.emit("call_ended", { roomId });

    setStatus("ended");

  };
 
  const toggleMute = () => {

    const stream = localStreamRef.current;

    if (!stream) return;

    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));

    setMuted(!muted);

  };
 
  const fmt = (s) =>

    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
 
  return (
<div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center text-white p-4">
<audio ref={remoteAudioRef} autoPlay />
 
      <div className="w-full max-w-md bg-[#1b1b2f] rounded-2xl p-8 text-center border border-pink-700/40">
<div

          className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-5xl ${

            status === "connecting" ? "animate-pulse" : ""

          }`}
>

          👤
</div>
 
        {/* ✅ SMART NAME: Email prefix agar "User" ho */}
<h2 className="text-2xl font-bold mt-4 capitalize">

          {userName || "User"}
</h2>
 
        <p className="text-gray-400 mt-2">

          {status === "connecting" && "🔌 Connecting..."}

          {status === "active" && `🎙️ ${fmt(seconds)}`}

          {status === "ended" && "📴 Call Ended"}
</p>
 
        {micError && (
<p className="text-yellow-400 text-xs mt-3 animate-pulse">

            🔇 Mic unavailable (company policy) — call phir bhi chalegi,

            user ki awaaz sunai degi
</p>

        )}
 
        {summary && (
<div className="mt-4 bg-[#24243c] rounded-xl p-4 text-sm space-y-1">
<p className="text-white">Duration: {summary.duration} min</p>
<p className="text-red-400">Bill: ₹{summary.totalAmount}</p>
<p className="text-green-400">

              Your Earning: ₹{summary.session?.astrologerAmount || 0}
</p>
</div>

        )}
 
        <div className="flex justify-center gap-6 mt-8">
<button

            onClick={toggleMute}

            className={`w-14 h-14 rounded-full text-xl ${

              muted ? "bg-yellow-600" : "bg-gray-700"

            }`}
>

            {muted ? "🔇" : "🎙️"}
</button>
 
          <button

            onClick={endCall}

            disabled={status === "ended"}

            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-xl disabled:opacity-40"
>

            📞
</button>
</div>
 
        {status === "ended" && (
<button

            onClick={() => navigate("/astrologer/dashboard")}

            className="mt-6 px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-700"
>

            Back to Dashboard
</button>

        )}
</div>
</div>

  );

};
 
export default AstrologerCall;
 
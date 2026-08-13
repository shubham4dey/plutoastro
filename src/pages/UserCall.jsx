import React, { useEffect, useRef, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

import axios from "axios";

import { toast } from "react-toastify";
 
const API = process.env.REACT_APP_API_URL || "https://plutoastro-backend.onrender.com";
 
const socket = io(API, { transports: ["websocket"] });
 
const UserCall = () => {

  const { id: roomId } = useParams();

  const navigate = useNavigate();
 
  const [status, setStatus] = useState("calling");

  const [seconds, setSeconds] = useState(0);

  const [muted, setMuted] = useState(false);

  const [summary, setSummary] = useState(null);

  const [astroName, setAstroName] = useState("");

  const [micError, setMicError] = useState(false);
 
  const pcRef = useRef(null);

  const localStreamRef = useRef(null);

  const remoteAudioRef = useRef(null);

  const offerSentRef = useRef(false);

  const answerRef = useRef(false);

  const calleeReadyRef = useRef(false);

  const retryRef = useRef(null);
 
  // Call timer

  useEffect(() => {

    let t;

    if (status === "active") {

      t = setInterval(() => setSeconds((s) => s + 1), 1000);

    }

    return () => clearInterval(t);

  }, [status]);
 
  // ✅ SMART NAME FETCH: Astrologer ka naam

  useEffect(() => {

    const load = async () => {

      try {

        const res = await axios.get(`${API}/api/call/session/${roomId}`);

        if (res.data.success) {

          const a = res.data.session.astrologerId;

          const rawName = a?.name || "";

          const email = a?.email || "";
 
          const niceName =

            rawName && rawName.toLowerCase() !== "user" && rawName.toLowerCase() !== "astrologer"

              ? rawName

              : email

              ? email.split("@")[0]

              : "Astrologer";
 
          setAstroName(niceName);

        }

      } catch (e) {

        console.error("Failed to load call session:", e);

      }

    };

    load();

  }, [roomId]);
 
  useEffect(() => {

    let cancelled = false;
 
    const cleanup = () => {

      clearInterval(retryRef.current);

      pcRef.current?.close();

      localStreamRef.current?.getTracks().forEach((t) => t.stop());

    };
 
    // Pehle room join + ring bhejo

    socket.emit("join_call", { roomId });

    const astrologerId = sessionStorage.getItem("call_astrologerId");

    socket.emit("call_request", { roomId, astrologerId });

    console.log("📞 Join call + request sent:", roomId);
 
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
 
    // Offer bhejne ka logic

    const maybeSendOffer = async (force = false) => {

      if (!pcRef.current) return;

      if (offerSentRef.current && !force) return;

      if (answerRef.current) return;
 
      try {

        offerSentRef.current = true;

        const offer = await pcRef.current.createOffer();

        await pcRef.current.setLocalDescription(offer);

        socket.emit("offer", { roomId, offer });

        console.log("📤 Offer sent");

      } catch (e) {

        offerSentRef.current = false;

        console.error("Offer error:", e);

      }

    };
 
    const startOfferRetry = () => {

      clearInterval(retryRef.current);

      let attempts = 0;

      retryRef.current = setInterval(() => {

        if (answerRef.current || attempts >= 10) {

          clearInterval(retryRef.current);

          return;

        }

        attempts++;

        console.log("📤 Offer retry:", attempts);

        maybeSendOffer(true);

      }, 1500);

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
 
        pc.addTransceiver("audio", { direction: "recvonly" });

        console.log("🔇 Fallback mode — recv-only audio");

      }
 
      if (calleeReadyRef.current) {

        maybeSendOffer();

        startOfferRetry();

      }

    };
 
    setup();
 
    const onAccepted = () => {

      console.log("✅ Call accepted received");

      setStatus("active");

    };
 
    const onCalleeReady = () => {

      console.log("🔔 Callee ready received");

      calleeReadyRef.current = true;

      maybeSendOffer();

      startOfferRetry();

    };
 
    const onAnswer = async ({ answer }) => {

      console.log("📥 Answer received");

      answerRef.current = true;

      clearInterval(retryRef.current);

      try {

        await pcRef.current?.setRemoteDescription(

          new RTCSessionDescription(answer)

        );

      } catch (e) {

        console.error(e);

      }

    };
 
    const onIce = async ({ candidate }) => {

      try {

        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));

      } catch (e) {

        console.error(e);

      }

    };
 
    const onRejected = () => {

      setStatus("rejected");

      toast.error("Astrologer ne call reject ki", {

        position: "top-right",

        theme: "dark",

      });

      cleanup();

      setTimeout(() => navigate(-1), 2500);

    };
 
    const onEnded = () => {

      setStatus("ended");

      cleanup();

    };
 
    socket.on("call_accepted", onAccepted);

    socket.on("callee_ready", onCalleeReady);

    socket.on("answer", onAnswer);

    socket.on("ice-candidate", onIce);

    socket.on("call_rejected", onRejected);

    socket.on("call_ended", onEnded);
 
    return () => {

      cancelled = true;

      socket.off("call_accepted", onAccepted);

      socket.off("callee_ready", onCalleeReady);

      socket.off("answer", onAnswer);

      socket.off("ice-candidate", onIce);

      socket.off("call_rejected", onRejected);

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
 
      <div className="w-full max-w-md bg-[#1b1b2f] rounded-2xl p-8 text-center border border-purple-700/40">
<div

          className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-5xl ${

            status === "calling" ? "animate-pulse" : ""

          }`}
>

          🔮
</div>
 
        {/* ✅ SMART NAME */}
<h2 className="text-2xl font-bold mt-4 capitalize">

          {astroName || "Astrologer"}
</h2>
 
        <p className="text-gray-400 mt-2">

          {status === "calling" && "📞 Calling..."}

          {status === "active" && `🎙️ ${fmt(seconds)}`}

          {status === "rejected" && "❌ Call Rejected"}

          {status === "ended" && "📴 Call Ended"}
</p>
 
        {micError && (
<p className="text-yellow-400 text-xs mt-3 animate-pulse">

            🔇 Mic unavailable (company policy) — call phir bhi chalegi,

            astrologer ki awaaz sunai degi
</p>

        )}
 
        {summary && (
<div className="mt-4 bg-[#24243c] rounded-xl p-4 text-sm space-y-1">
<p className="text-white">Duration: {summary.duration} min</p>
<p className="text-red-400">Total: ₹{summary.totalAmount}</p>
<p className="text-green-400">Balance: ₹{summary.walletBalance}</p>
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

            disabled={status === "ended" || status === "rejected"}

            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-xl disabled:opacity-40"
>

            📞
</button>
</div>
 
        {status === "ended" && (
<button

            onClick={() => navigate("/")}

            className="mt-6 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
>

            Back to Home
</button>

        )}
</div>
</div>

  );

};
 
export default UserCall;
 
import { useDispatch, useSelector } from "react-redux";

import useAstroProfile from "../custom hooks/useAstroProfile";

import { Link, useParams, useNavigate } from "react-router-dom";

import { PROFILE_BG, PROFILE_IMG } from "../utils/constants";

import ShimmerProfile from "../shimmer/ShimmerProfile";

import { toast, Bounce } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { addFollow, removeFollow } from "../store/followSlice";

import { useState, useEffect } from "react";

import { addForm } from "../store/configAppSlice";

import Chatbot from "./Chatbot";

import bg from "../image/bg1.jpg";

import AstroProfileBottom from "./AstroProfileBottom";

import axios from "axios";

import PreChatForm from "../components/PreChatForm";

import { io } from "socket.io-client";

import { rechargeWithRazorpay } from "../utils/razorpay"; // ✅ NEW: Razorpay import
 
const API = process.env.REACT_APP_API_URL || "https://plutoastro-backend.onrender.com";

const socket = io(API, { transports: ["websocket"] });
 
const AstroProfile = () => {

  const [follow, setfollow] = useState(false);

  const navigate = useNavigate();
 
  const { id } = useParams();

  useAstroProfile(id);
 
  const dispatch = useDispatch();
 
  const Bot = useSelector((store) => store.configApp.Bot);

  const astroProfile = useSelector((store) => store.astro.astroProfile);

  const user = useSelector((store) => store.user);
 
  // RECHARGE MODAL STATES

  const [showRecharge, setShowRecharge] = useState(false);

  const [rechargeAmount, setRechargeAmount] = useState(100);

  const [walletBalance, setWalletBalance] = useState(0);

  const [requiredAmount, setRequiredAmount] = useState(0);

  const [recharging, setRecharging] = useState(false);

  const [pendingAction, setPendingAction] = useState(null);
 
  // PRE-CHAT FORM + WAITING STATES

  const [showPreChatForm, setShowPreChatForm] = useState(false);

  const [waitingTime, setWaitingTime] = useState(null);

  const [waitingAstrologer, setWaitingAstrologer] = useState("");
 
  useEffect(() => {

    console.log("Astro Profile Data:", astroProfile);

    console.log("Profile ID:", id);

  }, [astroProfile, id]);
 
  if (!astroProfile) {

    return <ShimmerProfile />;

  }
 
  const data = astroProfile?.data || astroProfile;
 
  // START CHAT (with recharge + pre-chat form)

  const handleStartChat = async (e) => {

    console.count("START CHAT CLICKED");

    e?.preventDefault();

    e?.stopPropagation();
 
    try {

      if (!user) {

        toast.error("Please login first", {

          position: "top-right",

          autoClose: 1500,

          theme: "dark",

        });

        dispatch(addForm());

        return;

      }
 
      console.log("Sending payload to backend:", {

        email: user.email,

        astrologerId: data._id,

      });
 
      const res = await axios.post(`${API}/api/chat-session/start`, {

        email: user.email,

        astrologerId: data._id,

      });
 
      console.log("API RESPONSE SUCCESS:", res.data);
 
      if (res.data.success && res.data.roomId) {

        sessionStorage.setItem("chatRoomId", res.data.roomId);

        setShowPreChatForm(true);

      } else {

        toast.error("Server se valid Room ID nahi mila.");

      }

    } catch (err) {

      console.error("Start Chat API Error:", err);
 
      const errorData = err.response?.data;

      const statusCode = err.response?.status;
 
      if (statusCode === 400 && errorData?.recharge) {

        setWalletBalance(errorData.balance || 0);

        setRequiredAmount(errorData.required || 10);

        setPendingAction("chat");

        setShowRecharge(true);

        return;

      }
 
      const errorMsg =

        statusCode === 404

          ? "Chat service unavailable (Backend Route Missing)."

          : errorData?.message || "Unable to start chat";
 
      toast.error(errorMsg, {

        position: "top-right",

        autoClose: 2000,

        theme: "dark",

      });

    }

  };
 
  // ✅ UPDATED: FORM SUBMIT HANDLER (with instant redirect)

  const handleFormSubmit = async (formData) => {

    const roomId = sessionStorage.getItem("chatRoomId");

    if (!roomId) return;
 
    try {

      await axios.post(`${API}/api/chat-session/save-form`, {

        roomId,

        formData,

      });
 
      setShowPreChatForm(false);
 
      const waitSeconds = Math.random() > 0.5 ? 180 : 120;

      setWaitingTime(waitSeconds);

      setWaitingAstrologer(data.name);
 
      // ✅ Room join karo taaki astrologer_joined sun sake

      socket.emit("join_chat", { roomId });
 
      // ✅ NEW: Astrologer join karte hi TURANT redirect

      const onAstroJoined = () => {

        socket.off("astrologer_joined", onAstroJoined);

        toast.success(`🎉 ${data.name} join ho gaye!`, {

          position: "top-right",

          theme: "dark",

        });

        navigate(`/livechat/${roomId}`);

      };

      socket.on("astrologer_joined", onAstroJoined);
 
      // Countdown (fallback — 0 pe bhi redirect)

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
 
  // START CALL HANDLER (same as before)

  const handleStartCall = async (e) => {

    e?.preventDefault();

    e?.stopPropagation();
 
    try {

      if (!user) {

        toast.error("Please login first", {

          position: "top-right",

          autoClose: 1500,

          theme: "dark",

        });

        dispatch(addForm());

        return;

      }
 
      console.log("📞 Starting Call:", {

        email: user.email,

        astrologerId: data._id,

      });
 
      const res = await axios.post(`${API}/api/call/start`, {

        email: user.email,

        astrologerId: data._id,

      });
 
      if (res.data.success && res.data.roomId) {

        sessionStorage.setItem("call_astrologerId", data._id);

        navigate(`/call/${res.data.roomId}`);

      } else {

        toast.error("Call start nahi hui");

      }

    } catch (err) {

      console.error("Start Call API Error:", err);
 
      const errorData = err.response?.data;

      const statusCode = err.response?.status;
 
      if (statusCode === 400 && errorData?.recharge) {

        setWalletBalance(errorData.balance || 0);

        setRequiredAmount(errorData.required || 10);

        setPendingAction("call");

        setShowRecharge(true);

        return;

      }
 
      const errorMsg = errorData?.message || "Call start nahi hui";

      toast.error(errorMsg, {

        position: "top-right",

        autoClose: 2000,

        theme: "dark",

      });

    }

  };
 
  // ✅ RAZORPAY RECHARGE HANDLER

  const handleRecharge = async () => {

    if (!user) return;

    setRecharging(true);
 
    await rechargeWithRazorpay({

      email: user.email,

      amount: rechargeAmount,

      onSuccess: (data) => {

        toast.success(`✅ ₹${rechargeAmount} added! Balance: ₹${data.balance}`, {

          position: "top-right",

          autoClose: 1500,

          theme: "dark",

        });

        setShowRecharge(false);
 
        // Recharge ke baad pending action chalao

        if (pendingAction === "chat") {

          handleStartChat();

        } else if (pendingAction === "call") {

          handleStartCall();

        }

        setPendingAction(null);

        setRecharging(false);

      },

    });
 
    setRecharging(false);

  };
 
  const handlefollow = (data) => {

    if (!user) {

      toast.error("You're not logged In", {

        position: "top-right",

        autoClose: 1200,

        hideProgressBar: false,

        closeOnClick: true,

        pauseOnHover: false,

        draggable: true,

        progress: undefined,

        theme: "dark",

        transition: Bounce,

      });

      dispatch(addForm());

      return;

    }
 
    toast("🔥 Followed " + data?.name, {

      position: "top-right",

      autoClose: 1000,

      hideProgressBar: false,

      closeOnClick: true,

      pauseOnHover: false,

      draggable: true,

      progress: undefined,

      theme: "dark",

      transition: Bounce,

    });

    dispatch(addFollow(data));

    setfollow(!follow);

  };
 
  const handleUnfollow = () => {

    toast("👎 Unfollowed " + data?.name, {

      position: "top-right",

      autoClose: 1000,

      hideProgressBar: false,

      closeOnClick: true,

      pauseOnHover: false,

      draggable: true,

      progress: undefined,

      theme: "dark",

      transition: Bounce,

    });

    dispatch(removeFollow(data));

    setfollow(!follow);

  };
 
  return (
<div className="lg:pt-36 pt-28 px-4 lg:px-20 pb-20 relative min-h-screen">

      {Bot && <Chatbot />}
<img

        alt="bg"

        className="h-full w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"

        src={bg}

      />
<div className="max-w-7xl mx-auto">

        {/* Back Button + Breadcrumb */}
<div className="flex items-center justify-between mb-6">
<button

            onClick={() => navigate(-1)}

            className="group flex items-center gap-2 px-4 py-2 bg-purple-600 bg-opacity-30 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 hover:bg-opacity-50 hover:border-purple-400 transition-all backdrop-blur-sm"
>
<i className="ri-arrow-left-line text-lg group-hover:-translate-x-1 transition-transform"></i>
<span className="font-medium text-sm">Back</span>
</button>
 
          <div className="flex items-center gap-2 text-sm">
<Link to="/" className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors">
<div className="w-8 h-8 rounded-lg bg-purple-600 bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-all">
<i className="ri-home-4-fill text-lg"></i>
</div>
<span className="font-medium uppercase hidden sm:inline">Home</span>
</Link>
<i className="text-xl text-purple-400 ri-arrow-right-s-line"></i>
<Link to="/chat" className="text-purple-300 hover:text-purple-100 transition-colors uppercase hidden sm:inline">

              Astrologers
</Link>
<i className="text-xl text-purple-400 ri-arrow-right-s-line hidden sm:block"></i>
<span className="text-purple-200 font-semibold hidden sm:inline">{data?.name || "Profile"}</span>
</div>
</div>
 
        {/* Main Profile Card */}
<div className="bg-purple-950 bg-opacity-60 backdrop-blur-xl border border-purple-500 border-opacity-30 rounded-3xl p-6 lg:p-10 mb-8 shadow-2xl shadow-purple-500/10">
<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left Side - Profile Image */}
<div className="lg:w-1/3 w-full flex flex-col items-center">
<div className="relative w-full max-w-sm">
<div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
 
                <div className="relative rounded-full overflow-hidden border-4 border-purple-400 border-opacity-50 shadow-2xl">
<img

                    className="w-full h-auto"

                    src={data?.image ? `https://plutoastro-backend.onrender.com${data.image}` : PROFILE_IMG}

                    alt={data?.name}

                  />
<div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent opacity-30"></div>
</div>
 
                {data?.verified && (
<div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
<i className="ri-verified-badge-fill text-3xl text-white"></i>
</div>

                )}
 
                <div className={`absolute bottom-4 right-4 px-4 py-2 rounded-full backdrop-blur-md border border-opacity-50 flex items-center gap-2 ${data?.status === "online"

                    ? "bg-green-500 bg-opacity-90 border-green-400"

                    : data?.status === "busy"

                      ? "bg-yellow-500 bg-opacity-90 border-yellow-400"

                      : "bg-red-500 bg-opacity-90 border-red-400"

                  }`}>
<div className={`w-2 h-2 rounded-full ${data?.status === "online" ? "bg-white animate-pulse" : "bg-white"}`}></div>
<span className="text-white font-semibold capitalize text-sm">

                    {data?.status || "offline"}
</span>
</div>
</div>

                {/* Follow Button */}
<div className="mt-8 w-full">

                {!follow ? (
<button

                    className="w-full group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all overflow-hidden"

                    onClick={() => handlefollow(data)}
>
<div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
<span className="relative flex items-center justify-center gap-2">
<i className="ri-user-follow-line text-xl"></i>

                      Follow Astrologer
</span>
</button>

                ) : (

                   <button

                    className="w-full group relative px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl text-white font-bold text-lg shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105 transition-all"

                    onClick={() => handleUnfollow()}
>
<span className="flex items-center justify-center gap-2">
<i className="ri-user-unfollow-line text-xl"></i>

                      Unfollow
</span>
</button>

                )}
</div>
</div>

   {/* Right Side - Profile Info */}
<div className="lg:w-2/3 w-full space-y-6">
<div className="space-y-3">
<h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">

                  {data?.name || "N/A"}
</h1>

                {data?.skills && data.skills.length > 0 && (
<div className="flex flex-wrap gap-2">

                    {data.skills.map((skill, index) => (
<span

                        key={index}

                        className="px-4 py-2 bg-purple-600 bg-opacity-30 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 text-sm font-medium backdrop-blur-sm"
>

                        {skill}
</span>

                    ))}
</div>

                )}
</div>

               {/* Stats Grid */}
<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
<div className="bg-purple-900 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-4 hover:border-purple-400 transition-all">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
<i className="ri-shake-hands-fill text-2xl text-white"></i>
</div>
<div>
<p className="text-purple-300 text-xs uppercase font-semibold">Experience</p>
<p className="text-white font-bold text-lg">{data?.experience || 0} Years</p>
</div>
</div>
</div>
 
                <div className="bg-purple-900 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-4 hover:border-purple-400 transition-all">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
<i className="ri-money-rupee-circle-fill text-2xl text-white"></i>
</div>
<div>
<p className="text-purple-300 text-xs uppercase font-semibold">Price</p>
<p className="text-white font-bold text-lg">₹{data?.pricePerMinute || 0}/min</p>
</div>
</div>
</div>
 
                <div className="bg-purple-900 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-4 hover:border-purple-400 transition-all">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
<i className="ri-star-fill text-2xl text-white"></i>
</div>
<div>
<p className="text-purple-300 text-xs uppercase font-semibold">Rating</p>
<p className="text-white font-bold text-lg">{data?.rating || 5}/5</p>
</div>
</div>
</div>
</div>

    {/* Duration Stats */}
<div className="flex flex-wrap gap-6">
<div className="flex items-center gap-3 bg-purple-900 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl px-6 py-4">
<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
<i className="ri-question-answer-fill text-3xl text-white"></i>
</div>
<div>
<p className="text-purple-300 text-sm">Chat Duration</p>
<p className="text-white font-bold text-2xl">{data?.totalCallDurationInMin || 120} mins</p>
</div>
</div>
<div className="flex items-center gap-3 bg-purple-900 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl px-6 py-4">
<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
<i className="ri-phone-fill text-3xl text-white"></i>
</div>
<div>
<p className="text-purple-300 text-sm">Call Duration</p>
<p className="text-white font-bold text-2xl">{data?.totalChatDurationInMin || 80} mins</p>
</div>
</div>
</div>
 
              {/* CTA Buttons */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
<button

                  onClick={(e) => handleStartChat(e)}

                  className="group text-left w-full"
>
<div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 hover:scale-105 transition-all shadow-lg shadow-purple-500/30">
<div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
<div className="relative flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center">
<i className="ri-chat-1-fill text-4xl text-white"></i>
</div>
<div>
<h3 className="text-white font-bold text-xl">Start Chat</h3>
<p className="text-purple-200 text-sm">Wait time - 2-3m</p>
</div>
</div>
<i className="ri-arrow-right-line text-2xl text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
</div>
</div>
</button>
 
                <button

                  onClick={(e) => handleStartCall(e)}

                  className="group text-left w-full"
>
<div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-pink-800 rounded-2xl p-6 hover:scale-105 transition-all shadow-lg shadow-pink-500/30">
<div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
<div className="relative flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center">
<i className="ri-phone-fill text-4xl text-white"></i>
</div>
<div>
<h3 className="text-white font-bold text-xl">Start Call</h3>
<p className="text-pink-200 text-sm">Wait time - 2m</p>
</div>
</div>
<i className="ri-arrow-right-line text-2xl text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
</div>
</div>
</button>
</div>
</div>
</div>
</div>
 
        {/* Bottom Section */}
<AstroProfileBottom data={data} />
</div>
 
      {/* RECHARGE MODAL */}

      {showRecharge && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4">
<div className="bg-zinc-950 border-2 border-purple-800 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-purple-800/50">
<h2 className="text-2xl font-bold text-purple-200 mb-2">

              💰 Insufficient Balance
</h2>
<p className="text-gray-300 mb-1">

              Available:{" "}
<span className="text-red-400 font-semibold">₹{walletBalance}</span>
</p>
<p className="text-gray-300 mb-6">

              Required:{" "}
<span className="text-green-400 font-semibold">₹{requiredAmount}/min</span>
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

                onClick={() => {

                  setShowRecharge(false);

                  setPendingAction(null);

                }}

                className="px-6 py-3 border-2 border-purple-800 rounded-xl text-purple-300 hover:bg-purple-900 transition-all"
>

                Cancel
</button>
</div>
 
            <p className="text-gray-500 text-xs mt-4 text-center">

              🔒 Secured by Razorpay
</p>
</div>
</div>

      )}
 
      {/* PRE-CHAT FORM MODAL */}

      {showPreChatForm && (
<PreChatForm

          onSubmit={handleFormSubmit}

          astrologerName={data?.name}

          onClose={() => setShowPreChatForm(false)}

        />

      )}
 
      {/* WAITING SCREEN */}

      {waitingTime !== null && (
<div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
<div className="bg-[#1b1b2f] rounded-2xl p-8 max-w-md w-full text-center border border-purple-600">
<div className="text-6xl mb-4 animate-bounce">🔮</div>
<h2 className="text-2xl font-bold text-white mb-2">

              {waitingAstrologer} Joining...
</h2>
<p className="text-gray-400 mb-4">

              Astrologer join karte hi chat turant khul jayegi
</p>
 
            <div className="text-4xl font-bold text-purple-400 mb-6">

              {Math.floor(waitingTime / 60)}:{String(waitingTime % 60).padStart(2, "0")}
</div>
 
            <div className="w-full bg-purple-900 bg-opacity-40 rounded-full h-2">
<div

                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse"

                style={{ width: "100%" }}

              />
</div>
</div>
</div>

      )}
</div>

  );

};
 
export default AstroProfile;
 
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

const AstroProfile = () => {
  const [follow, setfollow] = useState(false);
  const navigate = useNavigate(); // ← Add this

  const { id } = useParams();
  useAstroProfile(id);

  const dispatch = useDispatch();

  const Bot = useSelector((store) => store.configApp.Bot);
  const astroProfile = useSelector((store) => store.astro.astroProfile);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    console.log("Astro Profile Data:", astroProfile);
    console.log("Profile ID:", id);
  }, [astroProfile, id]);

  if (!astroProfile) {
    return <ShimmerProfile />;
  }

  const data = astroProfile;

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
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 bg-purple-600 bg-opacity-30 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 hover:bg-opacity-50 hover:border-purple-400 transition-all backdrop-blur-sm"
          >
            <i className="ri-arrow-left-line text-lg group-hover:-translate-x-1 transition-transform"></i>
            <span className="font-medium text-sm">Back</span>
          </button>

          {/* Breadcrumb */}
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
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                
                {/* Profile Image Container */}
                <div className="relative rounded-full overflow-hidden border-4 border-purple-400 border-opacity-50 shadow-2xl">
                  <img
                    className="w-full h-auto"
                    src={data?.image ? `http://http://plutoastro-api.onrender.com${data.image}` : PROFILE_IMG}
                    alt={data?.name}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent opacity-30"></div>
                </div>

                {/* Verified Badge */}
                {data?.verified && (
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <i className="ri-verified-badge-fill text-3xl text-white"></i>
                  </div>
                )}

                {/* Online Status */}
                <div className={`absolute bottom-4 right-4 px-4 py-2 rounded-full backdrop-blur-md border border-opacity-50 flex items-center gap-2 ${
                  data?.status === "online" 
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
              {/* Name & Skills */}
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
                <Link to={`/astrologerschat/${data?.name}`} className="group">
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 hover:scale-105 transition-all shadow-lg shadow-purple-500/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center">
                          <i className="ri-chat-1-fill text-4xl text-white"></i>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-xl">Start Chat</h3>
                          <p className="text-purple-200 text-sm">Wait time - 2m</p>
                        </div>
                      </div>
                      <i className="ri-arrow-right-line text-2xl text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
                    </div>
                  </div>
                </Link>

                <Link to="/astrologerscall" className="group">
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
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <AstroProfileBottom data={data} />
      </div>
    </div>
  );
};

export default AstroProfile;
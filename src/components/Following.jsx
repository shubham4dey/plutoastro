import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_IMG } from "../utils/constants";
import { clearFollow, removeFollow } from "../store/followSlice";
import { Link } from "react-router-dom";
import bg from "../image/bg1.jpg";
import Chatbot from "./Chatbot";
import panditphone from "../image/pandit showing phone screen.png";
import panditwelcome from "../image/pandit welcome.webp";
import lang from "../utils/langConstants";

const Following = () => {
  const dispatch = useDispatch();

  const data = useSelector((store) => store.follow.follow);
  const Bot = useSelector((store) => store.configApp.Bot);
  const LangKey = useSelector((store) => store.configApp.lang);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all followed astrologers?")) {
      dispatch(clearFollow());
    }
  };

  const handleUnfollow = (astrologer) => {
    dispatch(removeFollow(astrologer));
  };

  return (
    <div className="relative min-h-screen w-full">
      {Bot && <Chatbot />}
      <img
        alt="bg"
        className="h-full w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"
        src={bg}
      />

      <div className="pt-28 lg:pt-36 px-4 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-600 bg-opacity-20 border border-purple-500 text-purple-300 text-sm font-medium mb-4">
              👥 Your Connections
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4">
              Following
            </h1>
            <p className="text-lg text-purple-200 opacity-80 max-w-2xl mx-auto">
              {data.length > 0 
                ? `You're following ${data.length} astrologer${data.length > 1 ? 's' : ''}`
                : "Start following astrologers to stay connected"}
            </p>
          </div>

          {/* Empty State */}
          {data.length === 0 && (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="flex flex-col justify-center items-center w-full max-w-md">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <img 
                    alt="unfollow" 
                    className="relative lg:w-[400px] w-72 z-10 drop-shadow-2xl" 
                    src={panditphone}
                  />
                </div>
                <span className="text-2xl lg:text-3xl text-purple-200 font-semibold tracking-wide mb-4 text-center">
                  {lang[LangKey].notfollowing}
                </span>
                <p className="text-purple-300 opacity-80 text-center mb-8">
                  Discover and connect with expert astrologers
                </p>
                <Link to="/call">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all">
                    <span className="flex items-center gap-2">
                      <i className="ri-compass-discover-line text-xl"></i>
                      {lang[LangKey].expFollow}
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Following List */}
          {data.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Left Side - Image */}
              <div className="lg:w-1/3 w-full hidden lg:flex flex-col items-center justify-center sticky top-36">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <img 
                    className="relative w-full max-w-md z-10 drop-shadow-2xl" 
                    src={panditwelcome} 
                    alt="follow"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-purple-300 text-sm opacity-80">
                    Stay connected with your favorite astrologers
                  </p>
                </div>
              </div>

              {/* Right Side - List */}
              <div className="lg:w-2/3 w-full">
                {/* Header Card */}
                <div className="bg-purple-950 bg-opacity-60 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-3xl p-6 mb-6 sticky top-28 z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <i className="ri-user-follow-line text-2xl text-white"></i>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-purple-200">
                          {lang[LangKey].following}
                        </span>
                        <p className="text-sm text-purple-300 opacity-80">
                          {data.length} astrologer{data.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="group px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl text-red-300 hover:bg-opacity-30 transition-all flex items-center gap-2"
                      onClick={handleClear}
                    >
                      <i className="ri-delete-bin-line group-hover:scale-110 transition-transform"></i>
                      <span className="hidden sm:inline">{lang[LangKey].clearFollow}</span>
                    </button>
                  </div>
                </div>

                {/* Astrologers List */}
                <div className="space-y-4">
                  {data?.map((astrologer, index) => (
                    <div 
                      key={astrologer._id} 
                      className="group bg-purple-950 bg-opacity-60 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-6 hover:border-purple-400 hover:bg-opacity-70 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Left Side - Profile Info */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Profile Image */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <img
                              className="relative w-20 h-20 rounded-full border-2 border-purple-400 border-opacity-50 object-cover"
                              alt={astrologer.name}
                              src={
                                astrologer.image
                                  ? `http://localhost:5000${astrologer.image}`
                                  : PROFILE_IMG
                              }
                            />
                            {astrologer.status === "online" && (
                              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-purple-950 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>

                          {/* Profile Details */}
                          <Link to={`/astroProfile/${astrologer._id}`} className="flex-1">
                            <div className="space-y-2">
                              <h3 className="text-xl lg:text-2xl font-bold text-purple-200 group-hover:text-purple-100 transition-colors">
                                {astrologer.name}
                              </h3>
                              
                              {astrologer.skills && astrologer.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {astrologer.skills.slice(0, 3).map((skill, idx) => (
                                    <span 
                                      key={idx}
                                      className="px-3 py-1 bg-purple-600 bg-opacity-30 border border-purple-500 border-opacity-40 rounded-full text-xs text-purple-200"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {astrologer.skills.length > 3 && (
                                    <span className="px-3 py-1 text-xs text-purple-300">
                                      +{astrologer.skills.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-sm text-purple-300">
                                {astrologer.experience && (
                                  <span className="flex items-center gap-1">
                                    <i className="ri-award-line"></i>
                                    {astrologer.experience} years exp
                                  </span>
                                )}
                                {astrologer.rating && (
                                  <span className="flex items-center gap-1">
                                    <i className="ri-star-fill text-yellow-400"></i>
                                    {astrologer.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <Link 
                            to={`/astroProfile/${astrologer._id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 bg-opacity-30 border border-purple-500 border-opacity-50 rounded-xl text-purple-200 hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                              <i className="ri-eye-line"></i>
                              <span className="hidden sm:inline">View</span>
                            </button>
                          </Link>
                          
                          <button
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl text-red-300 hover:bg-opacity-30 transition-all flex items-center justify-center gap-2"
                            onClick={() => handleUnfollow(astrologer)}
                          >
                            <i className="ri-user-unfollow-line"></i>
                            <span className="hidden sm:inline">{lang[LangKey].unfollow}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Stats */}
                <div className="mt-8 bg-purple-950 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-20 rounded-2xl p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {data.length}
                      </div>
                      <div className="text-sm text-purple-300 opacity-80">Following</div>
                    </div>
                    <div>
                      <div className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                        {data.filter(a => a.status === "online").length}
                      </div>
                      <div className="text-sm text-purple-300 opacity-80">Online</div>
                    </div>
                    <div>
                      <div className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                        {data.filter(a => a.rating >= 4.5).length}
                      </div>
                      <div className="text-sm text-purple-300 opacity-80">Top Rated</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Following;
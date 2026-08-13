import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AstrologersGrid = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      setHasError(false);
      
      console.log("🔄 Fetching astrologers...");
      
      const response = await fetch("http://localhost:5000/api/astrologers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Backend response:", data);

      // Handle different response structures
      let astrologerList = [];
      
      if (data.success && data.astrologers) {
        astrologerList = data.astrologers;
      } else if (data.data) {
        astrologerList = data.data;
      } else if (Array.isArray(data)) {
        astrologerList = data;
      } else {
        console.warn("⚠️ Unexpected data format:", data);
        astrologerList = [];
      }

      console.log(`📊 Total astrologers found: ${astrologerList.length}`);

      // If we have data, show top 10
      if (astrologerList.length > 0) {
        const topAstrologers = astrologerList
          .filter((astro) => (astro.rating || 0) >= 4.0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 10);
        
        console.log(`⭐ Top astrologers: ${topAstrologers.length}`);
        setAstrologers(topAstrologers);
      }
      // If no data, keep existing state (don't clear it)
      
    } catch (error) {
      console.error("❌ Error fetching astrologers:", error);
      setHasError(true);
      
      // DON'T clear astrologers - keep showing cached data
      // setAstrologers([]); // ← YE LINE HATA DIYA
    } finally {
      setLoading(false);
    }
  };

  // Always show section - even if loading or error
  return (
    <div className="relative w-full py-16 lg:py-20">
      <div className="px-4 lg:px-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Header - ALWAYS SHOW */}
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-600 bg-opacity-20 border border-purple-500 text-purple-300 text-sm font-medium mb-4">
              ✨ Expert Astrologers
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 mb-4">
              Our Astrologers
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
            <p className="text-purple-200 text-lg">
              <span className="font-bold text-yellow-400">13000+</span> Best Astrologers from India for Online Consultation
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-purple-950 bg-opacity-60 backdrop-blur-xl border border-purple-500 border-opacity-30 rounded-2xl p-6 animate-pulse">
                  <div className="w-32 h-32 mx-auto bg-purple-800 bg-opacity-60 rounded-full mb-4"></div>
                  <div className="h-4 bg-purple-800 bg-opacity-60 rounded mb-2 w-3/4 mx-auto"></div>
                  <div className="h-3 bg-purple-800 bg-opacity-60 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message (but still show cards if we have them) */}
          {hasError && astrologers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-purple-950 bg-opacity-60 backdrop-blur-xl border border-purple-500 border-opacity-40 rounded-full flex items-center justify-center mb-6">
                <i className="ri-error-warning-line text-5xl text-red-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-purple-200 mb-3">
                Unable to Load Astrologers
              </h3>
              <p className="text-purple-300 mb-6 max-w-md mx-auto">
                Please make sure the backend server is running on port 5000
              </p>
              <button
                onClick={fetchAstrologers}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:scale-105 transition-all shadow-lg shadow-purple-500/30"
              >
                <i className="ri-refresh-line mr-2"></i>
                Try Again
              </button>
            </div>
          )}

          {/* Astrologers Grid - SHOW IF WE HAVE DATA */}
          {!loading && astrologers.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
                {astrologers.map((astrologer, index) => (
                  <Link
                    key={astrologer._id}
                    to={`/astroProfile/${astrologer._id}`}
                    className="group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative bg-purple-950 bg-opacity-60 backdrop-blur-xl border border-purple-500 border-opacity-30 rounded-2xl p-6 hover:border-purple-400 hover:bg-opacity-80 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                      
                      {/* Profile Image */}
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-400 border-opacity-50">
                          <img
  src={
    astrologer.image
      ? astrologer.image.startsWith("http")
        ? astrologer.image
        : `http://localhost:5000${astrologer.image}`
      : "https://via.placeholder.com/150"
  }
  alt={astrologer.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    console.log("❌ Image Error:", astrologer.image);

    e.target.src =
      "https://via.placeholder.com/150?text=Astrologer";
  }}
/>
                        </div>
                        
                        {/* Online Status */}
                        {astrologer.status === "online" && (
                          <div className="absolute bottom-0 right-1/2 transform translate-x-16 w-4 h-4 bg-green-500 rounded-full border-2 border-purple-950">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>

                      {/* Rating Stars */}
                      <div className="flex justify-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`ri-star-fill text-lg ${
                              i < Math.floor(astrologer.rating || 5)
                                ? "text-yellow-400"
                                : "text-purple-600"
                            }`}
                          ></i>
                        ))}
                      </div>

                      {/* Name */}
                      <h3 className="text-lg font-bold text-purple-100 text-center mb-1 group-hover:text-white transition-colors">
                        {astrologer.name?.toUpperCase()}
                      </h3>

                      {/* Specialization */}
                      <p className="text-purple-300 text-sm text-center mb-3">
                        {astrologer.skills?.slice(0, 2).join(", ") || "Vedic Astrologer"}
                      </p>

                      {/* Price Tag */}
                      <div className="flex justify-center mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-semibold">
                          ₹{astrologer.pricePerMinute || 10}/min
                        </span>
                      </div>

                      {/* Experience Badge */}
                      {astrologer.experience && (
                        <div className="flex justify-center items-center gap-1 text-purple-300 text-xs">
                          <i className="ri-award-line text-yellow-400"></i>
                          <span>{astrologer.experience} Years Exp.</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-purple-500/30"
                >
                  View All Astrologers
                  <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AstrologersGrid;
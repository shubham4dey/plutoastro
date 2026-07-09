import React from "react";

const SpecialtiesBanner = () => {
  const specialties = [
    "Western Astrology",
    "Vedic Astrology",
    "Tarot Reading",
    "Numerology",
    "Palmistry",
    "Face Reading",
    "Crystal Healing",
    "Reiki Healing",
    "Twin Flame",
    "Nadi Astrology",
    "Vastu Shastra",
    "Kundli Matching",
    "Career Astrology",
    "Love Astrology",
    "Marriage Astrology",
    "Gemstone Consultation",
  ];

  const languages = [
    { name: "English", script: "English" },
    { name: "French", script: "Français" },
    { name: "German", script: "Deutsch" },
    { name: "Italian", script: "Italiano" },
    { name: "Spanish", script: "Español" },
    { name: "Portuguese", script: "Português" },
    { name: "Dutch", script: "Nederlands" },
    { name: "Hindi", script: "हिन्दी" },
    { name: "Tamil", script: "தமிழ்" },
    { name: "Telugu", script: "తెలుగు" },
    { name: "Bengali", script: "বাংলা" },
    { name: "Marathi", script: "मराठी" },
    { name: "Gujarati", script: "ગુજરાતી" },
    { name: "Kannada", script: "ಕನ್ನಡ" },
    { name: "Malayalam", script: "മലയാളം" },
    { name: "Punjabi", script: "ਪੰਜਾਬੀ" },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 via-transparent to-fuchsia-950/20"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Horizontal Glow Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Premium Heading with Glow */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-4 mb-4 px-8 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-900/20">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <h3 className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300">
              16 Languages
            </h3>
            <span className="text-fuchsia-500 text-2xl">✦</span>
            <h3 className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300">
              40+ Specialties
            </h3>
            <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></span>
          </div>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
        </div>

        {/* Specialties Marquee - Top Row with Glass Effect */}
        <div className="relative mb-16 group">
          {/* Glass Container */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/30 via-purple-900/20 to-fuchsia-950/30 rounded-2xl backdrop-blur-sm border border-purple-700/20"></div>
          
          <div className="relative flex overflow-hidden py-4">
            <div className="flex animate-marquee-left whitespace-nowrap">
              {[...specialties, ...specialties, ...specialties].map((specialty, index) => (
                <div
                  key={index}
                  className="flex items-center mx-8 group/specialty cursor-pointer"
                >
                  <span className="text-purple-200/90 text-lg lg:text-2xl font-medium group-hover/specialty:text-white group-hover/specialty:scale-110 transition-all duration-300 drop-shadow-lg">
                    {specialty}
                  </span>
                  <span className="mx-8 text-fuchsia-500/60 text-3xl group-hover/specialty:text-fuchsia-400 transition-colors duration-300">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Languages Marquee - Bottom Row with Glass Effect */}
        <div className="relative group">
          {/* Glass Container */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-950/30 via-fuchsia-900/20 to-purple-950/30 rounded-2xl backdrop-blur-sm border border-fuchsia-700/20"></div>
          
          <div className="relative flex overflow-hidden py-4">
            <div className="flex animate-marquee-right whitespace-nowrap">
              {[...languages, ...languages, ...languages].map((lang, index) => (
                <div
                  key={index}
                  className="flex items-center mx-8 group/lang cursor-pointer"
                >
                  <span className="text-fuchsia-300/90 text-lg lg:text-2xl font-medium group-hover/lang:text-white group-hover/lang:scale-110 transition-all duration-300 drop-shadow-lg">
                    {lang.script}
                  </span>
                  <span className="mx-8 text-purple-500/60 text-2xl group-hover/lang:text-purple-400 transition-colors duration-300">
                    •
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Glow Line */}
        <div className="mt-16 w-full h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent"></div>
      </div>

      {/* Custom CSS for Marquee Animation */}
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left 35s linear infinite;
        }
        
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
        }
        
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default SpecialtiesBanner;
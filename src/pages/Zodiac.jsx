import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../image/newbg.jpg";

const Zodiac = () => {
  const [selectedSign, setSelectedSign] = useState(null);

  const zodiacSigns = [
    {
      name: "Aries",
      sanskritName: "Mesha",
      symbol: "",
      dates: "Mar 21 - Apr 19",
      element: "Fire",
      rulingPlanet: "Mars",
      quality: "Cardinal",
      luckyColor: "Red",
      luckyNumber: 1,
      strength: "Courageous, determined, confident",
      weakness: "Impulsive, impatient, moody",
      description: "Aries is the first sign of the zodiac, representing new beginnings. They are natural leaders with boundless energy and enthusiasm.",
      icon: ""
    },
    {
      name: "Taurus",
      sanskritName: "Vrishabha",
      symbol: "♉",
      dates: "Apr 20 - May 20",
      element: "Earth",
      rulingPlanet: "Venus",
      quality: "Fixed",
      luckyColor: "Green",
      luckyNumber: 6,
      strength: "Reliable, patient, practical",
      weakness: "Stubborn, possessive, uncompromising",
      description: "Taurus is known for their grounded nature and love for luxury. They are dependable and value stability and comfort.",
      icon: "♉"
    },
    {
      name: "Gemini",
      sanskritName: "Mithuna",
      symbol: "♊",
      dates: "May 21 - Jun 20",
      element: "Air",
      rulingPlanet: "Mercury",
      quality: "Mutable",
      luckyColor: "Yellow",
      luckyNumber: 5,
      strength: "Gentle, affectionate, curious",
      weakness: "Nervous, inconsistent, indecisive",
      description: "Gemini is the communicator of the zodiac. They are versatile, witty, and love to learn and share knowledge.",
      icon: "♊"
    },
    {
      name: "Cancer",
      sanskritName: "Karka",
      symbol: "♋",
      dates: "Jun 21 - Jul 22",
      element: "Water",
      rulingPlanet: "Moon",
      quality: "Cardinal",
      luckyColor: "White",
      luckyNumber: 2,
      strength: "Tenacious, highly imaginative, loyal",
      weakness: "Moody, pessimistic, suspicious",
      description: "Cancer is deeply intuitive and emotional. They are nurturing and protective of their loved ones.",
      icon: "♋"
    },
    {
      name: "Leo",
      sanskritName: "Simha",
      symbol: "♌",
      dates: "Jul 23 - Aug 22",
      element: "Fire",
      rulingPlanet: "Sun",
      quality: "Fixed",
      luckyColor: "Gold",
      luckyNumber: 1,
      strength: "Creative, passionate, generous",
      weakness: "Arrogant, stubborn, self-centered",
      description: "Leo is the natural performer of the zodiac. They are confident, charismatic, and love to be in the spotlight.",
      icon: "♌"
    },
    {
      name: "Virgo",
      sanskritName: "Kanya",
      symbol: "♍",
      dates: "Aug 23 - Sep 22",
      element: "Earth",
      rulingPlanet: "Mercury",
      quality: "Mutable",
      luckyColor: "Brown",
      luckyNumber: 5,
      strength: "Loyal, analytical, kind",
      weakness: "Critical, fussy, all work no play",
      description: "Virgo is known for their attention to detail and practical approach. They are helpful and perfectionists.",
      icon: "♍"
    },
    {
      name: "Libra",
      sanskritName: "Tula",
      symbol: "♎",
      dates: "Sep 23 - Oct 22",
      element: "Air",
      rulingPlanet: "Venus",
      quality: "Cardinal",
      luckyColor: "Pink",
      luckyNumber: 6,
      strength: "Diplomatic, gracious, fair-minded",
      weakness: "Indecisive, avoids confrontations, carries grudges",
      description: "Libra is the sign of balance and harmony. They are social, charming, and seek justice in all things.",
      icon: "♎"
    },
    {
      name: "Scorpio",
      sanskritName: "Vrishchika",
      symbol: "♏",
      dates: "Oct 23 - Nov 21",
      element: "Water",
      rulingPlanet: "Pluto/Mars",
      quality: "Fixed",
      luckyColor: "Maroon",
      luckyNumber: 9,
      strength: "Resourceful, brave, stubborn",
      weakness: "Distrusting, jealous, secretive",
      description: "Scorpio is intense and powerful. They are deeply emotional, passionate, and transformative.",
      icon: "♏"
    },
    {
      name: "Sagittarius",
      sanskritName: "Dhanu",
      symbol: "♐",
      dates: "Nov 22 - Dec 21",
      element: "Fire",
      rulingPlanet: "Jupiter",
      quality: "Mutable",
      luckyColor: "Purple",
      luckyNumber: 3,
      strength: "Generous, idealistic, great sense of humor",
      weakness: "Promises more than can deliver, impatient, tactless",
      description: "Sagittarius is the adventurer of the zodiac. They love freedom, travel, and philosophical discussions.",
      icon: "♐"
    },
    {
      name: "Capricorn",
      sanskritName: "Makara",
      symbol: "♑",
      dates: "Dec 22 - Jan 19",
      element: "Earth",
      rulingPlanet: "Saturn",
      quality: "Cardinal",
      luckyColor: "Brown",
      luckyNumber: 8,
      strength: "Responsible, disciplined, self-control",
      weakness: "Know-it-all, unforgiving, condescending",
      description: "Capricorn is ambitious and disciplined. They are practical and work hard to achieve their goals.",
      icon: "♑"
    },
    {
      name: "Aquarius",
      sanskritName: "Kumbha",
      symbol: "♒",
      dates: "Jan 20 - Feb 18",
      element: "Air",
      rulingPlanet: "Uranus",
      quality: "Fixed",
      luckyColor: "Blue",
      luckyNumber: 4,
      strength: "Progressive, original, independent",
      weakness: "Runs from emotional expression, temperamental, uncompromising",
      description: "Aquarius is the innovator of the zodiac. They are humanitarian, unique, and forward-thinking.",
      icon: ""
    },
    {
      name: "Pisces",
      sanskritName: "Meena",
      symbol: "♓",
      dates: "Feb 19 - Mar 20",
      element: "Water",
      rulingPlanet: "Neptune",
      quality: "Mutable",
      luckyColor: "Sea Green",
      luckyNumber: 7,
      strength: "Compassionate, artistic, intuitive",
      weakness: "Overly trusting, sad, desire to escape reality",
      description: "Pisces is the dreamer of the zodiac. They are deeply spiritual, compassionate, and imaginative.",
      icon: "♓"
    }
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* ✅ FIXED BACKGROUND IMAGE */}
      <img
        alt="bg"
        className="fixed top-0 left-0 w-full h-screen object-cover brightness-50 -z-40"
        src={bg}
      />

      {/* ✅ CONTENT WRAPPER - pt-40 for proper header clearance */}
      <div className="relative z-10 pt-40 pb-20 px-4 lg:px-8">
        
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
            The 12 Zodiac Signs
          </h1>
          <p className="text-lg md:text-xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed">
            Discover the ancient wisdom of astrology. Each zodiac sign carries unique characteristics, 
            strengths, and cosmic influences that shape your personality and destiny.
          </p>
        </div>

        {/* Zodiac Grid - All Purple Theme */}
        <div className="max-w-7xl mx-auto pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {zodiacSigns.map((sign, index) => (
              <div
                key={sign.name}
                onClick={() => setSelectedSign(selectedSign === index ? null : index)}
                className={`group relative cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                  selectedSign === index ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                {/* ✅ Purple Theme Card */}
                <div className="h-full bg-purple-900/40 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-500 overflow-hidden">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  <div className="relative z-10">
                    {/* Sign Symbol & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl text-purple-300">{sign.symbol}</span>
                      <span className="text-5xl">{sign.icon}</span>
                    </div>

                    {/* Sign Name */}
                    <h3 className="text-2xl font-bold mb-1 text-white">{sign.name}</h3>
                    <p className="text-purple-300/70 text-sm mb-3">{sign.sanskritName}</p>

                    {/* Quick Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-300/60">Dates:</span>
                        <span className="text-white font-medium">{sign.dates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300/60">Element:</span>
                        <span className="text-purple-200 font-medium">{sign.element}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300/60">Planet:</span>
                        <span className="text-purple-200 font-medium">{sign.rulingPlanet}</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedSign === index && (
                      <div className="mt-6 pt-6 border-t border-purple-500/30 animate-fadeIn">
                        <p className="text-purple-100/90 mb-4 leading-relaxed">
                          {sign.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-fuchsia-300 mb-1">Strengths:</h4>
                            <p className="text-sm text-purple-200/70">{sign.strength}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-fuchsia-300 mb-1">Weaknesses:</h4>
                            <p className="text-sm text-purple-200/70">{sign.weakness}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="bg-purple-900/60 rounded-lg p-3 border border-purple-700/30">
                              <p className="text-xs text-purple-300/60">Lucky Color</p>
                              <p className="text-sm font-semibold text-white">{sign.luckyColor}</p>
                            </div>
                            <div className="bg-purple-900/60 rounded-lg p-3 border border-purple-700/30">
                              <p className="text-xs text-purple-300/60">Lucky Number</p>
                              <p className="text-sm font-semibold text-white">{sign.luckyNumber}</p>
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/horoscope/daily/${sign.name.toLowerCase()}`}
                          className="mt-6 block w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-center font-semibold hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-purple-600/30"
                        >
                          View Daily Horoscope →
                        </Link>
                      </div>
                    )}

                    {/* Click Hint */}
                    {selectedSign !== index && (
                      <div className="mt-4 text-center text-xs text-purple-300/50 group-hover:text-purple-300 transition-colors">
                        Click to know more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elements Section - Purple Theme */}
        <div className="max-w-6xl mx-auto py-16 border-t border-purple-800/30">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
            The Four Elements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Fire", signs: "Aries, Leo, Sagittarius", desc: "Passionate, energetic, enthusiastic", icon: "🔥" },
              { name: "Earth", signs: "Taurus, Virgo, Capricorn", desc: "Practical, grounded, reliable", icon: "" },
              { name: "Air", signs: "Gemini, Libra, Aquarius", desc: "Intellectual, communicative, social", icon: "💨" },
              { name: "Water", signs: "Cancer, Scorpio, Pisces", desc: "Emotional, intuitive, compassionate", icon: "💧" }
            ].map((element) => (
              <div key={element.name} className="group relative">
                {/* ✅ Purple Theme Card */}
                <div className="h-full bg-purple-900/40 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                  <div className="text-center">
                    <span className="text-5xl mb-4 block">{element.icon}</span>
                    <h3 className="text-2xl font-bold mb-2 text-white">{element.name}</h3>
                    <p className="text-sm text-purple-200/70 mb-3">{element.signs}</p>
                    <p className="text-xs text-purple-300/60">{element.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Zodiac;
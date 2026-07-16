import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Pooja Tiwari",
      location: "Pune",
      rating: 5,
      avatar: "👤",
      text: "Consulted an Astrologer for child name's based on nakshatras. The service was good at a reasonable price and they were very helpful..."
    },
    {
      id: 2,
      name: "Karishma Chogle",
      location: "Delhi",
      rating: 5,
      avatar: "👤",
      text: "I was recommended this app by my friend because of his good experience with an Astrologer. I was sceptical about..."
    },
    {
      id: 3,
      name: "Pinki Agarwalla",
      location: "Mumbai",
      rating: 5,
      avatar: "👤",
      text: "I was not getting married and felt depressed. One day I installed AstroTalk and took their live sessions. The astrologer..."
    },
    {
      id: 4,
      name: "Mukund Talashilkar",
      location: "Pune",
      rating: 5,
      avatar: "👤",
      text: "Not only this app provides me with a free daily horoscope but also helps me resolve my personal and professional queries in..."
    },
    {
      id: 5,
      name: "Gurdeep Chawla",
      location: "Muscat, Oman",
      rating: 5,
      avatar: "",
      text: "So I tried this app a few months ago and I was impressed with the first answer I got. The manner in which they explained..."
    },
    {
      id: 6,
      name: "Jullee Patwankar",
      location: "New Jersey, USA",
      rating: 5,
      avatar: "👤",
      text: "Just an amazing app and I would recommend this app to everyone. I have used other apps too but this one is truly special..."
    },
    {
      id: 7,
      name: "Abhiuday Chandra",
      location: "Berlin, Germany",
      rating: 5,
      avatar: "👤",
      text: "It's an astonishing application that is the reason I am giving this application 5 stars. Authentic application with experienced..."
    },
    {
      id: 8,
      name: "Amar Thakur",
      location: "Pune",
      rating: 5,
      avatar: "",
      text: "This app helped me to get a job in my dream company. I was stressed about not getting a career opportunity lately but..."
    },
  ];

  // Triple the testimonials for seamless infinite scroll
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

  const renderStars = (rating) => {
    return Array(rating)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-400 text-xs">★</span>
      ));
  };

  return (
    <section className="relative w-full py-12 lg:py-24 overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-16 px-4">
          <span className="inline-block px-4 py-1 lg:px-6 lg:py-2 text-[10px] lg:text-xs font-semibold text-purple-300 tracking-[0.2em] lg:tracking-[0.3em] uppercase mb-4 lg:mb-6">
            WHAT PEOPLE SAY
          </span>
          <h2 className="text-3xl lg:text-5xl xl:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight px-2">
            Stories from the other side of<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400">
              the chat.
            </span>
          </h2>
          <div className="w-20 lg:w-32 h-0.5 lg:h-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 mx-auto rounded-full"></div>
        </div>

        {/* Infinite Scroll Container - Full Width */}
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Masks - Responsive */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none"></div>

          {/* Scrolling Track */}
          <div 
            className={`flex gap-3 sm:gap-4 lg:gap-6 ${isPaused ? 'paused' : ''}`}
            style={{
              width: 'fit-content',
              animation: isPaused ? 'none' : 'scroll 25s linear infinite'
            }}
          >
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-72 sm:w-80 lg:w-96"
              >
                <div className="h-full bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-fuchsia-900/60 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-purple-600/30 p-4 lg:p-8 hover:border-purple-500/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/50">
                  {/* User Info */}
                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm sm:text-base lg:text-lg group-hover:text-purple-300 transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-purple-300/70 text-xs sm:text-sm flex items-center gap-1">
                        <i className="ri-map-pin-line text-xs"></i>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-3 lg:mb-5">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Review Text */}
                  <div className="relative p-3 lg:p-5 bg-purple-950/40 rounded-xl lg:rounded-2xl border border-purple-700/30 group-hover:border-purple-500/50 transition-all duration-500">
                    <p className="text-purple-100/80 text-xs sm:text-sm leading-relaxed">
                      {testimonial.text}
                    </p>
                    {/* Quote Icon */}
                    <div className="absolute -top-2 -left-1 lg:-top-3 lg:-left-2 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white text-[10px] lg:text-xs opacity-80">
                      "
                    </div>
                  </div>

                  {/* Decorative Dots */}
                  <div className="flex justify-end mt-3 lg:mt-4 gap-1">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500/50 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-fuchsia-500/50 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500/50 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 lg:mt-24 px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto">
            {[
              { number: "50K+", label: "Happy Customers", icon: "👥", color: "from-purple-500 to-fuchsia-500" },
              { number: "4.9", label: "Average Rating", icon: "⭐", color: "from-yellow-500 to-orange-500" },
              { number: "24/7", label: "Support Available", icon: "🕐", color: "from-blue-500 to-cyan-500" },
              { number: "100+", label: "Expert Astrologers", icon: "✨", color: "from-green-500 to-emerald-500" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-fuchsia-900/40 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-purple-600/30 p-4 lg:p-8 text-center hover:border-purple-500/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="relative mb-2 lg:mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  <div className={`relative text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
                
                {/* Number */}
                <div className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 lg:mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-purple-200/70 text-[10px] sm:text-xs lg:text-sm font-medium px-1">
                  {stat.label}
                </div>

                {/* Bottom Glow Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 lg:h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for Infinite Scroll */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .paused {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
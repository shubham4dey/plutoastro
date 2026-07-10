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
    <section className="relative w-full py-24 lg:py-32 overflow-hidden">
      {/* Background - Uses website's cosmic background */}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-4">
          <span className="inline-block px-6 py-2 text-xs font-semibold text-purple-300 tracking-[0.3em] uppercase mb-6">
            WHAT PEOPLE SAY
          </span>
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Stories from the other side of<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400">
              the chat.
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 mx-auto rounded-full"></div>
        </div>

        {/* Infinite Scroll Container - Full Width */}
        <div 
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none"></div>

          {/* Scrolling Track */}
          <div 
            className={`flex gap-6 ${isPaused ? 'paused' : ''}`}
            style={{
              width: 'fit-content',
              animation: isPaused ? 'none' : 'scroll 50s linear infinite'
            }}
          >
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-96 group"
              >
                <div className="h-full bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-fuchsia-900/60 backdrop-blur-xl rounded-3xl border border-purple-600/30 p-8 hover:border-purple-500/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/50">
                  {/* User Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-purple-300/70 text-sm flex items-center gap-1">
                        <i className="ri-map-pin-line text-xs"></i>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Review Text */}
                  <div className="relative p-5 bg-purple-950/40 rounded-2xl border border-purple-700/30 group-hover:border-purple-500/50 transition-all duration-500">
                    <p className="text-purple-100/80 text-sm leading-relaxed">
                      {testimonial.text}
                    </p>
                    {/* Quote Icon */}
                    <div className="absolute -top-3 -left-2 w-8 h-8 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white text-xs opacity-80">
                      "
                    </div>
                  </div>

                  {/* Decorative Dots */}
                  <div className="flex justify-end mt-4 gap-1">
                    <div className="w-2 h-2 bg-purple-500/50 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-fuchsia-500/50 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-purple-500/50 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-24 px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { number: "50K+", label: "Happy Customers", icon: "👥", color: "from-purple-500 to-fuchsia-500" },
              { number: "4.9", label: "Average Rating", icon: "⭐", color: "from-yellow-500 to-orange-500" },
              { number: "24/7", label: "Support Available", icon: "🕐", color: "from-blue-500 to-cyan-500" },
              { number: "100+", label: "Expert Astrologers", icon: "", color: "from-green-500 to-emerald-500" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-fuchsia-900/40 backdrop-blur-xl rounded-3xl border border-purple-600/30 p-8 text-center hover:border-purple-500/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  <div className={`relative text-5xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
                
                {/* Number */}
                <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-purple-200/70 text-sm font-medium">
                  {stat.label}
                </div>

                {/* Bottom Glow Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
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
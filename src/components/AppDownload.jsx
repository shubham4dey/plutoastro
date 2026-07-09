import React from "react";

const AppDownload = () => {
  return (
    <section className="relative py-20 lg:py-32 px-4 lg:px-8 overflow-hidden">
      
      {/* Subtle Background Glow - Minimal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto">
        
        {/* Premium Glass Card */}
        <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-700/30 p-8 lg:p-16 shadow-2xl shadow-purple-900/20">
          
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/50 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-fuchsia-500/50 rounded-br-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <p className="text-purple-300 text-xs font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-purple-500"></span>
                  PLUTOASTRO FOR IOS & ANDROID
                </p>
                <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  India's #1<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400">
                    astrology app.
                  </span>
                  <br />
                  <span className="text-3xl lg:text-5xl text-purple-200/90">
                    Always with you.
                  </span>
                </h2>
                <p className="text-purple-200/80 text-lg leading-relaxed max-w-lg">
                  Chat with astrologers anytime. Get daily horoscopes, free kundli, compatibility reports & muhurat alerts — all in one app.
                </p>
              </div>

              {/* App Store Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-4 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-black transition-all duration-300 border border-purple-700/50 hover:border-purple-400 hover:scale-105"
                >
                  <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Download on the</p>
                    <p className="text-white font-semibold text-lg">App Store</p>
                  </div>
                </a>

                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-4 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-black transition-all duration-300 border border-purple-700/50 hover:border-purple-400 hover:scale-105"
                >
                  <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Get it on</p>
                    <p className="text-white font-semibold text-lg">Google Play</p>
                  </div>
                </a>
              </div>

              {/* Stats - Premium Design */}
              <div className="flex flex-wrap gap-8 pt-6 border-t border-purple-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white">4.5</span>
                      <span className="text-yellow-400 text-sm">/ 5</span>
                    </div>
                    <p className="text-purple-300 text-xs">2M+ reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">120M+</p>
                    <p className="text-purple-300 text-xs">Happy customers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-[3rem] blur-3xl opacity-40"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-[4rem] blur-2xl animate-pulse"></div>
                
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl border-2 border-purple-700/50">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
                  
                  <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-fuchsia-950 rounded-[2.5rem] overflow-hidden w-64 lg:w-80 aspect-[9/19] relative">
                    {/* Phone Screen Content */}
                    <div className="relative h-full p-6 pt-12">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center mb-8 text-white text-xs">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <span>📶</span>
                          <span>📡</span>
                          <span>🔋</span>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="text-center">
                        <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">PlutoAstro</p>
                        <h3 className="text-white text-xl lg:text-2xl font-bold mb-6 leading-tight">
                          India's #1<br/>Astrology App
                        </h3>
                        
                        {/* Crystal Ball with Glow */}
                        <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                          <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-purple-700 rounded-full flex items-center justify-center border-2 border-purple-400/50 shadow-2xl">
                            <span className="text-5xl lg:text-6xl">🔮</span>
                          </div>
                          {/* Floating Stars */}
                          <div className="absolute -top-2 -left-2 text-yellow-300 text-sm animate-bounce">✨</div>
                          <div className="absolute -top-2 -right-2 text-purple-300 text-sm animate-bounce delay-100">⭐</div>
                          <div className="absolute -bottom-2 left-1/2 text-fuchsia-300 text-sm animate-bounce delay-200">✨</div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 text-left bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-700/30">
                          <div className="flex items-center gap-2 text-purple-100 text-sm">
                            <span className="text-green-400">✓</span>
                            <span>Daily Horoscope</span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-100 text-sm">
                            <span className="text-green-400">✓</span>
                            <span>Tarot Reading</span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-100 text-sm">
                            <span className="text-green-400">✓</span>
                            <span>Kundli Matching</span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-100 text-sm">
                            <span className="text-green-400">✓</span>
                            <span>Live Astrologers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
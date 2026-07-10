import { Link } from "react-router-dom";
import logo from "../image/Logo.png";

const Footer = () => {
  const LiCss =
    "font-normal lg:text-sm md:text-sm text-xs text-purple-200/50 hover:text-white hover:translate-x-1.5 transition-all duration-300 cursor-pointer flex items-center gap-2 group/link";
  const titleCss =
    "font-bold lg:text-lg md:text-base text-sm text-white tracking-wide mb-6 relative inline-block";

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black/50 to-fuchsia-950/30"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(purple 1px, transparent 1px), linear-gradient(90deg, purple 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Top Glow Line */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"></div>

      <div className="relative">
        {/* Newsletter Section with 3D Effect */}
        <div className="lg:px-12 md:px-12 px-4 py-20 border-b border-purple-700/20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow"></div>
                <img 
                  alt="logo" 
                  className="lg:w-20 w-16 rounded-full relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" 
                  src={logo}
                />
              </div>
              <h2 className="font-bold lg:text-4xl text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300 tracking-wide">
                PlutoAstro
              </h2>
            </div>
            <p className="text-purple-200/70 text-base lg:text-lg leading-relaxed max-w-3xl mx-auto mb-10">
              Your trusted destination for cosmic guidance. Connect with expert astrologers worldwide and discover personalized insights for your spiritual journey.
            </p>
            
            {/* 3D Newsletter Signup */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-700 animate-gradient"></div>
                <div className="relative flex flex-col sm:flex-row gap-3 p-3 bg-black/50 backdrop-blur-2xl rounded-2xl border border-purple-600/40 transform group-hover:scale-[1.02] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-900/50">
                  <input
                    type="email"
                    placeholder="Enter your email for cosmic updates & exclusive offers"
                    className="flex-1 px-6 py-4 bg-transparent text-white placeholder-purple-300/50 outline-none rounded-xl text-base"
                  />
                  <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-900/40 whitespace-nowrap transform group-hover:shadow-purple-600/50">
                    Subscribe Now
                  </button>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-6 text-purple-300/40 text-xs">
                <span className="flex items-center gap-2">
                  <i className="ri-shield-check-line text-green-400"></i>
                  Secure & Confidential
                </span>
                <span className="flex items-center gap-2">
                  <i className="ri-mail-send-line text-purple-400"></i>
                  No spam, unsubscribe anytime
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="lg:px-12 md:px-12 px-4 lg:py-20 md:py-16 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
            
            {/* Horoscope */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="relative mb-6">
                <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                  Horoscope
                </span>
              </div>
              <ul className="space-y-3">
                <li><Link to="/horoscope/daily" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Daily Horoscope</Link></li>
                <li><Link to="/horoscope/weekly" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Weekly Horoscope</Link></li>
                <li><Link to="/horoscope/monthly" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Monthly Horoscope</Link></li>
                <li><Link to="/horoscope/yearly" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Yearly Horoscope</Link></li>
                <li><Link to="/horoscope/love" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Love Horoscope</Link></li>
                <li><Link to="/horoscope/career" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Career Horoscope</Link></li>
              </ul>
            </div>

            {/* Astrology Services */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="relative mb-6">
                <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                  Astrology Services
                </span>
              </div>
              <ul className="space-y-3">
                <li><Link to="/birth-chart" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Birth Chart Reading</Link></li>
                <li><Link to="/kundli" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Kundli Analysis</Link></li>
                <li><Link to="/compatibility" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Compatibility Report</Link></li>
                <li><Link to="/numerology" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Numerology</Link></li>
                <li><Link to="/vastu" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Vastu Shastra</Link></li>
                <li><Link to="/tarot" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Tarot Reading</Link></li>
              </ul>
            </div>

            {/* Shubh Muhurat */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="relative mb-6">
                <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                  Shubh Muhurat
                </span>
              </div>
              <ul className="space-y-3">
                <li><Link to="/muhurat/marriage" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Marriage Muhurat</Link></li>
                <li><Link to="/muhurat/griha-pravesh" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Griha Pravesh</Link></li>
                <li><Link to="/muhurat/vehicle" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Vehicle Muhurat</Link></li>
                <li><Link to="/muhurat/annaprashan" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Annaprashan</Link></li>
                <li><Link to="/muhurat/naamkaran" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Naamkaran</Link></li>
                <li><Link to="/panchang" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Today Panchang</Link></li>
              </ul>
            </div>

            {/* Consultations */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="relative mb-6">
                <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                  Consultations
                </span>
              </div>
              <ul className="space-y-3">
                <li><Link to="/chat" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Chat with Astrologer</Link></li>
                <li><Link to="/call" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Call Astrologer</Link></li>
                <li><Link to="/video-call" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Video Consultation</Link></li>
                <li><Link to="/ai-astro" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>AI Astrologer</Link></li>
                <li><Link to="/relationship" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Relationship Advice</Link></li>
                <li><Link to="/career-astrology" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Career Guidance</Link></li>
              </ul>
            </div>

            {/* Spiritual Shop */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="relative mb-6">
                <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                  Spiritual Shop
                </span>
              </div>
              <ul className="space-y-3">
                <li><Link to="/shop/rudraksha" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Rudraksha</Link></li>
                <li><Link to="/shop/gemstones" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Gemstones</Link></li>
                <li><Link to="/shop/yantra" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Vedic Yantra</Link></li>
                <li><Link to="/shop/jewelry" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Zodiac Jewelry</Link></li>
                <li><Link to="/shop/crystals" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Healing Crystals</Link></li>
                <li><Link to="/shop" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>View All</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="relative mb-6">
                <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                  Company
                </span>
              </div>
              <ul className="space-y-3">
                <li><Link to="/about" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>About Us</Link></li>
                <li><Link to="/careers" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Careers</Link></li>
                <li><Link to="/become-astrologer" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Become Astrologer</Link></li>
                <li><Link to="/press" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Press & Media</Link></li>
                <li><Link to="/testimonials" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Testimonials</Link></li>
                <li><Link to="/contact" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section with 3D Cards */}
        <div className="lg:px-12 md:px-12 px-4 py-16 border-t border-purple-700/20 border-b border-purple-700/20 bg-black/30 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Legal & Privacy */}
            <div className="group">
              <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                Legal & Privacy
              </span>
              <ul className="space-y-3">
                <li><Link to="/privacy" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Privacy Policy</Link></li>
                <li><Link to="/terms" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Cookie Policy</Link></li>
                <li><Link to="/gdpr" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>GDPR Compliance</Link></li>
                <li><Link to="/disclaimer" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Disclaimer</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="group">
              <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                Support
              </span>
              <ul className="space-y-3">
                <li><Link to="/help" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Help Center</Link></li>
                <li><Link to="/faq" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>FAQ</Link></li>
                <li><Link to="/contact" className={LiCss}><span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full group-hover/link:scale-150 transition-transform"></span>Contact Us</Link></li>
                <li className="text-purple-200/60 text-sm flex items-start gap-2 mt-4">
                  <i className="ri-customer-service-2-line text-purple-400 mt-0.5"></i>
                  <span>24/7 Customer Support</span>
                </li>
                <li className="text-purple-200/60 text-sm flex items-center gap-2">
                  <i className="ri-mail-line text-purple-400"></i>
                  <a href="mailto:support@plutoastro.com" className="hover:text-white transition-colors">support@plutoastro.com</a>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div className="group">
              <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                Connect With Us
              </span>
              <p className="text-purple-200/60 text-sm mb-5">Follow us for daily cosmic insights</p>
              
              {/* 3D Social Icons */}
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: "ri-facebook-circle-fill", url: "https://facebook.com", label: "Facebook", color: "hover:shadow-blue-600/50" },
                  { icon: "ri-instagram-line", url: "https://instagram.com", label: "Instagram", color: "hover:shadow-pink-600/50" },
                  { icon: "ri-twitter-x-fill", url: "https://twitter.com", label: "Twitter", color: "hover:shadow-gray-600/50" },
                  { icon: "ri-linkedin-box-fill", url: "https://linkedin.com", label: "LinkedIn", color: "hover:shadow-blue-700/50" },
                  { icon: "ri-youtube-fill", url: "https://youtube.com", label: "YouTube", color: "hover:shadow-red-600/50" },
                  { icon: "ri-tiktok-fill", url: "https://tiktok.com", label: "TikTok", color: "hover:shadow-purple-600/50" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    to={social.url}
                    target="_blank"
                    className={`group/social w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 backdrop-blur-md border border-purple-600/40 flex items-center justify-center text-purple-300 hover:text-white hover:border-purple-500 hover:scale-110 hover:-rotate-6 hover:shadow-xl ${social.color} transition-all duration-500`}
                    aria-label={social.label}
                  >
                    <i className={`${social.icon} text-2xl group-hover/social:rotate-12 transition-transform duration-300`}></i>
                  </Link>
                ))}
              </div>
            </div>

            {/* Download App */}
            <div className="group">
              <span className={`${titleCss} after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500`}>
                Download App
              </span>
              <p className="text-purple-200/60 text-sm mb-5">Get exclusive offers & features</p>
              <div className="flex flex-col gap-3">
                <a href="https://play.google.com/store/apps/details?id=com.plutoastro" target="_blank" rel="noopener noreferrer" 
                   className="group/btn relative overflow-hidden flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 backdrop-blur-md rounded-xl border border-purple-600/40 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover/btn:from-purple-600/20 group-hover/btn:to-fuchsia-600/20 transition-all duration-700"></div>
                  <svg className="w-10 h-10 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left relative z-10">
                    <p className="text-xs text-gray-400 group-hover/btn:text-gray-300 transition-colors">Get it on</p>
                    <p className="text-white font-bold text-sm">Google Play</p>
                  </div>
                </a>
                <a href="https://apps.apple.com/app/plutoastro" target="_blank" rel="noopener noreferrer" 
                   className="group/btn relative overflow-hidden flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 backdrop-blur-md rounded-xl border border-purple-600/40 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover/btn:from-purple-600/20 group-hover/btn:to-fuchsia-600/20 transition-all duration-700"></div>
                  <svg className="w-10 h-10 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left relative z-10">
                    <p className="text-xs text-gray-400 group-hover/btn:text-gray-300 transition-colors">Download on the</p>
                    <p className="text-white font-bold text-sm">App Store</p>
                  </div>
                </a>
              </div>
              
              {/* Security Badges */}
              <div className="mt-6 flex items-center gap-3 text-purple-300/60 text-xs">
                <i className="ri-shield-check-line text-lg text-green-400"></i>
                <span>SSL Secured</span>
                <span className="mx-1">•</span>
                <i className="ri-lock-2-line text-lg text-purple-400"></i>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright with Gradient */}
        <div className="py-8 bg-black/40 backdrop-blur-xl border-t border-purple-800/20">
          <div className="lg:px-12 md:px-12 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-purple-300/50 text-sm text-center md:text-left">
                © {currentYear} PlutoAstro. All Rights Reserved Worldwide.
              </p>
              <div className="flex gap-6 text-xs text-purple-300/40">
                <span className="flex items-center gap-2">
                  <i className="ri-earth-line"></i>
                  Available in 16+ Languages
                </span>
                <span className="flex items-center gap-2">
                  <i className="ri-global-line"></i>
                  Serving 50+ Countries
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
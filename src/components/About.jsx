import React from "react";
import { useSelector } from "react-redux";
import bg from "../image/bg1.jpg";
import Chatbot from "./Chatbot";

const About = () => {
  const Bot = useSelector((store) => store.configApp.Bot);

  const features = [
    {
      icon: "ri-moon-line",
      title: "Kundli Access",
      description:
        "Access your personalized Kundli with detailed insights into your astrological profile, planetary positions, and life predictions.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "ri-sun-line",
      title: "Daily Horoscope",
      description:
        "Get personalized daily horoscope readings tailored to your zodiac sign with guidance and predictions for the day ahead.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: "ri-robot-line",
      title: "AI Astro Chatbot",
      description:
        "Chat with our intelligent AI-powered chatbot for instant answers to your astrological queries, available 24/7.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "ri-chat-1-line",
      title: "Live Chat with Astrologers",
      description:
        "Connect with verified astrologers via live chat for personalized consultations and guidance on life's important decisions.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "ri-phone-line",
      title: "Voice Call Consultations",
      description:
        "Speak directly with experienced astrologers through secure voice calls for in-depth consultations and detailed readings.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: "ri-shield-check-line",
      title: "Verified Astrologers",
      description:
        "All our astrologers are thoroughly verified with proven expertise, ensuring you receive authentic and reliable guidance.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Users", icon: "ri-user-heart-line" },
    { number: "100+", label: "Expert Astrologers", icon: "ri-award-line" },
    { number: "50K+", label: "Consultations", icon: "ri-chat-smile-3-line" },
    { number: "4.8★", label: "Average Rating", icon: "ri-star-line" },
  ];

  const values = [
    {
      icon: "ri-lightbulb-flash-line",
      title: "Innovation",
      description: "Blending ancient wisdom with modern technology",
    },
    {
      icon: "ri-heart-line",
      title: "Trust",
      description: "100% verified astrologers with proven expertise",
    },
    {
      icon: "ri-global-line",
      title: "Accessibility",
      description: "Available in 7 languages for global reach",
    },
    {
      icon: "ri-lock-line",
      title: "Security",
      description: "Secure authentication and data protection",
    },
  ];

  return (
    <div className="relative w-full min-h-screen">
      {Bot && <Chatbot />}
      <img
        alt="bg"
        className="h-full w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"
        src={bg}
      ></img>

      {/* Hero Section */}
      <div className="pt-28 lg:pt-36 px-4 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-600 bg-opacity-20 border border-purple-500 text-purple-300 text-sm font-medium mb-4">
              ✨ Welcome to PlutoAstro
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6">
              About PlutoAstro
            </h1>
            <p className="text-lg lg:text-xl text-purple-200 opacity-90 max-w-3xl mx-auto leading-relaxed">
              PlutoAstro is a premium astrology platform that seamlessly blends
              ancient Vedic wisdom with cutting-edge AI technology. Our mission
              is to make authentic astrological guidance accessible to everyone,
              everywhere.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-purple-950 bg-opacity-60 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-6 text-center hover:border-purple-400 transition-all hover:scale-105"
              >
                <i
                  className={`${stat.icon} text-3xl lg:text-4xl text-purple-300 mb-2 block`}
                ></i>
                <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-purple-300 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-300 mb-4">
                Key Features
              </h2>
              <p className="text-purple-200 opacity-80">
                Everything you need for your astrological journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-purple-950 bg-opacity-50 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-6 hover:border-purple-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <i className={`${feature.icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-purple-200 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-purple-300 opacity-80 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-300 mb-4">
                Our Values
              </h2>
              <p className="text-purple-200 opacity-80">
                What drives us every day
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-900 to-purple-950 bg-opacity-70 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-6 text-center hover:border-purple-400 transition-all"
                >
                  <i
                    className={`${value.icon} text-4xl text-purple-300 mb-3 block`}
                  ></i>
                  <h3 className="text-lg font-bold text-purple-200 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-purple-300 opacity-80 text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* About Us Description Section (Replaced Tech Stack) */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-300 mb-4">
                About Us
              </h2>
              <p className="text-purple-200 opacity-80">
                Our story, mission, and vision
              </p>
            </div>
            <div className="bg-purple-950 bg-opacity-50 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-8 lg:p-12">
              <div className="space-y-8">
                {/* Our Story */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <i className="ri-book-open-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-200 mb-3">
                      Our Story
                    </h3>
                    <p className="text-purple-300 opacity-90 leading-relaxed">
                      PlutoAstro was born from a simple yet powerful idea — to make
                      authentic astrological guidance accessible to everyone. In
                      a world where ancient wisdom often feels distant and
                      complicated, we set out to bridge the gap between
                      traditional Vedic astrology and modern technology. Our
                      platform brings together verified astrologers, AI-powered
                      insights, and a user-friendly experience to help you
                      navigate life's journey with confidence.
                    </p>
                  </div>
                </div>

                {/* Our Mission */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <i className="ri-rocket-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-200 mb-3">
                      Our Mission
                    </h3>
                    <p className="text-purple-300 opacity-90 leading-relaxed">
                      To empower individuals with personalized astrological
                      insights that help them make informed decisions about their
                      lives. We believe that everyone deserves access to
                      authentic astrological guidance, regardless of their
                      location or background. Through our platform, we're making
                      this vision a reality by connecting users with verified
                      astrologers and providing AI-powered tools for daily
                      guidance.
                    </p>
                  </div>
                </div>

                {/* Our Vision */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <i className="ri-eye-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-200 mb-3">
                      Our Vision
                    </h3>
                    <p className="text-purple-300 opacity-90 leading-relaxed">
                      To become the world's most trusted and accessible astrology
                      platform, where ancient wisdom meets modern innovation. We
                      envision a future where astrological guidance is just a
                      click away for everyone, helping people across the globe
                      live more mindful, informed, and fulfilling lives.
                    </p>
                  </div>
                </div>

                {/* What We Offer */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <i className="ri-gift-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-200 mb-3">
                      What We Offer
                    </h3>
                    <p className="text-purple-300 opacity-90 leading-relaxed">
                      PlutoAstro offers a comprehensive suite of astrological
                      services including live chat and call consultations with
                      verified astrologers, AI-powered chatbot for instant
                      guidance, personalized daily horoscopes, detailed Kundli
                      analysis, and much more. Our platform supports multiple
                      languages, ensuring that users from different regions can
                      access astrological guidance in their preferred language.
                    </p>
                  </div>
                </div>

                {/* Our Commitment */}
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <i className="ri-heart-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-200 mb-3">
                      Our Commitment
                    </h3>
                    <p className="text-purple-300 opacity-90 leading-relaxed">
                      We are committed to providing the highest quality
                      astrological services with complete transparency and
                      authenticity. Every astrologer on our platform is
                      thoroughly verified, every consultation is secure and
                      private, and every piece of guidance is delivered with
                      care and professionalism. Your trust is our most valuable
                      asset, and we work tirelessly to maintain it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Highlights */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-purple-300 mb-4">
                Technical Highlights
              </h2>
            </div>
            <div className="bg-purple-950 bg-opacity-50 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "ri-speed-line",
                    title: "Performance Optimization",
                    desc: "Lazy loading and chunking for 20% faster load times",
                  },
                  {
                    icon: "ri-api-line",
                    title: "Smart API Management",
                    desc: "10+ APIs with memoization for optimal performance",
                  },
                  {
                    icon: "ri-translate-2",
                    title: "Multilingual Support",
                    desc: "90% content in 7 different languages",
                  },
                  {
                    icon: "ri-lock-password-line",
                    title: "Secure Authentication",
                    desc: "Firebase-powered secure user authentication",
                  },
                  {
                    icon: "ri-palette-line",
                    title: "Responsive Design",
                    desc: "100% responsive across all devices with Tailwind",
                  },
                  {
                    icon: "ri-code-s-slash-line",
                    title: "Scalable Architecture",
                    desc: "Built to handle large user base efficiently",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-600 bg-opacity-30 flex items-center justify-center flex-shrink-0">
                      <i className={`${item.icon} text-2xl text-purple-300`}></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-purple-200 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-purple-300 opacity-80 text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center pb-16">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Explore Your Destiny?
              </h2>
              <p className="text-purple-100 mb-6 text-lg">
                Join thousands of users who trust PlutoAstro for their
                astrological guidance
              </p>
              <a
                href="/chat"
                className="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-purple-100 transition-all hover:scale-105"
              >
                Start Your Journey →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
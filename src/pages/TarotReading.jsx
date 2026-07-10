import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bg from "../image/newbg.jpg";

const TarotReading = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedSign, setSelectedSign] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  const zodiacSigns = [
    { id: "aries", name: "Aries", symbol: "♈", date: "Mar 21 - Apr 19", tarotCard: "The Magician", message: "Your fiery energy aligns with new beginnings. The Magician card suggests you have all the tools needed to manifest your desires. Take bold action today." },
    { id: "taurus", name: "Taurus", symbol: "♉", date: "Apr 20 - May 20", tarotCard: "The Empress", message: "Abundance and beauty surround you. The Empress card brings fertility, creativity, and nurturing energy. Trust in the natural flow of life." },
    { id: "gemini", name: "Gemini", symbol: "♊", date: "May 21 - Jun 20", tarotCard: "The Lovers", message: "Communication and connection are highlighted. The Lovers card speaks of harmony, choices, and meaningful relationships. Listen to your heart." },
    { id: "cancer", name: "Cancer", symbol: "", date: "Jun 21 - Jul 22", tarotCard: "The High Priestess", message: "Your intuition is your greatest strength. The High Priestess encourages you to trust your inner wisdom and explore the mysteries within." },
    { id: "leo", name: "Leo", symbol: "♌", date: "Jul 23 - Aug 22", tarotCard: "The Sun", message: "Radiant energy surrounds you! The Sun card brings joy, success, and vitality. Shine brightly and share your warmth with others." },
    { id: "virgo", name: "Virgo", symbol: "♍", date: "Aug 23 - Sep 22", tarotCard: "The Hermit", message: "A time for introspection and inner guidance. The Hermit card suggests seeking wisdom through solitude and self-reflection." },
    { id: "libra", name: "Libra", symbol: "♎", date: "Sep 23 - Oct 22", tarotCard: "Justice", message: "Balance and fairness are key themes. The Justice card reminds you that every action has consequences. Seek truth and harmony." },
    { id: "scorpio", name: "Scorpio", symbol: "♏", date: "Oct 23 - Nov 21", tarotCard: "Death", message: "Transformation is upon you. The Death card signifies endings that lead to powerful new beginnings. Embrace change with courage." },
    { id: "sagittarius", name: "Sagittarius", symbol: "♐", date: "Nov 22 - Dec 21", tarotCard: "The Chariot", message: "Victory and determination are yours! The Chariot card brings success through willpower and focused action. Keep moving forward." },
    { id: "capricorn", name: "Capricorn", symbol: "♑", date: "Dec 22 - Jan 19", tarotCard: "The Devil", message: "Examine your attachments and limitations. The Devil card warns against materialism. Break free from what binds you." },
    { id: "aquarius", name: "Aquarius", symbol: "♒", date: "Jan 20 - Feb 18", tarotCard: "The Star", message: "Hope and inspiration guide you. The Star card brings renewal, faith, and spiritual insight. Trust in the universe's plan." },
    { id: "pisces", name: "Pisces", symbol: "♓", date: "Feb 19 - Mar 20", tarotCard: "The Moon", message: "Your dreams hold important messages. The Moon card reveals hidden truths and subconscious wisdom. Trust your intuition." },
  ];

  const majorArcana = [
    { id: 0, name: "The Fool", number: "0", meaning: "New beginnings, innocence, spontaneity", keywords: ["Beginnings", "Innocence", "Adventure"], element: "Air", description: "The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe." },
    { id: 1, name: "The Magician", number: "I", meaning: "Manifestation, resourcefulness, power", keywords: ["Willpower", "Creation", "Manifestation"], element: "Air", description: "The Magician represents willpower, desire, creation, and manifestation. You have all the tools and resources you need to succeed." },
    { id: 2, name: "The High Priestess", number: "II", meaning: "Intuition, sacred knowledge, divine feminine", keywords: ["Intuition", "Mystery", "Subconscious"], element: "Water", description: "The High Priestess represents intuition, sacred knowledge, divine feminine, and the subconscious mind. She encourages you to trust your inner voice." },
    { id: 3, name: "The Empress", number: "III", meaning: "Femininity, beauty, nature, nurturing", keywords: ["Abundance", "Nurturing", "Fertility"], element: "Earth", description: "The Empress signifies a strong connection with our femininity. Femininity translates to beauty, nurturing, fertility, and the abundance of nature." },
    { id: 4, name: "The Emperor", number: "IV", meaning: "Authority, establishment, structure, father figure", keywords: ["Authority", "Structure", "Control"], element: "Fire", description: "The Emperor represents authority, establishment, and structure. He is the father figure of the Tarot deck, representing leadership and stability." },
    { id: 5, name: "The Hierophant", number: "V", meaning: "Spiritual wisdom, religious beliefs, conformity", keywords: ["Tradition", "Conformity", "Morality"], element: "Earth", description: "The Hierophant represents spiritual wisdom, religious beliefs, and conformity. This card often appears when you are seeking guidance from a higher power." },
    { id: 6, name: "The Lovers", number: "VI", meaning: "Love, harmony, relationships, values alignment", keywords: ["Love", "Harmony", "Partnership"], element: "Air", description: "The Lovers card represents relationships and choices. Its appearance in a reading often indicates a decision about a current relationship or a new partnership." },
    { id: 7, name: "The Chariot", number: "VII", meaning: "Control, willpower, success, action", keywords: ["Determination", "Focus", "Victory"], element: "Water", description: "The Chariot represents control, willpower, and success. It signifies a time of victory and overcoming obstacles through determination." },
    { id: 8, name: "Strength", number: "VIII", meaning: "Strength, courage, persuasion, influence", keywords: ["Courage", "Patience", "Compassion"], element: "Fire", description: "Strength represents inner strength, courage, and compassion. It suggests that you have the emotional strength to overcome any challenge." },
    { id: 9, name: "The Hermit", number: "IX", meaning: "Soul-searching, introspection, being alone", keywords: ["Introspection", "Solitude", "Guidance"], element: "Earth", description: "The Hermit represents soul-searching, introspection, and being alone. This card suggests a period of self-reflection and inner guidance." },
    { id: 10, name: "Wheel of Fortune", number: "X", meaning: "Good luck, karma, life cycles, destiny", keywords: ["Luck", "Karma", "Cycles"], element: "Fire", description: "The Wheel of Fortune represents good luck, karma, and life cycles. It reminds us that life is constantly changing and what goes around comes around." },
    { id: 11, name: "Justice", number: "XI", meaning: "Justice, fairness, truth, cause and effect", keywords: ["Fairness", "Truth", "Law"], element: "Air", description: "Justice represents fairness, truth, and cause and effect. This card suggests that you will be treated fairly and that truth will prevail." },
    { id: 12, name: "The Hanged Man", number: "XII", meaning: "Pause, surrender, letting go, new perspectives", keywords: ["Sacrifice", "Release", "Martyrdom"], element: "Water", description: "The Hanged Man represents a pause, surrender, and new perspectives. Sometimes we need to let go of control to see things differently." },
    { id: 13, name: "Death", number: "XIII", meaning: "Endings, change, transformation, transition", keywords: ["Transformation", "Endings", "Change"], element: "Water", description: "Death represents endings, change, and transformation. Despite its intimidating name, this card often signifies positive transformation and new beginnings." },
    { id: 14, name: "Temperance", number: "XIV", meaning: "Balance, moderation, patience, purpose", keywords: ["Balance", "Moderation", "Patience"], element: "Fire", description: "Temperance represents balance, moderation, and patience. It suggests finding the middle path and maintaining equilibrium in all aspects of life." },
    { id: 15, name: "The Devil", number: "XV", meaning: "Shadow self, attachment, addiction, restriction", keywords: ["Addiction", "Materialism", "Bondage"], element: "Earth", description: "The Devil represents the shadow self, attachment, and addiction. It warns against materialism and unhealthy attachments that bind us." },
    { id: 16, name: "The Tower", number: "XVI", meaning: "Sudden change, upheaval, chaos, revelation", keywords: ["Upheaval", "Revelation", "Awakening"], element: "Fire", description: "The Tower represents sudden change, upheaval, and chaos. While it may seem destructive, it often clears the way for necessary transformation." },
    { id: 17, name: "The Star", number: "XVII", meaning: "Hope, faith, purpose, renewal, spirituality", keywords: ["Hope", "Faith", "Renewal"], element: "Air", description: "The Star represents hope, faith, and renewal. After a period of darkness, this card brings light and optimism for the future." },
    { id: 18, name: "The Moon", number: "XVIII", meaning: "Illusion, fear, anxiety, subconscious, intuition", keywords: ["Illusion", "Fear", "Intuition"], element: "Water", description: "The Moon represents illusion, fear, and anxiety. It suggests that things may not be as they seem and encourages you to trust your intuition." },
    { id: 19, name: "The Sun", number: "XIX", meaning: "Positivity, fun, warmth, success, vitality", keywords: ["Joy", "Success", "Vitality"], element: "Fire", description: "The Sun represents positivity, fun, and success. It is one of the most positive cards in the deck, bringing warmth and vitality." },
    { id: 20, name: "Judgement", number: "XX", meaning: "Judgement, rebirth, inner calling, absolution", keywords: ["Rebirth", "Inner Calling", "Absolution"], element: "Fire", description: "Judgement represents rebirth, inner calling, and absolution. It suggests a time of reflection and answering a higher calling." },
    { id: 21, name: "The World", number: "XXI", meaning: "Completion, integration, accomplishment, travel", keywords: ["Completion", "Accomplishment", "Travel"], element: "Earth", description: "The World represents completion, integration, and accomplishment. It signifies the successful conclusion of a major life cycle." },
  ];

  const spreads = [
    { name: "One Card Draw", cards: 1, description: "Perfect for daily guidance and quick insights.", use: "Daily guidance, quick answers", difficulty: "Beginner" },
    { name: "Three Card Spread", cards: 3, description: "Past-Present-Future or Situation-Action-Outcome.", use: "General readings, decisions", difficulty: "Beginner" },
    { name: "Celtic Cross", cards: 10, description: "The most comprehensive tarot spread for deep insights.", use: "Complex situations", difficulty: "Advanced" },
    { name: "Horseshoe Spread", cards: 7, description: "Balanced view of past, present, and future.", use: "Life patterns, career", difficulty: "Intermediate" },
    { name: "Relationship Spread", cards: 6, description: "Explores both partners' feelings and challenges.", use: "Love readings", difficulty: "Intermediate" },
    { name: "Yes/No Spread", cards: 3, description: "Simple spread for direct yes/no questions.", use: "Quick decisions", difficulty: "Beginner" },
  ];

  const courtCards = [
    { suit: "Cups", cards: ["Page", "Knight", "Queen", "King"] },
    { suit: "Pentacles", cards: ["Page", "Knight", "Queen", "King"] },
    { suit: "Swords", cards: ["Page", "Knight", "Queen", "King"] },
    { suit: "Wands", cards: ["Page", "Knight", "Queen", "King"] },
  ];

  const historyTimeline = [
    { year: "1440s", event: "First tarot decks created in Northern Italy" },
    { year: "1781", event: "Occult significance published by Court de Gébelin" },
    { year: "1909", event: "Rider-Waite-Smith deck revolutionizes tarot" },
    { year: "1944", event: "Aleister Crowley's Thoth Tarot released" },
    { year: "1970s", event: "Mainstream popularity surge begins" },
    { year: "2020s", event: "AI-powered tarot readings emerge" },
  ];

  const blogs = [
    {
      id: 1,
      title: "Understanding the Major Arcana: A Complete Guide",
      excerpt: "Dive deep into the 22 cards of the Major Arcana and discover their profound spiritual meanings and life lessons.",
      image: "https://images.unsplash.com/photo-1637204540232-615d44d5c423?w=600&h=400&fit=crop",
      category: "Guide",
      readTime: "8 min",
      date: "Jan 10, 2026"
    },
    {
      id: 2,
      title: "How to Perform Your First Tarot Reading",
      excerpt: "Step-by-step instructions for beginners on how to conduct a meaningful tarot reading with confidence.",
      image: "https://images.unsplash.com/photo-1609234656388-0ff3633c373f?w=600&h=400&fit=crop",
      category: "Tutorial",
      readTime: "6 min",
      date: "Jan 8, 2026"
    },
    {
      id: 3,
      title: "The Connection Between Tarot and Astrology",
      excerpt: "Explore how tarot cards align with zodiac signs and planetary influences for deeper cosmic insights.",
      image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=600&h=400&fit=crop",
      category: "Astrology",
      readTime: "10 min",
      date: "Jan 5, 2026"
    },
    {
      id: 4,
      title: "Daily Tarot Rituals for Spiritual Growth",
      excerpt: "Learn powerful daily rituals using tarot cards to enhance your intuition and spiritual connection.",
      image: "https://images.unsplash.com/photo-1612438214708-f428a707dd0e?w=600&h=400&fit=crop",
      category: "Spirituality",
      readTime: "7 min",
      date: "Jan 3, 2026"
    },
    {
      id: 5,
      title: "Reversed Tarot Cards: What They Really Mean",
      excerpt: "Unlock the hidden messages of reversed tarot cards and how they change your reading interpretation.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop",
      category: "Advanced",
      readTime: "9 min",
      date: "Dec 28, 2025"
    },
    {
      id: 6,
      title: "Tarot for Love: Finding Your Soulmate",
      excerpt: "Use tarot cards to gain insights into your love life and attract your ideal partner.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
      category: "Love",
      readTime: "8 min",
      date: "Dec 25, 2025"
    },
  ];

  // Scroll animation handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 -z-50"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Animated Particles */}
      <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          ></div>
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 -z-30 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float-slow"
          style={{
            top: "20%",
            left: "10%",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-float-slow-reverse"
          style={{
            bottom: "20%",
            right: "10%",
            transform: `translateY(${scrollY * -0.1}px)`,
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-300 mb-8 backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            🔮 Ancient Wisdom Through Sacred Cards
          </div>
          <h1
            className="text-6xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-200 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up animate-gradient-text"
            style={{ animationDelay: "0.4s" }}
          >
            Tarot Reading
          </h1>
          <p
            className="text-xl lg:text-2xl text-purple-200/90 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            Unlock the mystical wisdom of the tarot and discover profound insights into your soul's journey
          </p>
          <div
            className="flex flex-wrap justify-center gap-6 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Link
              to="/chat"
              className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-full hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-900/60 border border-purple-400/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative">Get Reading Now</span>
            </Link>
            <Link
              to="/ai-astro"
              className="px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-purple-500/50 text-white font-bold rounded-full hover:bg-purple-600/50 transition-all duration-300 hover:scale-105"
            >
              AI Tarot Reader
            </Link>
          </div>

          {/* Floating Cards Animation */}
          <div className="mt-16 relative h-32 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-20 h-32 bg-gradient-to-br from-purple-600/30 to-fuchsia-600/30 backdrop-blur-md rounded-xl border border-purple-500/30 animate-float-card"
                style={{
                  left: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.5}s`,
                  transform: `rotate(${-15 + i * 7.5}deg)`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {["🎴", "⭐", "🌙", "☀️", "🔮"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac Sign Selector */}
      <section
        id="zodiac-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("zodiac-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-300 mb-6 backdrop-blur-sm">
              🔮 Personalized Tarot Reading
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Select Your Zodiac Sign
            </h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              Choose your sign to receive a personalized tarot card reading and cosmic guidance
            </p>
          </div>

          {/* Zodiac Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-12">
            {zodiacSigns.map((sign, idx) => (
              <button
                key={sign.id}
                onClick={() => setSelectedSign(selectedSign === sign.id ? null : sign.id)}
                className={`group p-4 rounded-2xl border-2 transition-all duration-500 hover:scale-110 hover:-translate-y-2 ${
                  selectedSign === sign.id
                    ? "bg-gradient-to-br from-purple-600 to-fuchsia-600 border-purple-400 shadow-2xl shadow-purple-900/50 scale-110"
                    : "bg-purple-900/40 border-purple-700/50 hover:border-purple-500/70 backdrop-blur-sm"
                }`}
                style={{
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{sign.symbol}</div>
                <div className="text-xs font-semibold text-center text-white">{sign.name}</div>
              </button>
            ))}
          </div>

          {/* Selected Sign Reading */}
          {selectedSign && (
            <div className="max-w-4xl mx-auto animate-scale-in">
              {(() => {
                const sign = zodiacSigns.find(s => s.id === selectedSign);
                return (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-gradient-rotate"></div>
                    <div className="relative bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 p-8 lg:p-12">
                      <div className="text-center mb-8">
                        <div className="text-6xl mb-4 animate-float">{sign.symbol}</div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                          {sign.name} - {sign.date}
                        </h3>
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full text-white font-bold animate-pulse-glow">
                          Your Card: {sign.tarotCard}
                        </div>
                      </div>
                      <p className="text-lg text-purple-100 leading-relaxed text-center">
                        {sign.message}
                      </p>
                      <div className="mt-8 text-center">
                        <Link
                          to="/chat"
                          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-purple-600/50"
                        >
                          Get Full Reading
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Introduction */}
      <section
        id="intro-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("intro-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 animate-gradient-text">Sacred Wisdom</span> of Tarot
              </h2>
              <p className="text-lg text-purple-200/90 leading-relaxed">
                Tarot reading is an ancient divinatory practice using 78 sacred cards to illuminate your past, present, and future. Each card carries profound symbolism and archetypal wisdom.
              </p>
              <p className="text-lg text-purple-200/90 leading-relaxed">
                The deck comprises the <strong className="text-purple-300">Major Arcana</strong> (22 cards of spiritual lessons) and <strong className="text-purple-300">Minor Arcana</strong> (56 cards of daily life guidance).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "🎴", title: "78 Cards", desc: "Complete mystical deck" },
                { icon: "🌟", title: "600+ Years", desc: "Of sacred tradition" },
                { icon: "⭐", title: "22 Major", desc: "Karmic lessons" },
                { icon: "✨", title: "56 Minor", desc: "Daily guidance" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-purple-900/60 to-purple-800/40 backdrop-blur-md p-8 rounded-3xl border border-purple-600/40 hover:border-purple-500/70 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-fuchsia-600/0 group-hover:from-purple-600/10 group-hover:to-fuchsia-600/10 transition-all duration-500"></div>
                  <div className="relative">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-purple-200/80">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Major Arcana */}
      <section
        id="major-arcana-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("major-arcana-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-300 mb-6 backdrop-blur-sm">
              The Sacred Journey
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">Major Arcana</h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              22 cards representing life's profound spiritual lessons and the soul's evolution
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {majorArcana.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                className={`group relative bg-gradient-to-br from-purple-900/70 via-purple-800/60 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 p-8 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:border-purple-400/70 hover:shadow-2xl hover:shadow-purple-900/60 ${
                  selectedCard === card.id ? "ring-2 ring-purple-400 scale-105" : ""
                }`}
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  transform: `perspective(1000px) rotateY(${scrollY * 0.01}deg)`,
                }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">{card.number}</span>
                  <span className="px-4 py-2 bg-purple-800/60 backdrop-blur-sm rounded-full text-xs font-semibold text-purple-200 border border-purple-600/40">
                    {card.element}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {card.name}
                </h3>
                <p className="text-purple-200/90 text-sm mb-6 leading-relaxed">{card.meaning}</p>
                <div className="flex flex-wrap gap-2">
                  {card.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-purple-800/50 backdrop-blur-sm rounded-lg text-xs font-medium text-purple-200 border border-purple-600/30">
                      {keyword}
                    </span>
                  ))}
                </div>
                {selectedCard === card.id && (
                  <div className="mt-6 pt-6 border-t border-purple-600/40 animate-fade-in">
                    <p className="text-purple-100 text-sm leading-relaxed">{card.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minor Arcana */}
      <section
        id="minor-arcana-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("minor-arcana-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 border border-fuchsia-500/50 rounded-full text-sm font-semibold text-fuchsia-300 mb-6 backdrop-blur-sm">
              Daily Life Guidance
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">Minor Arcana</h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              Four suits representing different aspects of human experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Four Suits */}
            <div className="bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 p-10">
              <h3 className="text-3xl font-bold text-white mb-8">The Four Suits</h3>
              <div className="space-y-6">
                {[
                  { icon: "🏆", name: "Cups", element: "Water", desc: "Emotions, love, relationships, and feelings" },
                  { icon: "🪙", name: "Pentacles", element: "Earth", desc: "Career, finances, material world, home" },
                  { icon: "⚔️", name: "Swords", element: "Air", desc: "Intellect, thoughts, communication, challenges" },
                  { icon: "🔥", name: "Wands", element: "Fire", desc: "Creativity, passion, inspiration, energy" },
                ].map((suit, idx) => (
                  <div key={idx} className="flex items-start gap-5 p-4 bg-purple-800/40 backdrop-blur-sm rounded-2xl border border-purple-600/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-700 to-fuchsia-700 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                      {suit.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{suit.name} <span className="text-purple-400 text-sm">({suit.element})</span></h4>
                      <p className="text-purple-200/80 text-sm">{suit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Court Cards */}
            <div className="bg-gradient-to-br from-fuchsia-900/70 via-fuchsia-800/50 to-purple-900/70 backdrop-blur-md rounded-3xl border-2 border-fuchsia-600/40 p-10">
              <h3 className="text-3xl font-bold text-white mb-8">Court Cards</h3>
              <div className="space-y-6">
                {courtCards.map((suit) => (
                  <div key={suit.suit}>
                    <h4 className="text-xl font-bold text-fuchsia-300 mb-4 flex items-center gap-3">
                      <span className="w-2 h-2 bg-fuchsia-400 rounded-full"></span>
                      {suit.suit}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 ml-5">
                      {suit.cards.map((card, idx) => (
                        <div key={idx} className="px-4 py-3 bg-fuchsia-800/50 backdrop-blur-sm rounded-xl text-sm font-medium text-fuchsia-100 border border-fuchsia-600/30 hover:border-fuchsia-500/60 transition-all hover:scale-105">
                          {card} of {suit.suit}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarot Spreads */}
      <section
        id="spreads-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("spreads-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-300 mb-6 backdrop-blur-sm">
              Reading Methods
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">Tarot Spreads</h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              Choose the perfect spread for your question
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spreads.map((spread, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 p-8 hover:border-purple-400/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/60"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">{spread.cards}</span>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-sm ${
                    spread.difficulty === "Beginner" ? "bg-green-800/60 text-green-200 border-green-600/40" :
                    spread.difficulty === "Intermediate" ? "bg-yellow-800/60 text-yellow-200 border-yellow-600/40" :
                    "bg-red-800/60 text-red-200 border-red-600/40"
                  }`}>
                    {spread.difficulty}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">{spread.name}</h3>
                <p className="text-purple-200/90 text-sm mb-6 leading-relaxed">{spread.description}</p>
                <div className="pt-6 border-t border-purple-600/40">
                  <p className="text-xs text-purple-300 font-medium">
                    <span className="text-purple-400">Best for:</span> {spread.use}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section
        id="history-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("history-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 border border-fuchsia-500/50 rounded-full text-sm font-semibold text-fuchsia-300 mb-6 backdrop-blur-sm">
              Through the Ages
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">History of Tarot</h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              A journey through centuries of mystical wisdom
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-600 via-fuchsia-600 to-purple-600 rounded-full"></div>
            <div className="space-y-12">
              {historyTimeline.map((item, idx) => (
                <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className={`w-5/12 ${idx % 2 === 0 ? "pr-10 text-right" : "pl-10 text-left"}`}>
                    <div className="bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 p-8 hover:border-purple-400/70 transition-all duration-500 hover:scale-105">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 mb-3 block">{item.year}</span>
                      <p className="text-purple-100 leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full border-4 border-black shadow-lg shadow-purple-900/60 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        id="benefits-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("benefits-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-300 mb-6 backdrop-blur-sm">
              Transform Your Life
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">Benefits of Tarot</h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              Discover how tarot can guide your spiritual journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🧠", title: "Self-Discovery", desc: "Uncover deep insights about your personality and life patterns" },
              { icon: "💡", title: "Clarity", desc: "Gain fresh perspectives on challenging situations" },
              { icon: "🌱", title: "Personal Growth", desc: "Develop greater self-awareness and spiritual evolution" },
              { icon: "❤️", title: "Relationships", desc: "Understand dynamics and improve your connections" },
              { icon: "🎯", title: "Decision Making", desc: "Navigate crossroads with confidence and clarity" },
              { icon: "🔮", title: "Spirituality", desc: "Deepen your intuition and cosmic connection" },
              { icon: "😌", title: "Stress Relief", desc: "Find comfort during uncertain times" },
              { icon: "🌟", title: "Future Planning", desc: "Prepare for upcoming life changes" },
              { icon: "🎨", title: "Creativity", desc: "Unlock creative blocks and inspiration" },
            ].map((benefit, idx) => (
              <div key={idx} className="group bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 p-8 hover:border-purple-400/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/60">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">{benefit.title}</h3>
                <p className="text-purple-200/90 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Read */}
      <section
        id="howto-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("howto-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 border border-fuchsia-500/50 rounded-full text-sm font-semibold text-fuchsia-300 mb-6 backdrop-blur-sm">
              Begin Your Journey
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">How to Read Tarot</h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              Four simple steps to unlock the wisdom of the cards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Set Intention", desc: "Center yourself and formulate a clear question" },
              { step: "02", title: "Shuffle", desc: "Focus on your question while shuffling the deck" },
              { step: "03", title: "Choose Spread", desc: "Select a spread matching your question" },
              { step: "04", title: "Interpret", desc: "Trust your intuition and read the cards" },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -top-4 -left-2 text-8xl font-bold text-purple-600/20 group-hover:text-purple-500/30 transition-colors">{item.step}</div>
                <div className="relative bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 p-8 hover:border-purple-400/70 transition-all duration-500 hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-purple-200/90 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section
        id="blogs-section"
        ref={addToRefs}
        className={`relative py-20 lg:py-28 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("blogs-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-300 mb-6 backdrop-blur-sm">
              📚 Latest Articles
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white">Tarot & Astrology Blog</h2>
            <p className="text-lg text-purple-200/90 max-w-2xl mx-auto">
              Deep dive into the mystical world of tarot and astrology with our expert guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <article
                key={blog.id}
                className="group bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-fuchsia-900/70 backdrop-blur-md rounded-3xl border-2 border-purple-600/40 overflow-hidden hover:border-purple-400/70 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-900/60"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 to-transparent"></div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-purple-400/50">
                    {blog.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-purple-300 mb-3">
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      {blog.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-line"></i>
                      {blog.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-purple-200/80 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center gap-2 text-purple-400 font-semibold text-sm hover:text-purple-300 transition-colors group/link"
                  >
                    Read More
                    <i className="ri-arrow-right-line group-hover/link:translate-x-1 transition-transform"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-purple-600/50"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta-section"
        ref={addToRefs}
        className={`relative py-32 lg:py-40 px-4 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("cta-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-gradient-rotate"></div>
            <div className="relative bg-gradient-to-r from-purple-900/60 via-fuchsia-900/60 to-purple-900/60 backdrop-blur-xl rounded-3xl border-2 border-purple-600/40 p-16 lg:p-20">
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white">
                Begin Your Tarot Journey
              </h2>
              <p className="text-xl text-purple-200/90 mb-12 leading-relaxed">
                Connect with expert tarot readers or try our AI-powered reading for instant mystical guidance
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/chat"
                  className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-lg rounded-full hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-900/60 border border-purple-400/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative">Chat with Reader</span>
                </Link>
                <Link
                  to="/ai-astro"
                  className="px-12 py-5 bg-white/10 backdrop-blur-md border-2 border-purple-500/50 text-white font-bold text-lg rounded-full hover:bg-purple-600/50 transition-all duration-300 hover:scale-105"
                >
                  Try AI Reading
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for Animations */}
      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-100px) translateX(50px);
          }
          50% {
            transform: translateY(-200px) translateX(-50px);
          }
          75% {
            transform: translateY(-100px) translateX(50px);
          }
        }
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-50px) scale(1.1);
          }
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        @keyframes float-slow-reverse {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(50px) scale(1.1);
          }
        }
        .animate-float-slow-reverse {
          animation: float-slow-reverse 15s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes gradient-text {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 8s ease infinite;
        }
        @keyframes gradient-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-gradient-rotate {
          animation: gradient-rotate 8s linear infinite;
        }
        @keyframes float-card {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-30px) rotate(var(--rotation, 0deg));
          }
        }
        .animate-float-card {
          animation: float-card 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TarotReading;
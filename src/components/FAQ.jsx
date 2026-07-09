import React, { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Why Is Astrology So Accurate?",
      answer: "Astrology accuracy comes from thousands of years of careful observation linking planetary movements to human experiences. Experienced astrologers study birth charts that map cosmic influences at your exact birth moment, providing personalized insights rather than generic predictions for everyone."
    },
    {
      question: "Why Should You Choose PlutoAstro For An Astrology Horoscope?",
      answer: "PlutoAstro combines ancient Vedic wisdom with modern AI technology to provide highly accurate and personalized readings. Our expert astrologers have years of experience, and our AI-powered system ensures 24/7 availability. We offer detailed birth chart analysis, real-time consultations, and affordable pricing."
    },
    {
      question: "Is Astrology Prediction True?",
      answer: "Astrology has been practiced for over 5,000 years across various cultures. While it's not an exact science, millions of people worldwide trust astrological predictions for guidance. The accuracy depends on the astrologer's expertise, the quality of birth data, and your openness to the insights."
    },
    {
      question: "How Can Online Astrology Help Me In Predicting The Future?",
      answer: "Online astrology provides instant access to expert astrologers and AI-powered readings from anywhere. You can get personalized horoscopes, birth chart analysis, compatibility reports, and real-time consultations. Our platform uses advanced algorithms combined with traditional astrological principles."
    },
    {
      question: "How reliable is the PlutoAstro app?",
      answer: "PlutoAstro is highly reliable with a team of verified expert astrologers, secure payment systems, and positive user reviews. We maintain strict privacy policies and use encrypted connections to protect your data. Our AI system is trained on vast astrological databases."
    },
    {
      question: "How much does PlutoAstro cost?",
      answer: "PlutoAstro offers flexible pricing to suit different budgets. Basic horoscope readings start at just €9.99, while personalized consultations range from €19.99 to €99.99 depending on duration and astrologer expertise. We offer package deals, first-time user discounts, and loyalty rewards."
    },
    {
      question: "Can astrology help me find my soulmate?",
      answer: "Yes, astrology can provide valuable insights into compatibility and relationship dynamics. By analyzing birth charts, we can identify compatible signs, potential challenges, and the best timing for relationships. Our compatibility reports examine sun signs, moon signs, Venus placements, and other crucial factors."
    },
    {
      question: "What information do I need for a birth chart reading?",
      answer: "For an accurate birth chart reading, you need three key pieces of information: your exact date of birth, precise time of birth (as accurate as possible), and place of birth (city and country). The time of birth is crucial as it determines your ascendant sign and house placements."
    },
    {
      question: "How often should I consult an astrologer?",
      answer: "The frequency depends on your needs. Some people consult monthly for general guidance, while others seek readings during major life transitions like career changes, relationships, or important decisions. We recommend consulting during planetary transits, eclipses, or when you feel stuck."
    },
    {
      question: "Do you offer refunds if I'm not satisfied?",
      answer: "Yes, we offer a satisfaction guarantee. If you're not completely satisfied with your reading, contact our support team within 7 days for a full refund or a complimentary session with another astrologer. Your satisfaction is our priority."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 lg:py-32 px-4 lg:px-8">
      {/* Content */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-900/30 border border-purple-700/50 rounded-full text-sm font-semibold text-purple-300 mb-4 backdrop-blur-sm">
            FREQUENTLY ASKED
          </span>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Questions, before you<br />ask one.
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 mx-auto rounded-full"></div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
                openIndex === index
                  ? "bg-purple-900/40 border-purple-500/60 shadow-lg shadow-purple-900/30 backdrop-blur-md"
                  : "bg-purple-950/20 border-purple-700/30 hover:border-purple-600/50 backdrop-blur-sm"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 lg:px-8 py-5 lg:py-6 flex items-center justify-between text-left"
              >
                <span className="text-base lg:text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-purple-600 text-white rotate-180"
                      : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"
                  }`}
                >
                  <svg 
                    className="w-5 h-5 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 lg:px-8 pb-6">
                  <p className="text-purple-200/90 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-purple-300 text-lg mb-6">
            Still have questions? We're here to help!
          </p>
          <a
            href="/chat"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-900/50"
          >
            Chat with Our Team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
import React, { useRef, useState } from "react";
import { kundlicheck } from "../utils/validate";
import openai from "../utils/openai";
import { ASTRO_KUNDLI_PROMPT, GPT_LANG } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import { addForm } from "../store/configAppSlice";
import Chatbot from "./Chatbot";
import bg from "../image/bg1.jpg";
import kundli from "../image/kundli rishi.webp";
import lang from "../utils/langConstants";

const AstroKundli = () => {
  const user = useSelector((store) => store.user);
  const Bot = useSelector((store) => store.configApp.Bot);
  const dispatch = useDispatch();

  const name = useRef();
  const locality = useRef();
  const district = useRef();

  const [gender, setGender] = useState("");
  const [SelectedLanguage, setSelectedLanguage] = useState("English");
  const [result, setresult] = useState();
  const [loading, setLoading] = useState(false);
  const LangKey = useSelector((store) => store.configApp.lang);

  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");

  const handleSearch = async () => {
    console.log("=== BUTTON CLICKED ===");

    const nameValue = name.current?.value?.trim();
    const localityValue = locality.current?.value?.trim();
    const districtValue = district.current?.value?.trim();

    console.log("Form values:", {
      name: nameValue,
      locality: localityValue,
      district: districtValue,
      birthDate,
      birthTime,
      gender
    });

    if (!user) {
      toast.error("Please Login to Continue", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      dispatch(addForm());
      return;
    }

    if (!nameValue) {
      toast.error("Please enter your name", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!localityValue) {
      toast.error("Please enter birth place", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!districtValue) {
      toast.error("Please enter birth district", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!birthDate) {
      toast.error("Please select birth date", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!birthTime) {
      toast.error("Please select birth time", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!gender) {
      toast.error("Please select gender", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    const dateTimeValue = `${birthDate} ${birthTime}`;
    console.log("Combined datetime:", dateTimeValue);

    setLoading(true);

    const kundliPrompt = `
You are PlutoKundli AI, the flagship Vedic Astrology Engine of PlutoAstro.

Your task is to generate a PREMIUM, LUXURY, DETAILED ASTROLOGY REPORT.

IMPORTANT RULES:

1. Return ONLY VALID HTML.
2. Do NOT use markdown.
3. Do NOT use *** or ###.
4. Use only:
<h2>
<h3>
<p>
<ul>
<li>
<div>

5. Write entire report in ${SelectedLanguage}.
6. Address user by name.
7. Make report look like a professional astrology consultation.
8. Minimum 2000+ words.
9. Use elegant and detailed explanations.
10. Never say future is guaranteed.
11. Give practical guidance.

USER DETAILS

Name: ${nameValue}
Gender: ${gender}
Birth Date & Time: ${dateTimeValue}
Birth Place: ${localityValue}
District: ${districtValue}

GENERATE THESE SECTIONS:

<h2>🌟 Personalized Introduction</h2>

Warm welcome using user's name.

<h2>♋ Zodiac Sign Analysis</h2>

Detailed zodiac explanation.

<h2>🧠 Personality Blueprint</h2>

Strengths
Weaknesses
Hidden Traits
Emotional Nature

<h2>💼 Career & Professional Life</h2>

Best careers
Business potential
Leadership ability
Growth opportunities

<h2>🎓 Education Analysis</h2>

Learning style
Academic strengths

<h2>💰 Wealth & Financial Destiny</h2>

Money habits
Financial strengths
Investment mindset

<h2>❤️ Love & Relationship Insights</h2>

Romantic nature
Relationship strengths
Compatibility traits

<h2>💍 Marriage Analysis</h2>

Marriage tendencies
Partner qualities
Relationship guidance

<h2>🏥 Health & Wellness</h2>

General health tendencies
Mental wellness
Lifestyle advice

<h2>🔢 Lucky Numbers</h2>

Explain why.

<h2>🎨 Lucky Colors</h2>

Explain significance.

<h2>💎 Lucky Gemstones</h2>

Benefits and precautions.

<h2>🪐 Planetary Energy Reading</h2>

Explain planetary influences.

<h2>🙏 Powerful Vedic Remedies</h2>

Give practical remedies.

<h2>📅 2026 Outlook</h2>

Career
Finance
Relationships
Health

<h2>✨ Final Guidance</h2>

Motivational conclusion.

Make the report visually premium and beautifully structured.
`;
    try {
      console.log("Calling OpenAI API...");
      const data = await openai.chat.completions.create({
        messages: [{ role: "user", content: kundliPrompt }],
        model: "gpt-3.5-turbo",
      });

      console.log("API Response:", data);
      setresult(data?.choices?.[0]?.message?.content);

      toast.success("Insights generated successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    } catch (error) {
      console.error("OpenAI Error:", error);
      toast.error("Failed to generate insights: " + error.message, {
        position: "top-center",
        autoClose: 4000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }

    if (name.current) name.current.value = "";
    if (locality.current) locality.current.value = "";
    if (district.current) district.current.value = "";
    setBirthDate("");
    setBirthTime("");
    setGender("");
  };

  return (
    <div className="relative w-full min-h-screen">
      {Bot && <Chatbot />}
      <img
        alt="bg"
        className="h-full w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"
        src={bg}
      />

      <div className="pt-28 lg:pt-36 px-4 lg:px-20 pb-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-600 bg-opacity-20 border border-purple-500 text-purple-300 text-sm font-medium mb-4">
              🔮 AI-Powered Astrology
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4">
              Get Astro Insights
            </h1>
            <p className="text-lg text-purple-200 opacity-80 max-w-2xl mx-auto mb-6">
              Discover your destiny with our AI-powered Kundli analysis.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-700/30">
                <i className="ri-shield-check-line text-green-400"></i>
                <span className="text-purple-200 text-sm">100% Confidential</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-700/30">
                <i className="ri-time-line text-blue-400"></i>
                <span className="text-purple-200 text-sm">Instant Results</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-700/30">
                <i className="ri-star-line text-yellow-400"></i>
                <span className="text-purple-200 text-sm">50,000+ Reports</span>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-purple-950 bg-opacity-60 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-3xl p-6 lg:p-10 mb-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Left Side - Kundli Image */}
              <div className="lg:w-1/3 w-full flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <img
                    className="relative w-64 lg:w-80 z-10 drop-shadow-2xl"
                    alt="kundli"
                    src={kundli}
                  />
                </div>
                <p className="mt-4 text-purple-300 text-sm opacity-80 text-center">
                  Ancient Wisdom Meets Modern AI
                </p>
                
                {/* Features List */}
                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-start gap-3 text-left">
                    <i className="ri-check-double-line text-green-400 mt-1"></i>
                    <span className="text-purple-200 text-sm">Detailed 2000+ word report</span>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <i className="ri-check-double-line text-green-400 mt-1"></i>
                    <span className="text-purple-200 text-sm">Career & Finance insights</span>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <i className="ri-check-double-line text-green-400 mt-1"></i>
                    <span className="text-purple-200 text-sm">Love & Marriage analysis</span>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <i className="ri-check-double-line text-green-400 mt-1"></i>
                    <span className="text-purple-200 text-sm">Vedic remedies included</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="lg:w-2/3 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 uppercase mb-2">
                      Name *
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 outline-none focus:border-purple-400 focus:bg-opacity-60 transition-all"
                      type="text"
                      ref={name}
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Birth Place */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 uppercase mb-2">
                      Birth Place *
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 outline-none focus:border-purple-400 focus:bg-opacity-60 transition-all"
                      type="text"
                      ref={locality}
                      placeholder="Enter birth place"
                    />
                  </div>

                  {/* Birth District */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 uppercase mb-2">
                      Birth District *
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 outline-none focus:border-purple-400 focus:bg-opacity-60 transition-all"
                      type="text"
                      ref={district}
                      placeholder="Enter birth district"
                    />
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 uppercase mb-2">
                      Birth Date *
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 outline-none focus:border-purple-400 focus:bg-opacity-60 transition-all"
                      type="date"
                      value={birthDate}
                      onChange={(e) => {
                        console.log("Date selected:", e.target.value);
                        setBirthDate(e.target.value);
                      }}
                    />
                  </div>

                  {/* Birth Time */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 uppercase mb-2">
                      Birth Time *
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 outline-none focus:border-purple-400 focus:bg-opacity-60 transition-all"
                      type="time"
                      value={birthTime}
                      onChange={(e) => {
                        console.log("Time selected:", e.target.value);
                        setBirthTime(e.target.value);
                      }}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 uppercase mb-2">
                      Gender *
                    </label>
                    <div className="flex gap-4 bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-40 rounded-xl px-4 py-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={gender === "male"}
                          onChange={() => {
                            console.log("Gender selected: male");
                            setGender("male");
                          }}
                          className="w-4 h-4 accent-purple-500"
                        />
                        <span className="text-purple-200 text-sm font-medium">
                          Male
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={gender === "female"}
                          onChange={() => {
                            console.log("Gender selected: female");
                            setGender("female");
                          }}
                          className="w-4 h-4 accent-purple-500"
                        />
                        <span className="text-purple-200 text-sm font-medium">
                          Female
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-purple-300 uppercase mb-2">
                      Language
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-purple-900 bg-opacity-40 border border-purple-500 border-opacity-40 rounded-xl text-purple-200 outline-none focus:border-purple-400 focus:bg-opacity-60 transition-all cursor-pointer"
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      value={SelectedLanguage}
                    >
                      {GPT_LANG.map((lang) => (
                        <option
                          className="text-purple-200 bg-purple-900"
                          key={lang.identifier}
                          value={lang.identifier}
                        >
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Button clicked!");
                      handleSearch();
                    }}
                    disabled={loading}
                    className="relative group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <i className="ri-loader-4-line animate-spin text-xl"></i>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <i className="ri-magic-line text-xl"></i>
                        Get My Astro Insights
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Get Section */}
          <div className="bg-purple-950 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-20 rounded-3xl p-6 lg:p-10 mb-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
              What You'll Get in Your Report
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-star-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Personality Blueprint</h3>
                  <p className="text-purple-200 text-sm">Deep insights into your strengths, weaknesses, and hidden traits</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-briefcase-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Career Guidance</h3>
                  <p className="text-purple-200 text-sm">Best career paths, business potential, and growth opportunities</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-heart-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Love & Marriage</h3>
                  <p className="text-purple-200 text-sm">Romantic nature, compatibility traits, and partner qualities</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-money-dollar-circle-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Wealth & Finance</h3>
                  <p className="text-purple-200 text-sm">Financial destiny, money habits, and investment mindset</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-heart-pulse-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Health & Wellness</h3>
                  <p className="text-purple-200 text-sm">Health tendencies, mental wellness, and lifestyle advice</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-gift-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Lucky Elements</h3>
                  <p className="text-purple-200 text-sm">Lucky numbers, colors, gemstones, and Vedic remedies</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-purple-950 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-20 rounded-3xl p-6 lg:p-10 mb-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                  <span className="text-white text-3xl font-bold">1</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Enter Your Details</h3>
                <p className="text-purple-200 text-sm">Fill in your birth date, time, place, and other information</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                  <span className="text-white text-3xl font-bold">2</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">AI Analysis</h3>
                <p className="text-purple-200 text-sm">Our advanced AI analyzes your birth chart using Vedic astrology</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                  <span className="text-white text-3xl font-bold">3</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Get Your Report</h3>
                <p className="text-purple-200 text-sm">Receive a detailed 2000+ word personalized astrology report</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="bg-purple-950 bg-opacity-60 backdrop-blur-sm border border-purple-500 border-opacity-30 rounded-3xl p-6 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                  Your Astro Insights
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
              </div>

              <div
                className="result-container max-w-none text-purple-100"
                dangerouslySetInnerHTML={{
                  __html: result,
                }}
              />

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setresult(null)}
                  className="px-6 py-3 bg-purple-600 bg-opacity-30 border border-purple-500 rounded-full text-purple-200 font-medium hover:bg-opacity-50 transition-all"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Generate New
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-purple-600 bg-opacity-30 border border-purple-500 rounded-full text-purple-200 font-medium hover:bg-opacity-50 transition-all"
                >
                  <i className="ri-printer-line mr-2"></i>
                  Print Report
                </button>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="bg-purple-950 bg-opacity-40 backdrop-blur-sm border border-purple-500 border-opacity-20 rounded-3xl p-6 lg:p-10 mt-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <h3 className="text-white font-semibold mb-2">How accurate is the AI Kundli report?</h3>
                <p className="text-purple-200 text-sm">Our AI uses advanced Vedic astrology principles and analyzes your birth chart with precision. The report provides detailed insights based on planetary positions at your birth time.</p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <h3 className="text-white font-semibold mb-2">How long does it take to generate the report?</h3>
                <p className="text-purple-200 text-sm">The AI generates your comprehensive report in 30-60 seconds. You'll receive a detailed 2000+ word analysis covering all aspects of your life.</p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <h3 className="text-white font-semibold mb-2">Is my personal information safe?</h3>
                <p className="text-purple-200 text-sm">Absolutely! We use bank-level encryption and never share your data. Your birth details are only used to generate your report and are not stored permanently.</p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-xl border border-purple-700/30">
                <h3 className="text-white font-semibold mb-2">Can I get the report in other languages?</h3>
                <p className="text-purple-200 text-sm">Yes! We support multiple languages including English, Hindi, Spanish, French, German, and more. Select your preferred language before generating the report.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AstroKundli;
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Chatbot from "./Chatbot";
import bg from "../image/bg1.jpg";
import panditreading from "../image/pandit reading.webp";
import lang from "../utils/langConstants";

const Horoscope = () => {
  const { type, sign } = useParams();
  const navigate = useNavigate();
  const [horoscopeData, setHoroscopeData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const Bot = useSelector((store) => store.configApp.Bot);
  const LangKey = useSelector((store) => store.configApp.lang);

  const horoscopeTypes = [
    { key: "daily", label: "Daily Horoscope", path: "/horoscope/daily", icon: "☀️" },
    { key: "weekly", label: "Weekly Horoscope", path: "/horoscope/weekly", icon: "🌙" },
    { key: "monthly", label: "Monthly Horoscope", path: "/horoscope/monthly", icon: "⭐" },
    { key: "love", label: "Love Horoscope", path: "/horoscope/love", icon: "💖" },
  ];

  const zodiacSigns = {
    aries: { name: "Aries", symbol: "♈", element: "Fire", ruler: "Mars", quality: "Cardinal" },
    taurus: { name: "Taurus", symbol: "♉", element: "Earth", ruler: "Venus", quality: "Fixed" },
    gemini: { name: "Gemini", symbol: "♊", element: "Air", ruler: "Mercury", quality: "Mutable" },
    cancer: { name: "Cancer", symbol: "♋", element: "Water", ruler: "Moon", quality: "Cardinal" },
    leo: { name: "Leo", symbol: "♌", element: "Fire", ruler: "Sun", quality: "Fixed" },
    virgo: { name: "Virgo", symbol: "♍", element: "Earth", ruler: "Mercury", quality: "Mutable" },
    libra: { name: "Libra", symbol: "♎", element: "Air", ruler: "Venus", quality: "Cardinal" },
    scorpio: { name: "Scorpio", symbol: "♏", element: "Water", ruler: "Pluto", quality: "Fixed" },
    sagittarius: { name: "Sagittarius", symbol: "♐", element: "Fire", ruler: "Jupiter", quality: "Mutable" },
    capricorn: { name: "Capricorn", symbol: "♑", element: "Earth", ruler: "Saturn", quality: "Cardinal" },
    aquarius: { name: "Aquarius", symbol: "♒", element: "Air", ruler: "Uranus", quality: "Fixed" },
    pisces: { name: "Pisces", symbol: "♓", element: "Water", ruler: "Neptune", quality: "Mutable" },
  };

  // Comprehensive horoscope data
  const getHoroscopeContent = (typeKey, signKey) => {
    const signData = zodiacSigns[signKey] || zodiacSigns.aries;
    
    const content = {
      daily: {
        aries: {
          main: "Today brings powerful transformative energies for Aries. The cosmic alignment suggests breakthrough moments in your personal growth. You may find unexpected opportunities presenting themselves - trust your intuition when making important decisions. Financial matters show promise, but avoid impulsive purchases. Lucky numbers: 7, 14, 23. Lucky color: Purple.",
          love: "Romance is highlighted today. Single signs may meet someone intriguing through friends or social media. Coupled signs should plan something special together. Evening is perfect for intimate conversations.",
          career: "Professional opportunities are on the horizon. Your hard work is being noticed by superiors. Don't hesitate to showcase your skills in meetings. A collaborative project shows great promise.",
          health: "Energy levels are high. Great day for physical activities and starting a new fitness routine. Stay hydrated and get adequate rest. Evening meditation brings mental clarity.",
          lucky: { numbers: [7, 14, 23], color: "Purple", time: "7:00 PM - 11:00 PM", stone: "Diamond" },
          compatibility: ["Leo", "Sagittarius", "Gemini"],
          mood: "Optimistic and Energetic",
          planetary: "Moon in Taurus brings stability. Mars energizes your career sector. Venus enhances romantic prospects.",
        },
        taurus: {
          main: "This is a day of stability and growth for Taurus. Your practical approach to challenges will yield positive results. Focus on long-term goals rather than quick fixes. A financial opportunity may present itself - evaluate it carefully. In love, patience and understanding create deeper connections.",
          love: "Steady romance blooms today. Show your partner appreciation through small gestures. Single signs: Someone values your reliability and warmth.",
          career: "Financial matters take center stage. A bonus or raise is possible. Your practical wisdom earns respect from colleagues.",
          health: "Focus on nourishing your body with wholesome foods. A nature walk will rejuvenate your spirit.",
          lucky: { numbers: [6, 15, 24], color: "Green", time: "2:00 PM - 6:00 PM", stone: "Emerald" },
          compatibility: ["Virgo", "Capricorn", "Cancer"],
          mood: "Grounded and Content",
          planetary: "Venus blesses your relationships. Saturn brings discipline to finances.",
        },
        gemini: {
          main: "Communication is your superpower today, Gemini. Your quick wit and adaptability open doors to new possibilities. Social interactions bring joy and potential collaborations. Mental stimulation is high - perfect time for learning or teaching.",
          love: "Flirty and fun energy surrounds your love life. Witty banter could spark romance. Couples should have that talk they've been avoiding.",
          career: "Networking pays off today. A conversation could lead to a new opportunity. Your ideas are heard and appreciated.",
          health: "Mental health needs attention. Try journaling or meditation to clear your busy mind.",
          lucky: { numbers: [5, 14, 23], color: "Yellow", time: "10:00 AM - 2:00 PM", stone: "Agate" },
          compatibility: ["Libra", "Aquarius", "Aries"],
          mood: "Curious and Social",
          planetary: "Mercury enhances your communication. Jupiter expands your social circle.",
        },
        cancer: {
          main: "Emotional depth and intuition guide you today, Cancer. Your nurturing nature is appreciated by loved ones. Home and family matters take priority. Trust your feelings when making decisions - they're especially accurate now.",
          love: "Deep emotional connections form today. Vulnerability is your strength. Family bonds strengthen through heartfelt conversations.",
          career: "Your intuition guides professional decisions. A creative project flourishes under today's energies.",
          health: "Emotional wellness is key. Practice self-care rituals and connect with water elements.",
          lucky: { numbers: [2, 7, 16], color: "Silver", time: "6:00 PM - 10:00 PM", stone: "Pearl" },
          compatibility: ["Scorpio", "Pisces", "Taurus"],
          mood: "Intuitive and Nurturing",
          planetary: "Moon amplifies your emotions. Neptune enhances spiritual connection.",
        },
        leo: {
          main: "Your natural charisma shines brightly today, Leo. Leadership opportunities arise - embrace them with confidence. Creative self-expression brings recognition and rewards. Romance and pleasure are highlighted.",
          love: "Romance is grand and dramatic today. Plan something memorable. Your generous heart attracts admiration.",
          career: "The spotlight is yours. Present your ideas with confidence. Recognition from higher-ups is likely.",
          health: "Your heart (literally) needs attention. Cardio exercises are favored today.",
          lucky: { numbers: [1, 10, 19], color: "Gold", time: "12:00 PM - 4:00 PM", stone: "Ruby" },
          compatibility: ["Aries", "Sagittarius", "Libra"],
          mood: "Confident and Radiant",
          planetary: "Sun illuminates your path. Jupiter brings expansion to creative ventures.",
        },
        virgo: {
          main: "Attention to detail serves you well today, Virgo. Your analytical skills solve complex problems efficiently. Health and wellness routines benefit from your focus. Work matters progress smoothly through methodical effort.",
          love: "Show love through acts of service. Your partner notices and appreciates your thoughtfulness.",
          career: "Your organizational skills shine. A complex project benefits from your methodical approach.",
          health: "Perfect day to start a new wellness routine. Your body responds well to structure.",
          lucky: { numbers: [5, 14, 23], color: "Navy", time: "8:00 AM - 12:00 PM", stone: "Sapphire" },
          compatibility: ["Taurus", "Capricorn", "Cancer"],
          mood: "Analytical and Productive",
          planetary: "Mercury sharpens your mind. Pluto brings transformation to health habits.",
        },
        libra: {
          main: "Harmony and balance are your themes today, Libra. Relationships flourish through diplomatic communication. Beauty and art inspire you. Partnerships - personal or professional - advance positively.",
          love: "Romance is balanced and harmonious. Compromise comes easily. Beauty surrounds your love life.",
          career: "Partnerships thrive today. Your diplomatic skills resolve workplace conflicts elegantly.",
          health: "Balance is key. Mix activity with rest. Your lower back needs extra care.",
          lucky: { numbers: [6, 15, 24], color: "Pink", time: "4:00 PM - 8:00 PM", stone: "Opal" },
          compatibility: ["Gemini", "Aquarius", "Leo"],
          mood: "Harmonious and Charming",
          planetary: "Venus enhances beauty and love. Mars brings balance to assertiveness.",
        },
        scorpio: {
          main: "Intensity and transformation mark your day, Scorpio. Deep insights reveal hidden truths. Your intuitive powers are heightened - trust them. Financial matters, especially shared resources, require attention.",
          love: "Passionate and intense romance today. Deep conversations strengthen bonds. Trust is built through vulnerability.",
          career: "Your investigative skills uncover important details. A breakthrough in a complex matter is likely.",
          health: "Emotional release is needed. Deep breathing or therapy brings healing.",
          lucky: { numbers: [8, 17, 26], color: "Crimson", time: "9:00 PM - 1:00 AM", stone: "Topaz" },
          compatibility: ["Cancer", "Pisces", "Virgo"],
          mood: "Intense and Transformative",
          planetary: "Pluto deepens your insights. Mars fuels your determination.",
        },
        sagittarius: {
          main: "Adventure and expansion call to you today, Sagittarius. Your optimistic outlook attracts opportunities. Learning, teaching, or traveling broadens your horizons. Take calculated risks - the universe supports your growth.",
          love: "Adventure fuels romance. Plan something spontaneous. Long-distance connections are favored.",
          career: "International opportunities arise. Your optimism attracts collaborators. Teaching or mentoring brings fulfillment.",
          health: "Outdoor activities are highly favored. Your hips and thighs need attention.",
          lucky: { numbers: [3, 12, 21], color: "Purple", time: "3:00 PM - 7:00 PM", stone: "Turquoise" },
          compatibility: ["Aries", "Leo", "Libra"],
          mood: "Adventurous and Optimistic",
          planetary: "Jupiter expands your horizons. Sun brings vitality to adventures.",
        },
        capricorn: {
          main: "Discipline and ambition guide your path today, Capricorn. Career matters advance through persistent effort. Your practical wisdom earns respect from authorities. Long-term planning yields future rewards.",
          love: "Commitment deepens today. Show your partner your long-term vision. Stability is attractive to you.",
          career: "Your hard work pays off. A promotion or recognition is likely. Structure brings success.",
          health: "Your bones and joints need care. Calcium-rich foods are favored today.",
          lucky: { numbers: [4, 13, 22], color: "Brown", time: "6:00 AM - 10:00 AM", stone: "Garnet" },
          compatibility: ["Taurus", "Virgo", "Scorpio"],
          mood: "Ambitious and Disciplined",
          planetary: "Saturn rewards your discipline. Pluto transforms your career path.",
        },
        aquarius: {
          main: "Innovation and humanitarian concerns occupy your mind, Aquarius. Your unique perspective solves problems others can't. Friends and groups support your visions. Technology and progressive ideas fascinate you.",
          love: "Unconventional romance suits you. Friendship is the foundation. Group social events may spark connections.",
          career: "Your innovative ideas gain traction. Technology projects are favored. Humanitarian work brings fulfillment.",
          health: "Try alternative healing methods. Your ankles and circulatory system need attention.",
          lucky: { numbers: [4, 13, 22], color: "Electric Blue", time: "11:00 PM - 3:00 AM", stone: "Amethyst" },
          compatibility: ["Gemini", "Libra", "Sagittarius"],
          mood: "Innovative and Humanitarian",
          planetary: "Uranus sparks innovation. Jupiter expands your social impact.",
        },
        pisces: {
          main: "Dreams and spirituality guide you today, Pisces. Your compassionate nature heals others. Creative and artistic pursuits flourish. Intuition reveals deeper truths. Time near water or in meditation restores your spirit.",
          love: "Dreamy romance envelops you. Soulmate connections deepen. Artistic dates are favored.",
          career: "Creative projects flourish. Your intuition guides professional decisions. Healing professions are blessed.",
          health: "Water therapy or swimming brings healing. Your feet need extra care.",
          lucky: { numbers: [3, 12, 21], color: "Sea Green", time: "8:00 PM - 12:00 AM", stone: "Aquamarine" },
          compatibility: ["Cancer", "Scorpio", "Taurus"],
          mood: "Dreamy and Compassionate",
          planetary: "Neptune enhances intuition. Venus brings artistic inspiration.",
        },
      },
      weekly: {
        aries: {
          main: "This week marks a significant turning point for Aries. Monday through Wednesday favor career advancement and professional recognition. Midweek brings clarity to relationship matters. Weekend energies support spiritual growth and self-reflection. Key theme: Balance between ambition and inner peace.",
          love: "Relationships take center stage this week. Single signs: Midweek brings a promising connection. Coupled signs: Plan a romantic getaway or deep heart-to-heart conversation.",
          career: "Career momentum builds this week. Tuesday brings recognition for past efforts. Thursday favors negotiations and contracts.",
          health: "Focus on work-life balance. Stress levels may peak midweek - practice relaxation techniques.",
          lucky: { numbers: [3, 12, 21, 30], color: "Royal Blue", time: "Wednesday Evening", stone: "Diamond" },
          compatibility: ["Leo", "Sagittarius", "Gemini"],
          mood: "Ambitious and Reflective",
          planetary: "Mercury retrograde ends Wednesday. Venus enters your sign Friday.",
        },
        taurus: {
          main: "A week of steady progress awaits Taurus. Financial matters stabilize through careful planning. Mid-week favors important conversations. Weekend brings romantic opportunities. Focus on building solid foundations for future success.",
          love: "Steady romance develops. Quality time with partner strengthens bonds. Single signs: Someone reliable catches your eye.",
          career: "Financial stability improves. Your practical approach earns recognition. Long-term planning pays off.",
          health: "Nourishing routines bring benefits. Focus on sustainable wellness practices.",
          lucky: { numbers: [6, 15, 24, 33], color: "Emerald", time: "Friday Afternoon", stone: "Emerald" },
          compatibility: ["Virgo", "Capricorn", "Cancer"],
          mood: "Stable and Prosperous",
          planetary: "Venus blesses your finances. Saturn rewards your discipline.",
        },
        gemini: {
          main: "Communication flows effortlessly this week, Gemini. New connections bring unexpected opportunities. Midweek favors creative projects. Weekend is perfect for short trips or learning something new.",
          love: "Flirty energy surrounds you. Witty conversations spark romance. Social events bring romantic possibilities.",
          career: "Networking brings opportunities. Your ideas gain traction. Teaching or writing projects flourish.",
          health: "Mental stimulation is high. Balance with meditation and rest.",
          lucky: { numbers: [5, 14, 23, 32], color: "Yellow", time: "Wednesday Morning", stone: "Agate" },
          compatibility: ["Libra", "Aquarius", "Aries"],
          mood: "Curious and Communicative",
          planetary: "Mercury enhances all communication. Jupiter expands your social circle.",
        },
        cancer: {
          main: "Emotional healing takes center stage this week, Cancer. Family matters require your attention. Midweek brings financial clarity. Weekend favors creative expression. Trust your intuition when making important decisions.",
          love: "Deep emotional connections form. Family blessings support romance. Vulnerability strengthens bonds.",
          career: "Your intuition guides professional choices. Creative projects flourish. Home-based work is favored.",
          health: "Emotional wellness improves through self-care. Water therapies are beneficial.",
          lucky: { numbers: [2, 7, 16, 25], color: "Silver", time: "Monday Evening", stone: "Pearl" },
          compatibility: ["Scorpio", "Pisces", "Taurus"],
          mood: "Intuitive and Healing",
          planetary: "Moon amplifies emotions. Neptune enhances spiritual connection.",
        },
        leo: {
          main: "Your leadership skills shine this week, Leo. Professional recognition comes your way. Midweek favors romantic encounters. Weekend is ideal for creative pursuits. Balance confidence with humility for best results.",
          love: "Romance is grand and memorable. Plan special gestures. Your charisma attracts admirers.",
          career: "The spotlight is yours all week. Presentations and leadership roles are favored.",
          health: "Your heart and spine need attention. Joyful activities boost vitality.",
          lucky: { numbers: [1, 10, 19, 28], color: "Gold", time: "Sunday Afternoon", stone: "Ruby" },
          compatibility: ["Aries", "Sagittarius", "Libra"],
          mood: "Confident and Celebrated",
          planetary: "Sun illuminates your path. Jupiter brings expansion.",
        },
        virgo: {
          main: "Organization brings success this week, Virgo. Health improvements are possible through consistent effort. Midweek favors important negotiations. Weekend brings pleasant social interactions.",
          love: "Acts of service express love beautifully. Your partner notices your thoughtfulness.",
          career: "Your analytical skills solve complex problems. Recognition for detailed work comes your way.",
          health: "New wellness routines take hold. Your body responds well to structure.",
          lucky: { numbers: [5, 14, 23, 32], color: "Navy", time: "Tuesday Morning", stone: "Sapphire" },
          compatibility: ["Taurus", "Capricorn", "Cancer"],
          mood: "Organized and Productive",
          planetary: "Mercury sharpens your mind. Pluto transforms health habits.",
        },
        libra: {
          main: "Relationships flourish this week, Libra. Partnership matters advance positively. Midweek favors financial decisions. Weekend is perfect for artistic pursuits.",
          love: "Harmonious romance blooms. Compromise comes easily. Beauty surrounds your love life.",
          career: "Partnerships thrive. Your diplomatic skills resolve conflicts. Creative collaborations succeed.",
          health: "Balance is key. Mix activity with rest. Lower back needs care.",
          lucky: { numbers: [6, 15, 24, 33], color: "Pink", time: "Friday Evening", stone: "Opal" },
          compatibility: ["Gemini", "Aquarius", "Leo"],
          mood: "Harmonious and Charming",
          planetary: "Venus enhances beauty. Mars brings balanced assertiveness.",
        },
        scorpio: {
          main: "Transformation accelerates this week, Scorpio. Deep insights change your perspective. Midweek favors financial planning. Weekend brings intense romantic energy.",
          love: "Passionate and transformative romance. Deep conversations strengthen bonds. Trust deepens.",
          career: "Your investigative skills uncover important details. Breakthroughs in complex matters occur.",
          health: "Emotional release brings healing. Deep therapeutic work is favored.",
          lucky: { numbers: [8, 17, 26, 35], color: "Crimson", time: "Tuesday Night", stone: "Topaz" },
          compatibility: ["Cancer", "Pisces", "Virgo"],
          mood: "Transformative and Intense",
          planetary: "Pluto deepens insights. Mars fuels determination.",
        },
        sagittarius: {
          main: "Adventure calls this week, Sagittarius. Travel or learning opportunities arise. Midweek favors philosophical discussions. Weekend brings spontaneous joy.",
          love: "Adventure fuels romance. Spontaneous gestures are appreciated. Long-distance connections favored.",
          career: "International opportunities arise. Your optimism attracts collaborators. Teaching brings fulfillment.",
          health: "Outdoor activities are highly favored. Adventure sports bring vitality.",
          lucky: { numbers: [3, 12, 21, 30], color: "Purple", time: "Thursday Afternoon", stone: "Turquoise" },
          compatibility: ["Aries", "Leo", "Libra"],
          mood: "Adventurous and Joyful",
          planetary: "Jupiter expands horizons. Sun brings vitality.",
        },
        capricorn: {
          main: "Career advancement is highlighted this week, Capricorn. Your hard work gains recognition. Midweek favors important meetings. Weekend brings family harmony.",
          love: "Commitment deepens. Show your long-term vision. Stability is attractive.",
          career: "Your discipline pays off. Promotions or recognition likely. Structure brings success.",
          health: "Your bones and joints need care. Calcium-rich foods favored.",
          lucky: { numbers: [4, 13, 22, 31], color: "Brown", time: "Saturday Morning", stone: "Garnet" },
          compatibility: ["Taurus", "Virgo", "Scorpio"],
          mood: "Ambitious and Accomplished",
          planetary: "Saturn rewards discipline. Pluto transforms career path.",
        },
        aquarius: {
          main: "Innovation drives your week, Aquarius. Unique solutions emerge for old problems. Midweek favors group activities. Weekend brings unexpected friendships.",
          love: "Unconventional romance suits you. Friendship is foundation. Group events spark connections.",
          career: "Your innovative ideas gain traction. Technology projects favored. Humanitarian work blessed.",
          health: "Alternative healing methods work well. Ankles need attention.",
          lucky: { numbers: [4, 13, 22, 31], color: "Electric Blue", time: "Saturday Night", stone: "Amethyst" },
          compatibility: ["Gemini", "Libra", "Sagittarius"],
          mood: "Innovative and Social",
          planetary: "Uranus sparks innovation. Jupiter expands social impact.",
        },
        pisces: {
          main: "Spiritual growth accelerates this week, Pisces. Creative inspiration flows freely. Midweek favors emotional healing. Weekend brings romantic dreams.",
          love: "Dreamy romance envelops you. Soulmate connections deepen. Artistic dates favored.",
          career: "Creative projects flourish. Your intuition guides decisions. Healing professions blessed.",
          health: "Water therapy brings healing. Feet need extra care.",
          lucky: { numbers: [3, 12, 21, 30], color: "Sea Green", time: "Thursday Night", stone: "Aquamarine" },
          compatibility: ["Cancer", "Scorpio", "Taurus"],
          mood: "Dreamy and Inspired",
          planetary: "Neptune enhances intuition. Venus brings artistic inspiration.",
        },
      },
      monthly: {
        aries: {
          main: "This month brings profound transformation for Aries. First half favors career growth and financial planning. Second half emphasizes relationships and emotional healing. Major themes: Personal power, authentic expression, and releasing old patterns.",
          love: "Love undergoes beautiful transformation. Venus aligns bringing opportunities. Single: Meaningful encounters await. Coupled: Plan romantic adventures.",
          career: "Career sector activated strongly. Major projects succeed. Leadership opportunities arise around the 10th.",
          health: "Health requires attention. Establish sustainable wellness routines. Mid-month favors new exercise programs.",
          lucky: { numbers: [5, 14, 23, 32, 41], color: "Deep Magenta", time: "Full Moon Phase", stone: "Diamond" },
          compatibility: ["Fire & Air Signs"],
          mood: "Transformative and Empowered",
          planetary: "Jupiter trine your sun sign. Saturn supports long-term planning.",
        },
        taurus: {
          main: "Stability and growth define this month for Taurus. Financial opportunities increase through practical efforts. Relationships deepen through honest communication. Mid-month brings creative inspiration.",
          love: "Romance blooms steadily. Your sensual nature attracts admirers. Stability and warmth valued.",
          career: "Financial opportunities increase. Your practical efforts yield results. Long-term security improves.",
          health: "Nourishing routines bring benefits. Focus on sustainable wellness.",
          lucky: { numbers: [6, 15, 24, 33, 42], color: "Emerald Green", time: "Venus Hour", stone: "Emerald" },
          compatibility: ["Earth & Water Signs"],
          mood: "Stable and Growing",
          planetary: "Venus blesses relationships. Saturn rewards discipline.",
        },
        gemini: {
          main: "Communication and learning dominate this month, Gemini. New connections expand your horizons. Mid-month favors creative projects. Travel opportunities arise.",
          love: "Mental connection sparks romance. Witty conversations attract partners. Variety keeps spark alive.",
          career: "Networking brings opportunities. Your ideas gain traction. Teaching or writing projects flourish.",
          health: "Mental stimulation high. Balance with meditation. Nervous system needs care.",
          lucky: { numbers: [5, 14, 23, 32, 41], color: "Bright Yellow", time: "Mercury Hour", stone: "Agate" },
          compatibility: ["Air & Fire Signs"],
          mood: "Curious and Expansive",
          planetary: "Mercury enhances communication. Jupiter expands horizons.",
        },
        cancer: {
          main: "Emotional fulfillment is highlighted this month, Cancer. Home improvements bring joy. Family matters resolve positively. Mid-month brings financial gains.",
          love: "Emotional depth defines romance. Your nurturing nature draws loving partners. Family blessings support love.",
          career: "Your intuition guides professional choices. Creative projects flourish. Home-based work favored.",
          health: "Emotional wellness improves through self-care. Water therapies beneficial.",
          lucky: { numbers: [2, 7, 16, 25, 34], color: "Silver", time: "Moon Hour", stone: "Pearl" },
          compatibility: ["Water & Earth Signs"],
          mood: "Fulfilled and Nurtured",
          planetary: "Moon amplifies emotions. Neptune enhances spiritual connection.",
        },
        leo: {
          main: "Recognition and success mark this month for Leo. Creative projects flourish. Romantic opportunities increase. Mid-month favors important career decisions.",
          love: "Passion and drama characterize love. Your charisma attracts admirers. Grand romantic gestures favored.",
          career: "The spotlight is yours. Presentations and leadership roles favored. Recognition comes your way.",
          health: "Your heart and spine need attention. Joyful activities boost vitality.",
          lucky: { numbers: [1, 10, 19, 28, 37], color: "Gold", time: "Sun Hour", stone: "Ruby" },
          compatibility: ["Fire & Air Signs"],
          mood: "Celebrated and Radiant",
          planetary: "Sun illuminates path. Jupiter brings expansion.",
        },
        virgo: {
          main: "Health and productivity improve this month, Virgo. Work projects advance through careful planning. Mid-month brings relationship clarity.",
          love: "Acts of service express love. Your partner notices thoughtfulness. Practical romance suits you.",
          career: "Your analytical skills solve complex problems. Recognition for detailed work comes.",
          health: "New wellness routines take hold. Your body responds well to structure.",
          lucky: { numbers: [5, 14, 23, 32, 41], color: "Navy Blue", time: "Mercury Hour", stone: "Sapphire" },
          compatibility: ["Earth & Water Signs"],
          mood: "Productive and Healthy",
          planetary: "Mercury sharpens mind. Pluto transforms health habits.",
        },
        libra: {
          main: "Harmony and balance characterize this month, Libra. Partnerships flourish through cooperation. Mid-month brings financial opportunities.",
          love: "Harmonious romance blooms. Compromise comes easily. Beauty surrounds love life.",
          career: "Partnerships thrive. Your diplomatic skills resolve conflicts. Creative collaborations succeed.",
          health: "Balance is key. Mix activity with rest. Lower back needs care.",
          lucky: { numbers: [6, 15, 24, 33, 42], color: "Pink", time: "Venus Hour", stone: "Opal" },
          compatibility: ["Air & Fire Signs"],
          mood: "Harmonious and Balanced",
          planetary: "Venus enhances beauty. Mars brings balanced assertiveness.",
        },
        scorpio: {
          main: "Transformation and renewal define this month, Scorpio. Deep emotional healing occurs. Financial matters improve through strategic planning.",
          love: "Intense and transformative romance. Deep conversations strengthen bonds. Trust deepens through vulnerability.",
          career: "Your investigative skills uncover important details. Breakthroughs in complex matters occur.",
          health: "Emotional release brings healing. Deep therapeutic work favored.",
          lucky: { numbers: [8, 17, 26, 35, 44], color: "Crimson", time: "Pluto Hour", stone: "Topaz" },
          compatibility: ["Water & Earth Signs"],
          mood: "Transformative and Renewed",
          planetary: "Pluto deepens insights. Mars fuels determination.",
        },
        sagittarius: {
          main: "Adventure and expansion highlight this month, Sagittarius. Travel or education opportunities arise. Mid-month brings philosophical insights.",
          love: "Adventure fuels romance. Spontaneous gestures appreciated. Long-distance connections favored.",
          career: "International opportunities arise. Your optimism attracts collaborators. Teaching brings fulfillment.",
          health: "Outdoor activities highly favored. Adventure sports bring vitality.",
          lucky: { numbers: [3, 12, 21, 30, 39], color: "Purple", time: "Jupiter Hour", stone: "Turquoise" },
          compatibility: ["Fire & Air Signs"],
          mood: "Adventurous and Expansive",
          planetary: "Jupiter expands horizons. Sun brings vitality.",
        },
        capricorn: {
          main: "Career advancement accelerates this month, Capricorn. Professional recognition increases. Mid-month brings financial stability.",
          love: "Commitment deepens. Show long-term vision. Stability is attractive to you.",
          career: "Your discipline pays off. Promotions or recognition likely. Structure brings success.",
          health: "Your bones and joints need care. Calcium-rich foods favored.",
          lucky: { numbers: [4, 13, 22, 31, 40], color: "Brown", time: "Saturn Hour", stone: "Garnet" },
          compatibility: ["Earth & Water Signs"],
          mood: "Accomplished and Stable",
          planetary: "Saturn rewards discipline. Pluto transforms career path.",
        },
        aquarius: {
          main: "Innovation and social connections dominate this month, Aquarius. Unique ideas gain support. Mid-month brings group opportunities.",
          love: "Unconventional romance suits you. Friendship is foundation. Group events spark connections.",
          career: "Your innovative ideas gain traction. Technology projects favored. Humanitarian work blessed.",
          health: "Alternative healing methods work well. Ankles need attention.",
          lucky: { numbers: [4, 13, 22, 31, 40], color: "Electric Blue", time: "Uranus Hour", stone: "Amethyst" },
          compatibility: ["Air & Fire Signs"],
          mood: "Innovative and Connected",
          planetary: "Uranus sparks innovation. Jupiter expands social impact.",
        },
        pisces: {
          main: "Spiritual growth and creativity flourish this month, Pisces. Intuitive insights guide important decisions. Mid-month brings romantic opportunities.",
          love: "Dreamy romance envelops you. Soulmate connections deepen. Artistic dates favored.",
          career: "Creative projects flourish. Your intuition guides decisions. Healing professions blessed.",
          health: "Water therapy brings healing. Feet need extra care.",
          lucky: { numbers: [3, 12, 21, 30, 39], color: "Sea Green", time: "Neptune Hour", stone: "Aquamarine" },
          compatibility: ["Water & Earth Signs"],
          mood: "Spiritual and Creative",
          planetary: "Neptune enhances intuition. Venus brings artistic inspiration.",
        },
      },
      love: {
        aries: {
          main: "Love life undergoes beautiful transformation for Aries. Venus aligns with your sign, bringing romantic opportunities and deeper connections. Single signs: A meaningful encounter awaits, possibly through travel or cultural events. Coupled signs: Plan a romantic getaway or explore new experiences together.",
          love: "Passionate and direct in love. You pursue what you want with determination. Fire signs and air signs most compatible. Adventure and spontaneity keep spark alive.",
          career: "Your leadership qualities attract admirers. Professional success makes you more magnetic. Balance work and love wisely.",
          health: "Physical vitality enhances romantic appeal. Exercise boosts confidence and attractiveness. Heart health important for passion.",
          lucky: { numbers: [2, 6, 9, 15], color: "Rose Pink", time: "Friday Evening", stone: "Ruby" },
          compatibility: ["Leo", "Sagittarius", "Gemini"],
          mood: "Romantic and Passionate",
          planetary: "Venus conjunct your sign. Mars enhances passion.",
        },
        taurus: {
          main: "Romance blooms steadily for Taurus. Your sensual nature attracts admirers. Single signs: Someone appreciates your stability and warmth. Coupled signs: Deepen intimacy through shared pleasures and quality time.",
          love: "Loyal and sensual in love. You value stability and physical touch. Earth signs and water signs most compatible. Patience creates lasting bonds.",
          career: "Your reliability attracts partners. Financial stability makes you more attractive. Balance work and romance.",
          health: "Sensual wellness practices enhance romantic life. Good nutrition boosts vitality. Throat chakra activation helps expression.",
          lucky: { numbers: [6, 15, 24, 33], color: "Emerald", time: "Friday Afternoon", stone: "Emerald" },
          compatibility: ["Virgo", "Capricorn", "Cancer"],
          mood: "Sensual and Devoted",
          planetary: "Venus blesses your love life. Moon enhances sensuality.",
        },
        gemini: {
          main: "Communication enhances your love life, Gemini. Mental connection sparks romance. Single signs: Meet someone intriguing through social media or friends. Coupled signs: Keep conversations light and playful.",
          love: "Intellectual connection is key. You need mental stimulation. Air signs and fire signs most compatible. Variety keeps spark alive.",
          career: "Your wit attracts partners. Networking brings romantic possibilities. Balance communication in all relationships.",
          health: "Mental wellness enhances romantic life. Reduce stress through meditation. Nervous system care important.",
          lucky: { numbers: [5, 14, 23, 32], color: "Yellow", time: "Wednesday Evening", stone: "Agate" },
          compatibility: ["Libra", "Aquarius", "Aries"],
          mood: "Flirty and Intellectual",
          planetary: "Mercury enhances communication. Venus sparks romance.",
        },
        cancer: {
          main: "Emotional depth defines your romantic journey, Cancer. Your nurturing nature draws loving partners. Single signs: Family introductions bring potential matches. Coupled signs: Create a cozy, romantic atmosphere at home.",
          love: "Deeply emotional and nurturing. You seek security and deep connection. Water signs and earth signs most compatible. Emotional honesty strengthens bonds.",
          career: "Your caring nature attracts partners. Home-based work brings romantic balance. Family values important in partner choice.",
          health: "Emotional wellness crucial for romantic life. Self-care rituals enhance attraction. Moon cycles affect romantic energy.",
          lucky: { numbers: [2, 7, 16, 25], color: "Silver", time: "Monday Evening", stone: "Pearl" },
          compatibility: ["Scorpio", "Pisces", "Taurus"],
          mood: "Nurturing and Emotional",
          planetary: "Moon enhances emotions. Venus deepens love.",
        },
        leo: {
          main: "Passion and drama characterize your love life, Leo. Your charisma attracts admirers. Single signs: Romance blooms in creative or social settings. Coupled signs: Plan grand romantic gestures.",
          love: "Romantic and dramatic. You love grand gestures and being adored. Fire signs and air signs most compatible. Generosity in love brings joy.",
          career: "Your charisma attracts partners. Leadership qualities make you magnetic. Spotlight in love and career.",
          health: "Heart health important for romantic vitality. Joyful activities boost attractiveness. Sun energy enhances romantic appeal.",
          lucky: { numbers: [1, 10, 19, 28], color: "Gold", time: "Sunday Evening", stone: "Ruby" },
          compatibility: ["Aries", "Sagittarius", "Libra"],
          mood: "Passionate and Dramatic",
          planetary: "Sun illuminates romance. Venus enhances charm.",
        },
        virgo: {
          main: "Practical romance suits you, Virgo. Acts of service express your love. Single signs: Meet someone through work or health activities. Coupled signs: Support your partner's goals.",
          love: "Practical and devoted. You show love through acts of service. Earth signs and water signs most compatible. Attention to detail strengthens connection.",
          career: "Your reliability attracts partners. Work connections may spark romance. Balance perfectionism with acceptance.",
          health: "Wellness routines enhance romantic life. Health-focused partners compatible. Self-care boosts attractiveness.",
          lucky: { numbers: [5, 14, 23, 32], color: "Navy", time: "Wednesday Morning", stone: "Sapphire" },
          compatibility: ["Taurus", "Capricorn", "Cancer"],
          mood: "Devoted and Practical",
          planetary: "Mercury enhances communication. Venus brings romance.",
        },
        libra: {
          main: "Harmony and beauty define your romance, Libra. Partnership is highlighted. Single signs: Meet your match through artistic events. Coupled signs: Restore balance through compromise.",
          love: "Romantic and partnership-focused. You seek harmony and balance. Air signs and fire signs most compatible. Diplomacy resolves conflicts.",
          career: "Your charm attracts partners. Partnerships in career may spark romance. Balance work and love.",
          health: "Balance crucial for romantic wellness. Beauty rituals enhance attraction. Lower back care important.",
          lucky: { numbers: [6, 15, 24, 33], color: "Pink", time: "Friday Evening", stone: "Opal" },
          compatibility: ["Gemini", "Aquarius", "Leo"],
          mood: "Romantic and Harmonious",
          planetary: "Venus enhances beauty. Mars brings balance.",
        },
        scorpio: {
          main: "Intensity marks your love life, Scorpio. Deep emotional connections form. Single signs: Attract someone through your magnetic presence. Coupled signs: Explore intimacy on deeper levels.",
          love: "Intense and all-consuming. You love deeply and expect loyalty. Water signs and earth signs most compatible. Transform relationships through honesty.",
          career: "Your intensity attracts partners. Professional power makes you magnetic. Balance power dynamics in love.",
          health: "Emotional release crucial for romantic wellness. Deep healing enhances attraction. Reproductive health important.",
          lucky: { numbers: [8, 17, 26, 35], color: "Crimson", time: "Tuesday Night", stone: "Topaz" },
          compatibility: ["Cancer", "Pisces", "Virgo"],
          mood: "Intense and Magnetic",
          planetary: "Pluto deepens intimacy. Mars enhances passion.",
        },
        sagittarius: {
          main: "Adventure fuels your romance, Sagittarius. Freedom and fun are essential. Single signs: Meet someone while traveling or learning. Coupled signs: Keep things spontaneous and exciting.",
          love: "Adventurous and freedom-loving. You need space in relationships. Fire signs and air signs most compatible. Optimism creates joyful love.",
          career: "Your optimism attracts partners. Travel or learning connections spark romance. Balance freedom with commitment.",
          health: "Outdoor activities enhance romantic appeal. Adventure sports boost vitality. Hips and legs need care.",
          lucky: { numbers: [3, 12, 21, 30], color: "Purple", time: "Thursday Evening", stone: "Turquoise" },
          compatibility: ["Aries", "Leo", "Libra"],
          mood: "Adventurous and Free",
          planetary: "Jupiter expands love. Sun brings joy.",
        },
        capricorn: {
          main: "Commitment defines your approach to love, Capricorn. Stability matters most. Single signs: Meet someone through professional circles. Coupled signs: Build long-term plans together.",
          love: "Loyal and committed. You take relationships seriously. Earth signs and water signs most compatible. Your loyalty creates lasting bonds.",
          career: "Your ambition attracts partners. Professional success makes you magnetic. Balance work and love wisely.",
          health: "Discipline enhances romantic wellness. Structure in self-care important. Bones and joints need attention.",
          lucky: { numbers: [4, 13, 22, 31], color: "Brown", time: "Saturday Evening", stone: "Garnet" },
          compatibility: ["Taurus", "Virgo", "Scorpio"],
          mood: "Committed and Stable",
          planetary: "Saturn brings commitment. Venus enhances romance.",
        },
        aquarius: {
          main: "Unconventional romance suits you, Aquarius. Friendship is the foundation. Single signs: Meet someone through groups or causes. Coupled signs: Embrace each other's uniqueness.",
          love: "Unconventional and independent. You value friendship and intellectual connection. Air signs and fire signs most compatible. Your independence strengthens relationship.",
          career: "Your uniqueness attracts partners. Humanitarian work brings romantic connections. Balance independence with intimacy.",
          health: "Alternative wellness practices enhance romantic life. Innovation in self-care. Ankles and circulation need care.",
          lucky: { numbers: [4, 13, 22, 31], color: "Electric Blue", time: "Saturday Night", stone: "Amethyst" },
          compatibility: ["Gemini", "Libra", "Sagittarius"],
          mood: "Unconventional and Free",
          planetary: "Uranus brings uniqueness. Venus enhances love.",
        },
        pisces: {
          main: "Dreamy romance envelops you, Pisces. Spiritual connection matters. Single signs: Meet someone through creative or spiritual activities. Coupled signs: Share your fantasies and dreams.",
          love: "Romantic and dreamy. You seek soulmate connection. Water signs and earth signs most compatible. Your compassion creates deep intimacy.",
          career: "Your compassion attracts partners. Creative or healing work brings romantic connections. Balance dreams with reality.",
          health: "Spiritual practices enhance romantic wellness. Water therapies beneficial. Feet and immune system need care.",
          lucky: { numbers: [3, 12, 21, 30], color: "Sea Green", time: "Thursday Night", stone: "Aquamarine" },
          compatibility: ["Cancer", "Scorpio", "Taurus"],
          mood: "Dreamy and Spiritual",
          planetary: "Neptune enhances dreams. Venus brings romance.",
        },
      },
    };

    return content[typeKey]?.[signKey] || content.daily.aries;
  };

  // Handle redirect if no type or sign
  useEffect(() => {
    if (!type || !sign) {
      setShouldRedirect(true);
      const newType = type || "daily";
      const newSign = sign || "aries";
      navigate(`/horoscope/${newType}/${newSign}`, { replace: true });
    }
  }, [type, sign, navigate]);

  // Fetch horoscope data
  useEffect(() => {
    if (shouldRedirect) return;
    if (!type || !sign) return;

    const fetchHoroscope = async () => {
      setLoading(true);
      setError(null);
      try {
        const signKey = sign.toLowerCase();
        const typeKey = type.toLowerCase();
        
        const horoscope = getHoroscopeContent(typeKey, signKey);
        
        setTimeout(() => {
          setHoroscopeData(horoscope);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error("Error fetching horoscope:", err);
        setError("Unable to load horoscope. Please try again.");
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [type, sign, shouldRedirect]);

  if (shouldRedirect || !type || !sign) {
    return (
      <div className="relative flex-col justify-center items-center mx-4 lg:mx-24 flex w-12/12 pt-24 lg:pt-32 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading horoscope...</p>
        </div>
      </div>
    );
  }

  const currentType = type;
  const currentSign = sign;
  const signData = zodiacSigns[currentSign];

  return (
    <div className="relative flex-col justify-center items-center mx-4 lg:mx-24 flex w-12/12 pt-24 lg:pt-32">
      {/* Animated Background Stars */}
      <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {Bot && <Chatbot />}
      <img
        alt="bg"
        className="h-screen brightness-50 w-full md:scale-100 scale-x-[3] fixed top-0 left-0 -z-40"
        src={bg}
      ></img>
      
      <div className="mt-8 lg:mt-12 w-full relative z-10">
        
        {/* Horoscope Type Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {horoscopeTypes.map((hType) => (
            <Link
              key={hType.key}
              to={`${hType.path}/${currentSign}`}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                currentType === hType.key
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-900/50 scale-105 border border-purple-400/50"
                  : "bg-purple-900/40 text-purple-300 border border-purple-700/50 hover:border-purple-500/70 backdrop-blur-sm hover:scale-105"
              }`}
            >
              <span className="text-xl">{hType.icon}</span>
              <span>{hType.label}</span>
            </Link>
          ))}
        </div>

        {/* Zodiac Sign Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-8">
          {Object.entries(zodiacSigns).map(([key, data]) => (
            <Link
              key={key}
              to={`/horoscope/${currentType}/${key}`}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 group ${
                currentSign === key
                  ? "bg-gradient-to-br from-purple-600 to-fuchsia-600 border-purple-400 shadow-lg shadow-purple-900/50"
                  : "bg-purple-900/40 border-purple-700/50 hover:border-purple-500/70 backdrop-blur-sm"
              }`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{data.symbol}</div>
              <div className="text-xs font-semibold text-center text-white">{data.name}</div>
            </Link>
          ))}
        </div>

        {/* Title Section */}
        <div className="flex justify-center items-center w-full flex-col mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl lg:text-7xl">{signData?.symbol}</span>
            <div>
              <span className="lg:text-4xl text-2xl text-center lg:font-semibold font-[600] text-purple-300 tracking-wider opacity-90 lg:tracking-wide block">
                {horoscopeTypes.find(h => h.key === currentType)?.label || "Your Horoscope"}
              </span>
              <span className="text-lg text-purple-200/80">
                for {signData?.name} • {signData?.element} Sign • Ruled by {signData?.ruler}
              </span>
            </div>
          </div>
          <img
            alt="line"
            className="lg:w-48 w-28"
            src="data:image/png;base64,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"
          ></img>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="lg:mt-6 mt-3 bg-purple-950 bg-opacity-65 shadow-sm shadow-purple-800 rounded-xl lg:rounded-3xl py-12 lg:py-16 px-4 lg:px-8 w-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-purple-300 text-lg">Loading your cosmic guidance...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="lg:mt-6 mt-3 bg-red-950 bg-opacity-65 shadow-sm shadow-red-800 rounded-xl lg:rounded-3xl py-8 lg:py-12 px-4 lg:px-8 w-full text-center">
            <p className="text-red-300 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg hover:scale-105 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Horoscope Content */}
        {!loading && !error && horoscopeData && (
          <>
            {/* Main Prediction Card */}
            <div className="lg:mt-6 mt-3 bg-gradient-to-br from-purple-950/80 via-purple-900/60 to-fuchsia-950/80 backdrop-blur-md shadow-lg shadow-purple-900/50 rounded-3xl border border-purple-600/50 py-6 lg:py-10 px-4 lg:px-10 w-full relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-3xl"></div>
              
              <div className="relative flex flex-col lg:flex-row justify-evenly py-2 w-full items-start gap-6">
                <div className="lg:w-5/12 w-full justify-center items-center lg:justify-start lg:items-start flex">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 rounded-full blur-3xl"></div>
                    <img
                      alt="horoscope"
                      className="relative w-48 lg:w-full max-w-sm"
                      src={panditreading}
                    ></img>
                  </div>
                </div>
                <div className="lg:w-9/12 lg:pt-0 pt-6 w-full">
                  <div className="flex justify-start h-full items-start flex-col">
                    <span className="text-xl lg:text-3xl font-medium lg:font-semibold tracking-wider lg:tracking-wide text-purple-300 pb-0.5 lg:pb-2 border-dotted border-yellow-500 border-b-2">
                      {horoscopeTypes.find(h => h.key === currentType)?.label} for {signData?.name} {signData?.symbol} :
                    </span>
                    <span className="lg:text-base text-sm tracking-wider font-normal pt-2 lg:pt-4 lg:tracking-wide text-purple-100 leading-relaxed">
                      {horoscopeData.main}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lucky Elements Card */}
            <div className="mt-6 bg-gradient-to-br from-amber-950/60 via-orange-900/40 to-red-950/60 backdrop-blur-md rounded-3xl border border-amber-600/40 p-6 lg:p-8 w-full">
              <h3 className="text-2xl lg:text-3xl font-bold text-amber-200 mb-6 flex items-center gap-3">
                <span className="text-3xl">🍀</span>
                Lucky Elements for Today
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-2xl p-4 border border-amber-600/30 hover:border-amber-500/60 transition-all hover:scale-105">
                  <div className="text-amber-300 text-sm mb-2">Lucky Numbers</div>
                  <div className="text-white font-bold text-lg">{horoscopeData.lucky.numbers.join(", ")}</div>
                </div>
                <div className="bg-black/30 rounded-2xl p-4 border border-amber-600/30 hover:border-amber-500/60 transition-all hover:scale-105">
                  <div className="text-amber-300 text-sm mb-2">Lucky Color</div>
                  <div className="text-white font-bold text-lg">{horoscopeData.lucky.color}</div>
                </div>
                <div className="bg-black/30 rounded-2xl p-4 border border-amber-600/30 hover:border-amber-500/60 transition-all hover:scale-105">
                  <div className="text-amber-300 text-sm mb-2">Best Time</div>
                  <div className="text-white font-bold text-sm">{horoscopeData.lucky.time}</div>
                </div>
                <div className="bg-black/30 rounded-2xl p-4 border border-amber-600/30 hover:border-amber-500/60 transition-all hover:scale-105">
                  <div className="text-amber-300 text-sm mb-2">Power Stone</div>
                  <div className="text-white font-bold text-lg">{horoscopeData.lucky.stone}</div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { key: "overview", label: "Overview", icon: "✨" },
                { key: "love", label: "Love", icon: "💖" },
                { key: "career", label: "Career", icon: "💼" },
                { key: "health", label: "Health", icon: "🏃" },
                { key: "planetary", label: "Planets", icon: "🪐" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg scale-105"
                      : "bg-purple-900/40 text-purple-300 border border-purple-700/50 hover:border-purple-500/70 backdrop-blur-sm"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6 bg-gradient-to-br from-purple-950/70 via-purple-900/50 to-fuchsia-950/70 backdrop-blur-md rounded-3xl border border-purple-600/40 p-6 lg:p-8 w-full min-h-[200px]">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-purple-200 flex items-center gap-2">
                    <span>✨</span> Today's Overview
                  </h3>
                  <p className="text-purple-100 leading-relaxed">{horoscopeData.main}</p>
                  <div className="pt-4 border-t border-purple-700/30">
                    <p className="text-purple-300 text-sm">
                      <strong>Mood:</strong> {horoscopeData.mood}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "love" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-pink-200 flex items-center gap-2">
                    <span>💖</span> Love & Relationships
                  </h3>
                  <p className="text-purple-100 leading-relaxed">{horoscopeData.love}</p>
                  <div className="pt-4 border-t border-purple-700/30">
                    <p className="text-purple-300 text-sm mb-2">
                      <strong>Best Compatibility:</strong>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {horoscopeData.compatibility.map((sign, idx) => (
                        <span key={idx} className="px-3 py-1 bg-pink-900/50 rounded-full text-sm text-pink-200 border border-pink-600/40">
                          {sign}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "career" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-blue-200 flex items-center gap-2">
                    <span>💼</span> Career & Finance
                  </h3>
                  <p className="text-purple-100 leading-relaxed">{horoscopeData.career}</p>
                </div>
              )}
              {activeTab === "health" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-green-200 flex items-center gap-2">
                    <span>🏃</span> Health & Wellness
                  </h3>
                  <p className="text-purple-100 leading-relaxed">{horoscopeData.health}</p>
                </div>
              )}
              {activeTab === "planetary" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-indigo-200 flex items-center gap-2">
                    <span>🪐</span> Planetary Influences
                  </h3>
                  <p className="text-purple-100 leading-relaxed">{horoscopeData.planetary}</p>
                  <div className="pt-4 border-t border-purple-700/30 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-300 text-sm"><strong>Element:</strong> {signData?.element}</p>
                      <p className="text-purple-300 text-sm mt-1"><strong>Ruler:</strong> {signData?.ruler}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm"><strong>Quality:</strong> {signData?.quality}</p>
                      <p className="text-purple-300 text-sm mt-1"><strong>Symbol:</strong> {signData?.symbol}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cosmic Advice Card */}
            <div className="mt-6 bg-gradient-to-br from-indigo-950/70 via-purple-900/50 to-fuchsia-950/70 backdrop-blur-md rounded-3xl border border-indigo-600/40 p-6 lg:p-8 w-full">
              <h3 className="text-2xl lg:text-3xl font-bold text-indigo-200 mb-4 flex items-center gap-3">
                <span className="text-3xl">🔮</span>
                Cosmic Advice
              </h3>
              <p className="text-purple-100 leading-relaxed text-lg italic">
                "The stars incline, they do not compel. Use today's energies wisely, {signData?.name}, and let your intuition guide you through the cosmic dance of life."
              </p>
            </div>
          </>
        )}

        {/* Horoscope Bottom Section */}
        <div className="mt-12 lg:mt-16 w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-purple-300 mb-4">
              Today's horoscope for zodiac signs
            </h2>
            <p className="text-purple-200/80 text-lg">(Unlock Your Cosmic Destiny with AstroGPT Horoscopes)</p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-fuchsia-900/60 backdrop-blur-md rounded-3xl border border-purple-700/50 p-8 lg:p-12 mb-12">
            <p className="text-purple-200/90 leading-relaxed text-lg text-center">
              Welcome to the realm where stars align and destinies unfold. Dive into the celestial mysteries with AstroGPT Horoscopes, where each prediction is a glimpse into the cosmic tapestry of your life. Our astrological insights, powered by cutting-edge GPT technology, provide guidance and illumination as you navigate the celestial currents. Step into the world of AstroGPT Horoscopes and discover the wisdom written in the stars.
            </p>
          </div>

          {/* Four Elements Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center text-purple-300 mb-8">The Four Elements</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-900/60 to-orange-800/40 backdrop-blur-md rounded-2xl border border-red-600/40 p-6 hover:scale-105 transition-all">
                <div className="text-4xl mb-3">🔥</div>
                <h4 className="text-xl font-bold text-white mb-2">Fire Signs</h4>
                <p className="text-purple-200/80 text-sm">Aries, Leo, Sagittarius - Passionate, dynamic, and temperamental</p>
              </div>
              <div className="bg-gradient-to-br from-green-900/60 to-emerald-800/40 backdrop-blur-md rounded-2xl border border-green-600/40 p-6 hover:scale-105 transition-all">
                <div className="text-4xl mb-3">🌍</div>
                <h4 className="text-xl font-bold text-white mb-2">Earth Signs</h4>
                <p className="text-purple-200/80 text-sm">Taurus, Virgo, Capricorn - Practical, grounded, and material-focused</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/60 to-cyan-800/40 backdrop-blur-md rounded-2xl border border-blue-600/40 p-6 hover:scale-105 transition-all">
                <div className="text-4xl mb-3">💨</div>
                <h4 className="text-xl font-bold text-white mb-2">Air Signs</h4>
                <p className="text-purple-200/80 text-sm">Gemini, Libra, Aquarius - Intellectual, communicative, and social</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/60 to-purple-800/40 backdrop-blur-md rounded-2xl border border-indigo-600/40 p-6 hover:scale-105 transition-all">
                <div className="text-4xl mb-3">💧</div>
                <h4 className="text-xl font-bold text-white mb-2">Water Signs</h4>
                <p className="text-purple-200/80 text-sm">Cancer, Scorpio, Pisces - Emotional, intuitive, and sensitive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horoscope;
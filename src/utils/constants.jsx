// src/utils/constants.js

export const MULTI_LANG = [
  { identifier: "en", name: "English", flag: "🇬" },
  { identifier: "de", name: "Deutsch", flag: "🇩🇪" },
  { identifier: "it", name: "Italiano", flag: "🇮🇹" },
  { identifier: "ar", name: "العربية", flag: "🇦🇪" },
  { identifier: "fr", name: "Français", flag: "🇫" },
  { identifier: "pt", name: "Português", flag: "🇵🇹" },
  { identifier: "ja", name: "日本語", flag: "🇯🇵" },
  { identifier: "ru", name: "Русский", flag: "🇷" },
  { identifier: "nl", name: "Nederlands", flag: "🇳🇱" },
  { identifier: "es", name: "Español", flag: "🇪" },
];

export const GPT_LANG = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "ar", label: "العربية" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
  { value: "ja", label: "日本語" },
  { value: "ru", label: "Русский" },
  { value: "nl", label: "Nederlands" },
  { value: "es", label: "Español" },
];

export const PROFILE_IMG = "https://via.placeholder.com/150";

export const TALK_PROMPT = "Talk to our expert astrologers";

export const CHAT_BOT = {
  name: "Pluto Bot",
  avatar: "https://via.placeholder.com/100",
};

// ✅ UPDATED - Sirf 4 types chahiye
export const HOROSCOPE = {
  types: ["daily", "weekly", "monthly", "love"],
  defaultType: "daily",
  cacheDuration: 3600000,
};

export const ZODIAC_SIGNS = [
  { name: "Aries", date: "Mar 21 - Apr 19", icon: "♈" },
  { name: "Taurus", date: "Apr 20 - May 20", icon: "♉" },
  { name: "Gemini", date: "May 21 - Jun 20", icon: "♊" },
  { name: "Cancer", date: "Jun 21 - Jul 22", icon: "♋" },
  { name: "Leo", date: "Jul 23 - Aug 22", icon: "♌" },
  { name: "Virgo", date: "Aug 23 - Sep 22", icon: "♍" },
  { name: "Libra", date: "Sep 23 - Oct 22", icon: "♎" },
  { name: "Scorpio", date: "Oct 23 - Nov 21", icon: "♏" },
  { name: "Sagittarius", date: "Nov 22 - Dec 21", icon: "♐" },
  { name: "Capricorn", date: "Dec 22 - Jan 19", icon: "♑" },
  { name: "Aquarius", date: "Jan 20 - Feb 18", icon: "♒" },
  { name: "Pisces", date: "Feb 19 - Mar 20", icon: "♓" },
];

export const ASTROLOGY_CATEGORIES = [
  { name: "Western Astrology", icon: "⭐" },
  { name: "Numerology", icon: "🔢" },
  { name: "Tarot Reading", icon: "🎴" },
  { name: "Face Reading", icon: "👤" },
  { name: "Feng Shui", icon: "🏠" },
  { name: "Life Coaching", icon: "🎯" },
  { name: "Psychology", icon: "🧠" },
  { name: "Palmistry", icon: "✋" },
  { name: "Crystal Healing", icon: "💎" },
  { name: "Meditation", icon: "🧘" },
];

export const FILTER_OPTIONS = {
  all: "All",
  topRated: "Top Rated",
  offer: "Special Offer",
  price: "Price",
  experience: "Experience",
  availability: "Available Now",
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Prefer not to say" },
];

export const BIRTH_DISTRICTS = [
  "London",
  "New York",
  "Los Angeles",
  "Paris",
  "Berlin",
  "Rome",
  "Dubai",
  "Tokyo",
  "Sydney",
  "Toronto",
  "Singapore",
  "Amsterdam",
  "Madrid",
  "Moscow",
  "Other",
];

export const DEFAULT_AVATAR = "https://via.placeholder.com/150";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const API_ENDPOINTS = {
  astrologers: "/api/astrologers",
  aiAstrologers: "/api/ai-astrologers",
  horoscope: "/api/horoscope",
  auth: "/api/auth",
  admin: "/api/admin",
  openai: "/api/openai",
};

export const TOAST_CONFIG = {
  position: "top-center",
  autoClose: 3000,
  theme: "dark",
};

export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  OPTIONS: [12, 24, 48],
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "experience", label: "Most Experienced" },
];

export const CONSULTATION_TYPES = {
  chat: "Chat",
  call: "Voice Call",
  video: "Video Call",
};

export const TIME_ZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "Europe/Rome", label: "Rome (CET/CEST)" },
  { value: "Europe/Moscow", label: "Moscow (MSK)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET/CEST)" },
  { value: "Europe/Madrid", label: "Madrid (CET/CEST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
  { value: "America/Toronto", label: "Toronto (EST/EDT)" },
];

export const COUNTRIES = [
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "IT", name: "Italy", dialCode: "+39" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "ES", name: "Spain", dialCode: "+34" },
  { code: "PT", name: "Portugal", dialCode: "+351" },
  { code: "NL", name: "Netherlands", dialCode: "+31" },
  { code: "RU", name: "Russia", dialCode: "+7" },
  { code: "JP", name: "Japan", dialCode: "+81" },
  { code: "AU", name: "Australia", dialCode: "+61" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "SG", name: "Singapore", dialCode: "+65" },
];

export const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
];

export const CONSULTATION_DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 90, label: "90 minutes" },
];

export const RATING_OPTIONS = [
  { value: 5, label: "5 Stars" },
  { value: 4, label: "4+ Stars" },
  { value: 3, label: "3+ Stars" },
];

export const AVAILABILITY_STATUS = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
};
/**
 * ==========================================================
 *  PlutoAstro — Calculators (frontend)
 *  Single registry for every calculator: slugs, endpoints,
 *  copy and form kinds. Pages and navigation read from here
 *  so routes/labels live in exactly one place.
 * ==========================================================
 */

export const CALCULATOR_API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL || "https://plutoastro-backend.onrender.com";

/* kind: which form the calculator uses
   - "numerology" : name + date of birth
   - "ayanamsa"   : date (+ optional time) + time zone
   - "birth"      : full birth details for one person
   - "pair"       : full birth details for two people          */
export const CALCULATORS = [
  {
    slug: "numerology",
    name: "Numerology Calculator",
    short: "Numerology",
    icon: "🔢",
    kind: "numerology",
    endpoint: "/api/calculators/numerology",
    tagline: "Life Path, Expression & Soul Urge numbers",
    about:
      "Turn your birth date and name into your core numerology numbers — Life Path, Birthday, Expression (Destiny), Soul Urge and Personality — with the full digit-by-digit calculation shown.",
    accent: "from-fuchsia-500 to-purple-700",
  },
  {
    slug: "moon-sign",
    name: "Moon Sign Calculator",
    short: "Moon Sign",
    icon: "🌙",
    kind: "birth",
    endpoint: "/api/calculators/moon-sign",
    tagline: "Your emotional core, from the real Moon position",
    about:
      "Find the zodiac sign the Moon occupied at the exact moment you were born — computed from the Swiss Ephemeris, not a date table. Includes degree, element and interpretation.",
    accent: "from-violet-500 to-indigo-700",
  },
  {
    slug: "sun-sign",
    name: "Sun Sign Calculator",
    short: "Sun Sign",
    icon: "☀️",
    kind: "birth",
    endpoint: "/api/calculators/sun-sign",
    tagline: "Your true zodiac sign by the Sun's real position",
    about:
      "Your Western zodiac sign calculated from the Sun's actual ecliptic longitude at your birth moment — accurate even on cusp days when date tables disagree.",
    accent: "from-amber-400 to-orange-600",
  },
  {
    slug: "rashi",
    name: "Rashi Calculator",
    short: "Rashi",
    icon: "♒",
    kind: "birth",
    endpoint: "/api/calculators/rashi",
    tagline: "Your Vedic Moon sign (sidereal)",
    about:
      "Your Rashi — the sidereal Moon sign used in Vedic astrology — with the Lahiri ayanamsa, plus your birth Nakshatra and Vashya group.",
    accent: "from-purple-500 to-fuchsia-700",
  },
  {
    slug: "ascendant",
    name: "Ascendant Calculator",
    short: "Ascendant",
    icon: "🌅",
    kind: "birth",
    endpoint: "/api/calculators/ascendant",
    tagline: "Rising sign & Lagna from your exact birth time",
    about:
      "The sign rising on the eastern horizon at your birth moment — computed for your exact time and coordinates. Shows both the tropical Ascendant and the sidereal Lagna.",
    accent: "from-rose-500 to-purple-700",
  },
  {
    slug: "ayanamsa",
    name: "Ayanamsa Calculator",
    short: "Ayanamsa",
    icon: "📐",
    kind: "ayanamsa",
    endpoint: "/api/calculators/ayanamsa",
    tagline: "Precise ayanamsa for any date & time",
    about:
      "The exact ayanamsa (tropical→sidereal offset) for any moment, in ten classical systems including Lahiri, Raman and Krishnamurti — with a full comparison table.",
    accent: "from-sky-500 to-purple-700",
  },
  {
    slug: "nakshatra",
    name: "Nakshatra Calculator",
    short: "Nakshatra",
    icon: "✨",
    kind: "birth",
    endpoint: "/api/calculators/nakshatra",
    tagline: "Birth star & pada from the sidereal Moon",
    about:
      "Your Janma Nakshatra — the lunar mansion the sidereal Moon occupied at birth — with pada, ruling planet, deity, Gana, Yoni and Nadi.",
    accent: "from-indigo-500 to-violet-700",
  },
  {
    slug: "love-calculator",
    name: "Love Compatibility Calculator",
    short: "Love Match",
    icon: "💜",
    kind: "pair",
    endpoint: "/api/calculators/love-compatibility",
    tagline: "Guna Milan + Western synastry for two charts",
    about:
      "Classical Vedic Ashtakoota (Guna Milan) scoring plus real Western synastry aspects between both birth charts — strengths, challenges and an honest overall score.",
    accent: "from-pink-500 to-purple-700",
  },
  {
    slug: "friendship-calculator",
    name: "Friendship Compatibility Calculator",
    short: "Friendship Match",
    icon: "🤝",
    kind: "pair",
    endpoint: "/api/calculators/friendship-compatibility",
    tagline: "How two charts get along as friends",
    about:
      "Friendship chemistry between two people: communication compatibility from Mercury and Moon contacts, shared strengths, and the differences to expect.",
    accent: "from-cyan-500 to-purple-700",
  },
  {
    slug: "planetary-transits",
    name: "Planetary Transits Chart",
    short: "Transits",
    icon: "🪐",
    kind: "birth",
    endpoint: "/api/calculators/planetary-transits",
    tagline: "Live planetary positions, retrogrades, sign changes & upcoming transits",
    about:
      "A premium 12-sign circular transit wheel computed from the Swiss Ephemeris for your selected date, time and time zone — shows real planetary positions, degrees, retrograde/direct status, sign changes and upcoming transits to your natal planets. Designed for users in India, UK, USA and worldwide, with full IANA time zone and DST support.",
    accent: "from-indigo-500 to-fuchsia-700",
    // Hidden from the Calculators listing/nav: Planetary Changes is now a
    // separate top-level navbar feature at /planetary-changes. The backend
    // endpoint stays live for that page; only the frontend listing hides it.
    hidden: true,
  },
];

export const calculatorBySlug = (slug) =>
  CALCULATORS.find((calc) => calc.slug === (slug || "").toLowerCase());

export const calculatorTitle = (calc) =>
  calc ? `${calc.name} — PlutoAstro` : "Calculators — PlutoAstro";

// Calculators shown on the /calculators listing page. Planetary Transits is
// hidden here because Planetary Changes is a separate top-level navbar
// feature (route /planetary-changes) — but it stays registered above so the
// backend engine + direct lookups keep working unchanged.
export const LISTED_CALCULATORS = CALCULATORS.filter((calc) => !calc.hidden);

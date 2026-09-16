/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Shared astrological reference data (single source of truth)
 *
 *  This file holds ONLY static reference tables (signs,
 *  nakshatras, friendship of planets, kuta scoring tables).
 *  Every calculator service reads from here so the rules live
 *  in exactly one place.
 * ==========================================================
 */

/* =========================
   ZODIAC SIGNS
   index 0 = Aries (0° - 30°)
========================= */

const SIGNS = [
  {
    index: 0,
    name: "Aries",
    symbol: "♈",
    sanskrit: "Mesha",
    element: "Fire",
    modality: "Cardinal",
    ruler: "Mars",
    varna: "Kshatriya",
    vashya: "Chatushpada",
    westernRange: "Mar 21 - Apr 19",
  },
  {
    index: 1,
    name: "Taurus",
    symbol: "♉",
    sanskrit: "Vrishabha",
    element: "Earth",
    modality: "Fixed",
    ruler: "Venus",
    varna: "Vaishya",
    vashya: "Chatushpada",
    westernRange: "Apr 20 - May 20",
  },
  {
    index: 2,
    name: "Gemini",
    symbol: "♊",
    sanskrit: "Mithuna",
    element: "Air",
    modality: "Mutable",
    ruler: "Mercury",
    varna: "Shudra",
    vashya: "Manava",
    westernRange: "May 21 - Jun 20",
  },
  {
    index: 3,
    name: "Cancer",
    symbol: "♋",
    sanskrit: "Karka",
    element: "Water",
    modality: "Cardinal",
    ruler: "Moon",
    varna: "Brahmin",
    vashya: "Jalachara",
    westernRange: "Jun 21 - Jul 22",
  },
  {
    index: 4,
    name: "Leo",
    symbol: "♌",
    sanskrit: "Simha",
    element: "Fire",
    modality: "Fixed",
    ruler: "Sun",
    varna: "Kshatriya",
    vashya: "Vanachara",
    westernRange: "Jul 23 - Aug 22",
  },
  {
    index: 5,
    name: "Virgo",
    symbol: "♍",
    sanskrit: "Kanya",
    element: "Earth",
    modality: "Mutable",
    ruler: "Mercury",
    varna: "Vaishya",
    vashya: "Manava",
    westernRange: "Aug 23 - Sep 22",
  },
  {
    index: 6,
    name: "Libra",
    symbol: "♎",
    sanskrit: "Tula",
    element: "Air",
    modality: "Cardinal",
    ruler: "Venus",
    varna: "Shudra",
    vashya: "Manava",
    westernRange: "Sep 23 - Oct 22",
  },
  {
    index: 7,
    name: "Scorpio",
    symbol: "♏",
    sanskrit: "Vrishchika",
    element: "Water",
    modality: "Fixed",
    ruler: "Mars",
    varna: "Brahmin",
    vashya: "Keeta",
    westernRange: "Oct 23 - Nov 21",
  },
  {
    index: 8,
    name: "Sagittarius",
    symbol: "♐",
    sanskrit: "Dhanu",
    element: "Fire",
    modality: "Mutable",
    ruler: "Jupiter",
    varna: "Kshatriya",
    vashya: "Manava",
    westernRange: "Nov 22 - Dec 21",
  },
  {
    index: 9,
    name: "Capricorn",
    symbol: "♑",
    sanskrit: "Makara",
    element: "Earth",
    modality: "Cardinal",
    ruler: "Saturn",
    varna: "Vaishya",
    vashya: "Chatushpada",
    westernRange: "Dec 22 - Jan 19",
  },
  {
    index: 10,
    name: "Aquarius",
    symbol: "♒",
    sanskrit: "Kumbha",
    element: "Air",
    modality: "Fixed",
    ruler: "Saturn",
    varna: "Shudra",
    vashya: "Manava",
    westernRange: "Jan 20 - Feb 18",
  },
  {
    index: 11,
    name: "Pisces",
    symbol: "♓",
    sanskrit: "Meena",
    element: "Water",
    modality: "Mutable",
    ruler: "Jupiter",
    varna: "Brahmin",
    vashya: "Jalachara",
    westernRange: "Feb 19 - Mar 20",
  },
];

/* Varna hierarchy used by the Varna Kuta (higher rank = 4) */
const VARNA_RANK = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };

/* Half-sign Vashya groups (Sagittarius / Capricorn change at 15°) */
const VASHYA_HALF_SIGN = {
  Sagittarius: { first: "Manava", second: "Chatushpada" },
  Capricorn: { first: "Chatushpada", second: "Jalachara" },
};

module.exports = {
  SIGNS,
  VARNA_RANK,
  VASHYA_HALF_SIGN,
};

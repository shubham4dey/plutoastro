/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  27 Nakshatras (sidereal) — classical attributes
 *
 *  Each nakshatra spans 13°20' of the sidereal zodiac and is
 *  divided into 4 padas of 3°20'. Attributes below are the
 *  classical values used by the Ashtakoota (Guna Milan) rules:
 *  Vimshottari lord, Gana, Yoni, Nadi and presiding deity.
 * ==========================================================
 */

const NAKSHATRAS = [
  { index: 1, name: "Ashwini", sanskrit: "Ashwini", lord: "Ketu", gana: "Deva", yoni: "Horse", nadi: "Adi", deity: "Ashwini Kumaras" },
  { index: 2, name: "Bharani", sanskrit: "Bharani", lord: "Venus", gana: "Manushya", yoni: "Elephant", nadi: "Madhya", deity: "Yama" },
  { index: 3, name: "Krittika", sanskrit: "Krittika", lord: "Sun", gana: "Rakshasa", yoni: "Sheep", nadi: "Antya", deity: "Agni" },
  { index: 4, name: "Rohini", sanskrit: "Rohini", lord: "Moon", gana: "Manushya", yoni: "Serpent", nadi: "Antya", deity: "Brahma" },
  { index: 5, name: "Mrigashira", sanskrit: "Mrigashira", lord: "Mars", gana: "Deva", yoni: "Serpent", nadi: "Madhya", deity: "Chandra" },
  { index: 6, name: "Ardra", sanskrit: "Ardra", lord: "Rahu", gana: "Manushya", yoni: "Dog", nadi: "Adi", deity: "Rudra" },
  { index: 7, name: "Punarvasu", sanskrit: "Punarvasu", lord: "Jupiter", gana: "Deva", yoni: "Cat", nadi: "Adi", deity: "Aditi" },
  { index: 8, name: "Pushya", sanskrit: "Pushya", lord: "Saturn", gana: "Deva", yoni: "Sheep", nadi: "Madhya", deity: "Brihaspati" },
  { index: 9, name: "Ashlesha", sanskrit: "Ashlesha", lord: "Mercury", gana: "Rakshasa", yoni: "Cat", nadi: "Antya", deity: "Nagas" },
  { index: 10, name: "Magha", sanskrit: "Magha", lord: "Ketu", gana: "Rakshasa", yoni: "Rat", nadi: "Antya", deity: "Pitris" },
  { index: 11, name: "Purva Phalguni", sanskrit: "Purva Phalguni", lord: "Venus", gana: "Manushya", yoni: "Rat", nadi: "Madhya", deity: "Bhaga" },
  { index: 12, name: "Uttara Phalguni", sanskrit: "Uttara Phalguni", lord: "Sun", gana: "Manushya", yoni: "Cow", nadi: "Adi", deity: "Aryaman" },
  { index: 13, name: "Hasta", sanskrit: "Hasta", lord: "Moon", gana: "Deva", yoni: "Buffalo", nadi: "Adi", deity: "Savitar" },
  { index: 14, name: "Chitra", sanskrit: "Chitra", lord: "Mars", gana: "Rakshasa", yoni: "Tiger", nadi: "Madhya", deity: "Tvashtar" },
  { index: 15, name: "Swati", sanskrit: "Swati", lord: "Rahu", gana: "Deva", yoni: "Buffalo", nadi: "Antya", deity: "Vayu" },
  { index: 16, name: "Vishakha", sanskrit: "Vishakha", lord: "Jupiter", gana: "Rakshasa", yoni: "Tiger", nadi: "Antya", deity: "Indragni" },
  { index: 17, name: "Anuradha", sanskrit: "Anuradha", lord: "Saturn", gana: "Deva", yoni: "Deer", nadi: "Madhya", deity: "Mitra" },
  { index: 18, name: "Jyeshtha", sanskrit: "Jyeshtha", lord: "Mercury", gana: "Rakshasa", yoni: "Deer", nadi: "Adi", deity: "Indra" },
  { index: 19, name: "Mula", sanskrit: "Mula", lord: "Ketu", gana: "Rakshasa", yoni: "Dog", nadi: "Adi", deity: "Nirriti" },
  { index: 20, name: "Purva Ashadha", sanskrit: "Purva Ashadha", lord: "Venus", gana: "Manushya", yoni: "Monkey", nadi: "Madhya", deity: "Apas" },
  { index: 21, name: "Uttara Ashadha", sanskrit: "Uttara Ashadha", lord: "Sun", gana: "Manushya", yoni: "Mongoose", nadi: "Antya", deity: "Vishwadevas" },
  { index: 22, name: "Shravana", sanskrit: "Shravana", lord: "Moon", gana: "Deva", yoni: "Monkey", nadi: "Antya", deity: "Vishnu" },
  { index: 23, name: "Dhanishta", sanskrit: "Dhanishta", lord: "Mars", gana: "Rakshasa", yoni: "Lion", nadi: "Madhya", deity: "Vasus" },
  { index: 24, name: "Shatabhisha", sanskrit: "Shatabhisha", lord: "Rahu", gana: "Rakshasa", yoni: "Horse", nadi: "Adi", deity: "Varuna" },
  { index: 25, name: "Purva Bhadrapada", sanskrit: "Purva Bhadrapada", lord: "Jupiter", gana: "Manushya", yoni: "Lion", nadi: "Adi", deity: "Aja Ekapada" },
  { index: 26, name: "Uttara Bhadrapada", sanskrit: "Uttara Bhadrapada", lord: "Saturn", gana: "Manushya", yoni: "Cow", nadi: "Madhya", deity: "Ahir Budhnya" },
  { index: 27, name: "Revati", sanskrit: "Revati", lord: "Mercury", gana: "Deva", yoni: "Elephant", nadi: "Antya", deity: "Pushan" },
];

/* The 9 Tara (nakshatra count) qualities used by Tara Kuta */
const TARAS = [
  "Janma",
  "Sampat",
  "Vipat",
  "Kshema",
  "Pratyari",
  "Sadhaka",
  "Vadha",
  "Mitra",
  "Parama Mitra",
];

/* Taras that are considered inauspicious by the classical rules */
const INAUSPICIOUS_TARA_POSITIONS = [3, 5, 7]; // Vipat, Pratyari, Vadha

module.exports = { NAKSHATRAS, TARAS, INAUSPICIOUS_TARA_POSITIONS };
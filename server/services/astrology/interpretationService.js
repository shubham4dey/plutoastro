/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Interpretation texts
 *
 *  Short, non-generic readings for the tropical signs, the
 *  Vedic rashi and the 27 nakshatras. Only reference text —
 *  the calculation itself never happens here.
 * ==========================================================
 */

const SUN_READINGS = {
  Aries: { keywords: ["courage", "initiative", "drive"], text: "You are wired to begin things. Direct, fast and competitive, you act first and refine later — you come alive when you are pioneering something of your own." },
  Taurus: { keywords: ["stability", "patience", "comfort"], text: "You build slowly and keep what you build. Steady, sensual and practical, you value reliability and comfort and you resist being rushed." },
  Gemini: { keywords: ["curiosity", "wit", "communication"], text: "You think out loud and learn by talking. Versatile and quick, you need mental variety and you connect people and ideas effortlessly." },
  Cancer: { keywords: ["care", "memory", "protection"], text: "You lead with feeling and protect your people fiercely. Loyal and intuitive, you need a safe base before you take real risks." },
  Leo: { keywords: ["confidence", "warmth", "creativity"], text: "You are here to be seen and to give generously. Proud, warm and creative, you shine when you are appreciated and trusted to lead." },
  Virgo: { keywords: ["analysis", "service", "precision"], text: "You notice what others miss and quietly improve it. Practical and exacting, you serve best through competence and care." },
  Libra: { keywords: ["balance", "harmony", "partnership"], text: "You look for fairness and beauty in every situation. Diplomatic and social, you are at your best in partnership and you dislike crude conflict." },
  Scorpio: { keywords: ["depth", "intensity", "loyalty"], text: "You feel everything at full volume and reveal very little. Intense, loyal and strategic, you rebuild yourself after every loss." },
  Sagittarius: { keywords: ["freedom", "belief", "expansion"], text: "You need horizon, meaning and movement. Optimistic and candid, you teach what you have lived and resist anything that cages you." },
  Capricorn: { keywords: ["ambition", "structure", "responsibility"], text: "You play a long game. Disciplined and patient, you take responsibility early and earn results slowly but permanently." },
  Aquarius: { keywords: ["originality", "independence", "vision"], text: "You think ahead of your time and refuse to follow blindly. Detached, inventive and humane, you are a natural reformer." },
  Pisces: { keywords: ["empathy", "imagination", "surrender"], text: "You absorb the mood of the room. Compassionate and imaginative, you need solitude and creative work to process what you feel." },
};

const MOON_READINGS = {
  Aries: { keywords: ["immediacy", "restlessness"], text: "Feelings arrive fast and you act on them. You calm down by moving and doing rather than by waiting." },
  Taurus: { keywords: ["security", "steadiness"], text: "You need routine, comfort and physical calm before you feel emotionally safe." },
  Gemini: { keywords: ["talk", "curiosity"], text: "You process feelings by naming them. Staying curious is how you keep difficult moods from settling." },
  Cancer: { keywords: ["nurture", "memory"], text: "Your emotions run deep and remember everything — you feel safest at home with your own people." },
  Leo: { keywords: ["recognition", "warmth"], text: "You need warmth and appreciation, and you give remarkable loyalty in return." },
  Virgo: { keywords: ["order", "usefulness"], text: "You settle difficult feelings by fixing, organising and being useful." },
  Libra: { keywords: ["harmony", "company"], text: "You are calmest in pleasant company and you dislike emotional noise around you." },
  Scorpio: { keywords: ["intensity", "privacy"], text: "You feel in absolute terms and rarely show the middle of your story to anyone." },
  Sagittarius: { keywords: ["space", "optimism"], text: "You need room to breathe, and hope is your emotional reset button." },
  Capricorn: { keywords: ["control", "endurance"], text: "You contain feelings rather than display them, and you trust what has already been tested." },
  Aquarius: { keywords: ["independence", "objectivity"], text: "You step back to understand your emotions instead of drowning in them." },
  Pisces: { keywords: ["merging", "sensitivity"], text: "You feel other people's emotions as though they were your own, so you need deliberate quiet time." },
};

const ASCENDANT_READINGS = {
  Aries: { keywords: ["direct", "energetic"], text: "You come across as direct and energetic. People see someone ready to move before the conversation is finished." },
  Taurus: { keywords: ["calm", "grounded"], text: "You appear calm, grounded and unhurried, and others read you as dependable." },
  Gemini: { keywords: ["curious", "adaptable"], text: "You seem curious, talkative and youthful, and you adapt quickly to whoever is in the room." },
  Cancer: { keywords: ["gentle", "protective"], text: "You seem gentle and protective, and you make people feel looked after without trying." },
  Leo: { keywords: ["presence", "warm"], text: "You arrive with presence; others notice your warmth and confidence first." },
  Virgo: { keywords: ["composed", "observant"], text: "You appear composed, careful and observant, and you are usually the one who notices the detail." },
  Libra: { keywords: ["charming", "diplomatic"], text: "You come across as charming, fair and diplomatic, and people relax around you." },
  Scorpio: { keywords: ["reserved", "intense"], text: "You appear reserved and intense; people sense there is more beneath the surface." },
  Sagittarius: { keywords: ["open", "adventurous"], text: "You seem open, candid and adventurous, and you put people at ease quickly." },
  Capricorn: { keywords: ["serious", "capable"], text: "You appear serious, capable and composed — others assume you are the one in charge." },
  Aquarius: { keywords: ["friendly", "unconventional"], text: "You seem friendly yet independent, and slightly unconventional in how you carry yourself." },
  Pisces: { keywords: ["soft", "kind"], text: "You appear soft, dreamy and kind, and people feel safe confiding in you." },
};

/* Vedic Moon sign (rashi) readings — framed for the sidereal Moon */
const RASHI_READINGS = {
  Aries: { keywords: ["pioneering", "Mars ruled"], text: "Chandra in Mesha gives a restless, pioneering mind. Your instinct is to initiate, and Mars as the rashi lord makes you bold and quick to recover from setbacks." },
  Taurus: { keywords: ["steady", "Venus ruled"], text: "Chandra in Vrishabha gives a calm, resourceful mind. Venus rules this rashi, so comfort, beauty and steady accumulation matter to your emotional security." },
  Gemini: { keywords: ["communicative", "Mercury ruled"], text: "Chandra in Mithuna gives a quick, communicative mind. Mercury as rashi lord makes learning and exchanging information emotionally necessary for you." },
  Cancer: { keywords: ["nurturing", "Moon ruled"], text: "Chandra in Karka is at home because the Moon rules this rashi. Your mind is deeply feeling, protective and attached to family and memory." },
  Leo: { keywords: ["dignified", "Sun ruled"], text: "Chandra in Simha gives a proud, warm hearted mind. With the Sun ruling the rashi, respect and recognition are emotional needs rather than luxuries." },
  Virgo: { keywords: ["analytical", "Mercury ruled"], text: "Chandra in Kanya gives a discriminating, service-minded mind. Mercury as lord makes analysis, method and helpfulness your natural emotional language." },
  Libra: { keywords: ["balanced", "Venus ruled"], text: "Chandra in Tula gives a fair, relationship oriented mind. Venus ruling the rashi makes harmony, aesthetics and partnership central to your well being." },
  Scorpio: { keywords: ["intense", "Mars ruled"], text: "Chandra in Vrishchika gives a deep, guarded mind with unusual endurance. Mars ruling the rashi gives you the strength to survive hidden battles quietly." },
  Sagittarius: { keywords: ["philosophical", "Jupiter ruled"], text: "Chandra in Dhanu gives an optimistic, principled mind. Jupiter as lord makes faith, learning and dharma the fuel of your inner life." },
  Capricorn: { keywords: ["disciplined", "Saturn ruled"], text: "Chandra in Makara gives a serious, patient mind. Saturn ruling the rashi makes duty, structure and long term security emotionally important." },
  Aquarius: { keywords: ["humanitarian", "Saturn ruled"], text: "Chandra in Kumbha gives an unconventional, group oriented mind. Saturn ruling the rashi gives you detachment and the discipline to serve a larger cause." },
  Pisces: { keywords: ["compassionate", "Jupiter ruled"], text: "Chandra in Meena gives a compassionate, imaginative mind. Jupiter as lord makes faith, devotion and service your emotional foundation." },
};

/* ==========================================================
   NAKSHATRA_READINGS — 27 lunar mansions (indexed 0..26)
   ========================================================== */
const NAKSHATRA_READINGS = {
  Ashwini: { keywords: ["speed", "healing", "initiative"], text: "Ashwini, ruled by Ketu, gives a fast, healing and pioneering mind. You act on instinct, recover quickly and are often the first to move." },
  Bharani: { keywords: ["discipline", "creativity", "endurance"], text: "Bharani, ruled by Venus, carries the intensity of birth and death. You bear responsibility well and transform through creative restraint." },
  Krittika: { keywords: ["cutting clarity", "purification"], text: "Krittika, ruled by the Sun, gives a sharp, purifying mind. You cut through confusion and burn away what is false." },
  Rohini: { keywords: ["growth", "beauty", "stability"], text: "Rohini, ruled by the Moon, is the most fertile nakshatra. You create, cultivate and enjoy material and artistic growth." },
  Mrigashira: { keywords: ["searching", "curiosity"], text: "Mrigashira, ruled by Mars, gives a gentle, seeking mind. You are forever hunting for the next answer, taste or experience." },
  Ardra: { keywords: ["storm", "renewal", "depth"], text: "Ardra, ruled by Rahu, brings storms that cleanse. Your mind penetrates to the root of things and is renewed through intensity." },
  Punarvasu: { keywords: ["return", "wisdom", "optimism"], text: "Punarvasu, ruled by Jupiter, is the star of renewal. Whatever is lost returns to you, and hope is your natural state." },
  Pushya: { keywords: ["nourishment", "care", "dharma"], text: "Pushya, ruled by Saturn, is the most nourishing nakshatra. You support, protect and grow whatever you commit to." },
  Ashlesha: { keywords: ["insight", "strategy", "intensity"], text: "Ashlesha, ruled by Mercury, gives a coiled, penetrating intelligence. You see hidden motives and hold your cards close." },
  Magha: { keywords: ["heritage", "authority", "pride"], text: "Magha, ruled by Ketu, connects you to lineage and legacy. You carry ancestral authority and a natural sense of honour." },
  "Purva Phalguni": { keywords: ["charm", "leisure", "art"], text: "Purva Phalguni, ruled by Venus, gives a playful, artistic nature. Rest, beauty and romance recharge you." },
  "Uttara Phalguni": { keywords: ["generosity", "contracts", "loyalty"], text: "Uttara Phalguni, ruled by the Sun, is the star of patronage. You give generously and stand by your commitments." },
  Hasta: { keywords: ["skill", "craft", "dexterity"], text: "Hasta, ruled by the Moon, gives skilled hands and a clever mind. You build, heal and craft with remarkable precision." },
  Chitra: { keywords: ["design", "brilliance", "artistry"], text: "Chitra, ruled by Mars, is the star of the architect. You combine beauty with engineering and love to be remembered for your work." },
  Swati: { keywords: ["independence", "wind", "adaptability"], text: "Swati, ruled by Rahu, gives independence and adaptability like the wind. You bend without breaking and trade ideas freely." },
  Vishakha: { keywords: ["goal-focus", "determination"], text: "Vishakha, ruled by Jupiter, is the star of purpose. You fix on a goal and branch outward until every path leads to it." },
  Anuradha: { keywords: ["devotion", "friendship", "balance"], text: "Anuradha, ruled by Saturn, gives devotion and organisational power. Your friendships are deep and your discipline quiet." },
  Jyeshtha: { keywords: ["seniority", "protection", "responsibility"], text: "Jyeshtha, ruled by Mercury, is the eldest star. You carry responsibility naturally and protect those who depend on you." },
  Mula: { keywords: ["roots", "investigation", "truth"], text: "Mula, ruled by Ketu, pulls everything back to its root. You research, uproot and rebuild from the foundation." },
  "Purva Ashadha": { keywords: ["invincibility", "declaration", "purification"], text: "Purva Ashadha, ruled by Venus, gives unshakable conviction. You declare, purify and win arguments with belief." },
  "Uttara Ashadha": { keywords: ["lasting victory", "duty", "leadership"], text: "Uttara Ashadha, ruled by the Sun, is the star of enduring wins. You lead patiently and your victories last." },
  Shravana: { keywords: ["listening", "learning", "fame"], text: "Shravana, ruled by the Moon, is the star of listening. You learn through hearing, hold knowledge and quietly become known for it." },
  Dhanishta: { keywords: ["rhythm", "wealth", "ambition"], text: "Dhanishta, ruled by Mars, gives rhythm and ambition. You move to an inner beat and prosper through timing." },
  Shatabhisha: { keywords: ["healing", "mystery", "independence"], text: "Shatabhisha, ruled by Rahu, is the star of the hundred healers. You explore hidden knowledge and heal in unconventional ways." },
  "Purva Bhadrapada": { keywords: ["intensity", "transformation", "idealism"], text: "Purva Bhadrapada, ruled by Jupiter, gives a fiery, idealistic mind. You burn through illusions and inspire with intensity." },
  "Uttara Bhadrapada": { keywords: ["depth", "compassion", "wisdom"], text: "Uttara Bhadrapada, ruled by Saturn, gives a deep, compassionate and philosophical nature. You feel the world's weight and stay calm." },
  Revati: { keywords: ["journeys", "kindness", "completion"], text: "Revati, ruled by Mercury, is the final star — safe travel and completion. You guide others home and finish what begins." },
};

/* ==========================================================
   COMPATIBILITY TEXT HELPERS
   Turn real computed ratios into concise, honest readings.
   ========================================================== */

const LOVE_BANDS = [
  { min: 0.86, label: "Excellent", tone: "glowing", text: "The classical agreement between your charts is exceptional — this pairing has both passion and staying power." },
  { min: 0.71, label: "Very Good", tone: "positive", text: "Your charts agree on the essentials: emotional rhythm, mutual respect and enough friction to keep growth alive." },
  { min: 0.56, label: "Good", tone: "warm", text: "There is solid compatibility here. Some areas need conscious effort, but the foundation supports a lasting bond." },
  { min: 0.41, label: "Moderate", tone: "balanced", text: "A mixed but workable match. Where the charts disagree, awareness and communication turn difference into balance." },
  { min: 0.26, label: "Challenging", tone: "caution", text: "Your Moons and planets pull in different directions. This bond succeeds through patience, dialogue and deliberate compromise." },
  { min: -1, label: "Demanding", tone: "caution", text: "The classical indicators show significant tension. This can still work — but only with unusually honest communication and effort." },
];

const FRIENDSHIP_BANDS = [
  { min: 0.86, label: "Kindred Spirits", tone: "glowing", text: "You are natural allies — the same humour, the same pace, and mutual trust that needs no explanation." },
  { min: 0.71, label: "Great Friendship", tone: "positive", text: "A strong, easy friendship. You energise each other and resolve the occasional clash quickly." },
  { min: 0.56, label: "Good Friendship", tone: "warm", text: "A comfortable, loyal friendship with compatible rhythms and a few differences to negotiate." },
  { min: 0.41, label: "Workable", tone: "balanced", text: "You complement each other in some ways and clash in others. Friendship flourishes when you respect the differences." },
  { min: 0.26, label: "Occasional", tone: "caution", text: "You connect in bursts rather than constantly. Keep expectations clear and the friendship stays enjoyable." },
  { min: -1, label: "Demanding", tone: "caution", text: "Your instinctive rhythms differ considerably. As friends you work best in short, meaningful contact rather than constant company." },
];

const loveBandFor = (ratio) =>
  LOVE_BANDS.find((band) => ratio >= band.min) || LOVE_BANDS[LOVE_BANDS.length - 1];

const friendshipBandFor = (ratio) =>
  FRIENDSHIP_BANDS.find((band) => ratio >= band.min) || FRIENDSHIP_BANDS[FRIENDSHIP_BANDS.length - 1];

module.exports = {
  SUN_READINGS,
  MOON_READINGS,
  ASCENDANT_READINGS,
  RASHI_READINGS,
  NAKSHATRA_READINGS,
  loveBandFor,
  friendshipBandFor,
};
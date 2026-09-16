/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Vedic kuta rules (Ashtakoota / Guna Milan)
 *
 *  Every kuta below is a documented classical rule evaluated
 *  from the two sidereal Moon positions. Each kuta returns its
 *  points, the maximum, the compared factors and the rule that
 *  was applied, so the result can be audited.
 * ==========================================================
 */

const { TARAS } = require("./nakshatras");
const { VARNA_RANK } = require("./constants");

/* The 8 kutas that make the classical 36 point Guna Milan scale */
const KUTA_MAX = {
  varna: 1,
  vashya: 2,
  tara: 3,
  yoni: 4,
  grahaMaitri: 5,
  gana: 6,
  bhakoot: 7,
  nadi: 8,
};

const GANA_ORDER = ["Deva", "Manushya", "Rakshasa"];

/* Muhurta table for the Vashya kuta (2 = same group, 0 = cancelling pair) */
const VASHYA_MATRIX = {
  Chatushpada: { Chatushpada: 2, Manava: 1, Jalachara: 1, Vanachara: 1, Keeta: 0 },
  Manava: { Chatushpada: 1, Manava: 2, Jalachara: 1, Vanachara: 1, Keeta: 1 },
  Jalachara: { Chatushpada: 1, Manava: 1, Jalachara: 2, Vanachara: 1, Keeta: 1 },
  Vanachara: { Chatushpada: 1, Manava: 1, Jalachara: 1, Vanachara: 2, Keeta: 1 },
  Keeta: { Chatushpada: 0, Manava: 1, Jalachara: 1, Vanachara: 1, Keeta: 2 },
};

/* Classical Gana matrix — rows = groom's gana, columns = bride's gana */
const GANA_MATRIX = {
  Deva: { Deva: 6, Manushya: 6, Rakshasa: 0 },
  Manushya: { Deva: 5, Manushya: 6, Rakshasa: 0 },
  Rakshasa: { Deva: 1, Manushya: 0, Rakshasa: 6 },
};

/* The 7 classical enemy pairs of the Yoni kuta (yoni-virodha) */
const YONI_ENEMIES = [
  ["Horse", "Buffalo"],
  ["Elephant", "Lion"],
  ["Sheep", "Monkey"],
  ["Serpent", "Mongoose"],
  ["Dog", "Deer"],
  ["Cat", "Rat"],
  ["Cow", "Tiger"],
];

/* Naisargika (natural) friendship of the planetary rulers */
const NATURAL_FRIENDSHIP = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], neutral: ["Mercury"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], neutral: ["Mars", "Jupiter", "Venus", "Saturn"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], neutral: ["Venus", "Saturn"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], neutral: ["Mars", "Jupiter", "Saturn"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], neutral: ["Saturn"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], neutral: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], neutral: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] },
};

const KUTA_INFO = {
  varna: {
    name: "Varna",
    max: KUTA_MAX.varna,
    about: "Spiritual and social compatibility — the four varnas of the Moon sign.",
    rule: "One point when the groom's varna rank is equal to or above the bride's, otherwise zero. Brahmin is above Kshatriya, which is above Vaishya, which is above Shudra.",
  },
  vashya: {
    name: "Vashya",
    max: KUTA_MAX.vashya,
    about: "Mutual attraction and influence between the partners.",
    rule: "Muhurta Vashya table over the five groups (Chatushpada, Manava, Jalachara, Vanachara, Keeta): same group 2, ordinary combination 1, Chatushpada with Keeta 0.",
  },
  tara: {
    name: "Tara (Dina)",
    max: KUTA_MAX.tara,
    about: "Destiny, health and general well being of the two nakshatras.",
    rule: "Count from one nakshatra to the other and divide by nine. When the remainder is 3, 5 or 7 (Vipat, Pratyari, Vadha) that direction scores 0, otherwise 1.5. Both directions are counted, hence a maximum of 3.",
  },
  yoni: {
    name: "Yoni",
    max: KUTA_MAX.yoni,
    about: "Physical and instinctive compatibility of the nakshatra animals.",
    rule: "Same yoni 4 points, a classical enemy pair (yoni-virodha) 0 points, any other combination 2 points.",
  },
  grahaMaitri: {
    name: "Graha Maitri",
    max: KUTA_MAX.grahaMaitri,
    about: "Mental and emotional friendship between the rulers of the two Moon signs.",
    rule: "Natural planetary friendship: both rulers friends 5, friend with neutral 4, both neutral 3, friend with enemy 1, neutral with enemy 0.5, both enemies 0.",
  },
  gana: {
    name: "Gana",
    max: KUTA_MAX.gana,
    about: "Temperament — Deva (sattvic), Manushya (rajasic) and Rakshasa (tamasic) natures.",
    rule: "Classical Gana matrix with the groom's gana as the row and the bride's as the column (6 for the same gana, 5 or 1 for the lighter combinations, 0 for the opposing ones).",
  },
  bhakoot: {
    name: "Bhakoot (Rashi)",
    max: KUTA_MAX.bhakoot,
    about: "Love, family life and the flow of prosperity between the two Moon signs.",
    rule: "Count between the two Moon signs. The pairs 2/12, 5/9 and 6/8 create Bhakoot dosha and score 0, every other pair scores 7.",
  },
  nadi: {
    name: "Nadi",
    max: KUTA_MAX.nadi,
    about: "Constitution, health and genetic energy of the two nakshatras.",
    rule: "Adi, Madhya and Antya nadi. Different nadi scores the full 8 points, the same nadi scores 0 (Nadi dosha).",
  },
};

const round1 = (value) => Math.round(value * 10) / 10;

const buildKuta = (key, points, factorsKey, extra = {}) => {
  const info = KUTA_INFO[key];
  const pointsValue = round1(points);
  return {
    key,
    name: info.name,
    points: pointsValue,
    maxPoints: info.max,
    percentage: info.max ? round1((pointsValue / info.max) * 100) : 0,
    about: info.about,
    rule: info.rule,
    ...factorsKey,
    ...extra,
  };
};

/**
 * Varna kuta — directional (groom first).
 * @param {object} rashi1 Moon sign summary of the groom
 * @param {object} rashi2 Moon sign summary of the bride
 */
const varnaKuta = (rashi1, rashi2) => {
  const rank1 = VARNA_RANK[rashi1.varna] || 0;
  const rank2 = VARNA_RANK[rashi2.varna] || 0;
  const points = rank1 >= rank2 ? 1 : 0;
  return buildKuta("varna", points, {
    factors: {
      groom: { rashi: rashi1.name, varna: rashi1.varna, rank: rank1 },
      bride: { rashi: rashi2.name, varna: rashi2.varna, rank: rank2 },
    },
    detail: points
      ? `${rashi1.varna} (groom) is equal to or above ${rashi2.varna} (bride) — no varna conflict.`
      : `${rashi2.varna} (bride) stands above ${rashi1.varna} (groom) in the traditional order, so the varna point is not earned.`,
  });
};

/** Vashya kuta — mutual influence */
const vashyaKuta = (vashya1, vashya2) => {
  const row = VASHYA_MATRIX[vashya1];
  const points = row && row[vashya2] !== undefined ? row[vashya2] : 1;
  return buildKuta("vashya", points, {
    factors: { person1: vashya1, person2: vashya2 },
    detail:
      vashya1 === vashya2
        ? `Both Moon signs belong to the ${vashya1} group — natural mutual attraction.`
        : `${vashya1} with ${vashya2} scores ${points} of 2 on the Vashya table.`,
  });
};

/** Tara kuta — nakshatra destiny (both directions counted) */
const taraKuta = (nakshatra1, nakshatra2) => {
  const evaluate = (from, to) => {
    const count = ((to - from + 27) % 27) + 1;
    const remainder = count % 9;
    const taraName = remainder === 0 ? TARAS[8] : TARAS[remainder - 1];
    const inauspicious = [3, 5, 7].includes(remainder);
    return { count, remainder, taraName, inauspicious, points: inauspicious ? 0 : 1.5 };
  };

  const forward = evaluate(nakshatra1.index, nakshatra2.index);
  const reverse = evaluate(nakshatra2.index, nakshatra1.index);
  const points = forward.points + reverse.points;

  return buildKuta("tara", points, {
    factors: {
      person1ToPerson2: { from: nakshatra1.name, to: nakshatra2.name, ...forward },
      person2ToPerson1: { from: nakshatra2.name, to: nakshatra1.name, ...reverse },
    },
    detail: `${nakshatra1.name} to ${nakshatra2.name} falls on ${forward.taraName} (${forward.inauspicious ? "not favourable" : "favourable"}) and ${nakshatra2.name} to ${nakshatra1.name} falls on ${reverse.taraName} (${reverse.inauspicious ? "not favourable" : "favourable"}).`,
  });
};

/** Yoni kuta — instinctive compatibility */
const yoniKuta = (yoni1, yoni2) => {
  const isEnemy = YONI_ENEMIES.some(
    ([a, b]) => (a === yoni1 && b === yoni2) || (a === yoni2 && b === yoni1)
  );
  const points = yoni1 === yoni2 ? 4 : isEnemy ? 0 : 2;
  return buildKuta("yoni", points, {
    factors: { person1: yoni1, person2: yoni2, classicalEnemyPair: isEnemy },
    detail:
      yoni1 === yoni2
        ? `Both nakshatras carry the ${yoni1} yoni — instinctive ease between them.`
        : isEnemy
        ? `${yoni1} and ${yoni2} are a classical enemy pair (yoni-virodha).`
        : `${yoni1} and ${yoni2} are neither identical nor classical enemies, so the neutral score applies.`,
  });
};

/** Graha Maitri kuta — friendship of the two Moon sign rulers */
const grahaMaitriKuta = (ruler1, ruler2) => {
  const relation = (from, to) => {
    if (from === to) return "friend";
    const table = NATURAL_FRIENDSHIP[from];
    if (!table) return "neutral";
    if (table.friends.includes(to)) return "friend";
    if (table.enemies.includes(to)) return "enemy";
    return "neutral";
  };

  const rel1 = relation(ruler1, ruler2);
  const rel2 = relation(ruler2, ruler1);
  const pair = [rel1, rel2].sort().join("-");

  const SCORES = {
    "friend-friend": 5,
    "friend-neutral": 4,
    "neutral-neutral": 3,
    "enemy-friend": 1,
    "enemy-neutral": 0.5,
    "enemy-enemy": 0,
  };
  const points = SCORES[pair] !== undefined ? SCORES[pair] : 3;

  return buildKuta("grahaMaitri", points, {
    factors: {
      person1Ruler: ruler1,
      person2Ruler: ruler2,
      person1ViewOfPerson2: rel1,
      person2ViewOfPerson1: rel2,
    },
    detail:
      rel1 === "friend" && rel2 === "friend"
        ? `${ruler1} and ${ruler2} are natural friends — the mental wavelengths match closely.`
        : `Between ${ruler1} and ${ruler2}: ${ruler1} regards ${ruler2} as a ${rel1}, and ${ruler2} regards ${ruler1} as a ${rel2}.`,
  });
};

/** Gana kuta — temperament (groom first) */
const ganaKuta = (gana1, gana2) => {
  const row = GANA_MATRIX[gana1];
  const points = row && row[gana2] !== undefined ? row[gana2] : 0;
  const distance = Math.abs(GANA_ORDER.indexOf(gana1) - GANA_ORDER.indexOf(gana2));
  return buildKuta("gana", points, {
    factors: { groom: gana1, bride: gana2, distance },
    detail:
      gana1 === gana2
        ? `Both are ${gana1} gana — the temperaments run on the same current.`
        : points === 0
        ? `${gana1} with ${gana2} is one of the opposing temperaments in the classical Gana matrix.`
        : `${gana1} with ${gana2} earns ${points} of 6 points.`,
  });
};

/** Bhakoot kuta — Moon sign distance */
const bhakootKuta = (signIndex1, signIndex2, signName1, signName2) => {
  const forward = ((signIndex2 - signIndex1 + 12) % 12) + 1;
  const reverse = ((signIndex1 - signIndex2 + 12) % 12) + 1;
  const pairs = [
    [2, 12],
    [5, 9],
    [6, 8],
  ];
  const dosha = pairs.some(
    ([a, b]) => (forward === a && reverse === b) || (forward === b && reverse === a)
  );
  const points = dosha ? 0 : 7;
  return buildKuta("bhakoot", points, {
    factors: {
      person1: signName1,
      person2: signName2,
      distancePerson1ToPerson2: forward,
      distancePerson2ToPerson1: reverse,
      bhakootDosha: dosha,
    },
    detail: dosha
      ? `The Moon signs stand ${forward}/${reverse} signs apart, which is one of the classical Bhakoot dosha combinations.`
      : `The Moon signs stand ${forward}/${reverse} signs apart — no Bhakoot dosha.`,
  });
};

/** Nadi kuta — constitution */
const nadiKuta = (nadi1, nadi2) => {
  const points = nadi1 === nadi2 ? 0 : 8;
  return buildKuta("nadi", points, {
    factors: { person1: nadi1, person2: nadi2, nadiMismatch: nadi1 !== nadi2 },
    detail:
      nadi1 === nadi2
        ? `Both belong to ${nadi1} nadi — the classical Nadi dosha is present.`
        : `${nadi1} nadi and ${nadi2} nadi are different, which is what the classical rule requires.`,
  });
};

module.exports = {
  KUTA_INFO,
  KUTA_MAX,
  GANA_MATRIX,
  VASHYA_MATRIX,
  YONI_ENEMIES,
  NATURAL_FRIENDSHIP,
  varnaKuta,
  vashyaKuta,
  taraKuta,
  yoniKuta,
  grahaMaitriKuta,
  ganaKuta,
  bhakootKuta,
  nadiKuta,
};
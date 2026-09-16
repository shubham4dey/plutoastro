/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Synastry — aspects between two real charts
 *
 *  Everything here is computed from the actual tropical
 *  positions of both people (one engine, no invented data).
 * ==========================================================
 */

const { angleDiff, round } = require("./utils");

const ASPECTS = [
  { key: "conjunction", name: "Conjunction", symbol: "☌", exact: 0, orb: 8, quality: "fusion", text: "merges the two energies" },
  { key: "sextile", name: "Sextile", symbol: "⚹", exact: 60, orb: 4, quality: "harmonious", text: "supports and encourages" },
  { key: "square", name: "Square", symbol: "□", exact: 90, orb: 6, quality: "challenging", text: "creates friction that demands work" },
  { key: "trine", name: "Trine", symbol: "△", exact: 120, orb: 6, quality: "harmonious", text: "flows easily and generously" },
  { key: "opposition", name: "Opposition", symbol: "☍", exact: 180, orb: 8, quality: "polarizing", text: "pulls in opposite directions until balance is found" },
];

/* Which pairs of bodies matter, and for what */
const CONTACT_PAIRS = [
  { a: "sun", b: "moon", theme: "core identity with emotional needs", weight: 3, friendship: true },
  { a: "moon", b: "moon", theme: "emotional habits and instincts", weight: 3, friendship: true },
  { a: "sun", b: "sun", theme: "basic life purpose", weight: 2, friendship: true },
  { a: "venus", b: "mars", theme: "attraction and desire", weight: 3, friendship: false },
  { a: "venus", b: "venus", theme: "shared affection and values", weight: 2, friendship: false },
  { a: "mercury", b: "mercury", theme: "the way you talk and think together", weight: 2, friendship: true },
  { a: "sun", b: "venus", theme: "warmth and appreciation", weight: 2, friendship: true },
  { a: "moon", b: "venus", theme: "tenderness and care", weight: 2, friendship: true },
  { a: "mars", b: "moon", theme: "drive meeting feeling", weight: 2, friendship: false },
  { a: "jupiter", b: "sun", theme: "encouragement and growth", weight: 1, friendship: true },
  { a: "saturn", b: "moon", theme: "duty, steadiness and patience", weight: 1, friendship: true },
  { a: "ascendant", b: "sun", theme: "how you first experience each other", weight: 3, friendship: true },
  { a: "ascendant", b: "moon", theme: "instant emotional recognition", weight: 3, friendship: true },
  { a: "ascendant", b: "venus", theme: "immediate romantic appeal", weight: 3, friendship: false },
];

const ELEMENT_HARMONY = {
  Fire: { Fire: "very high", Air: "high", Earth: "low", Water: "low" },
  Earth: { Earth: "very high", Water: "high", Fire: "low", Air: "low" },
  Air: { Air: "very high", Fire: "high", Earth: "low", Water: "low" },
  Water: { Water: "very high", Earth: "high", Fire: "low", Air: "low" },
};

const MODALITY_HARMONY = {
  Cardinal: { Cardinal: "challenging", Fixed: "supportive", Mutable: "adaptable" },
  Fixed: { Cardinal: "supportive", Fixed: "challenging", Mutable: "adaptable" },
  Mutable: { Cardinal: "adaptable", Fixed: "adaptable", Mutable: "challenging" },
};

const bodyLabel = (key) =>
  ({
    sun: "Sun",
    moon: "Moon",
    mercury: "Mercury",
    venus: "Venus",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    ascendant: "Ascendant",
    truenode: "Rahu",
  }[key] || key);

const aspectOf = (lon1, lon2) => {
  const separation = Math.abs(angleDiff(lon1, lon2));
  let best = null;
  for (const aspect of ASPECTS) {
    const orb = Math.abs(separation - aspect.exact);
    if (orb <= aspect.orb && (!best || orb < best.orb)) {
      best = { ...aspect, orb: round(orb, 2), separation: round(separation, 2) };
    }
  }
  return best;
};

const positionOf = (chart, key) => {
  if (chart.tropical.planets[key]) return chart.tropical.planets[key];
  if (chart.tropical.angles[key]) return chart.tropical.angles[key];
  if (chart.sidereal.planets[key]) return chart.sidereal.planets[key];
  return null;
};

module.exports = { ASPECTS, CONTACT_PAIRS, aspectOf, bodyLabel, positionOf };

/**
 * All meaningful contacts between two charts.
 * @param {object} chart1 chart of person 1
 * @param {object} chart2 chart of person 2
 * @param {{friendship?:boolean}} options
 */
const findContacts = (chart1, chart2, options = {}) => {
  const { friendship = false } = options;
  const contacts = [];

  for (const pair of CONTACT_PAIRS) {
    if (friendship && !pair.friendship) continue;
    const a = positionOf(chart1, pair.a);
    const b = positionOf(chart2, pair.b);
    if (!a || !b) continue;
    const aspect = aspectOf(a.longitude, b.longitude);
    if (!aspect) continue;
    contacts.push({
      person1Body: bodyLabel(pair.a),
      person2Body: bodyLabel(pair.b),
      theme: pair.theme,
      weight: pair.weight,
      aspect: {
        key: aspect.key,
        name: aspect.name,
        symbol: aspect.symbol,
        quality: aspect.quality,
        text: aspect.text,
        orb: aspect.orb,
        exactDegrees: aspect.exact,
        separation: aspect.separation,
      },
      headline: `${bodyLabel(pair.a)} ${aspect.symbol} ${bodyLabel(pair.b)} — ${aspect.name} (${aspect.orb}° orb)`,
      explanation: `${bodyLabel(pair.a)} of person 1 forms a ${aspect.name.toLowerCase()} with ${bodyLabel(pair.b)} of person 2, which ${aspect.text} — the contact is about ${pair.theme}.`,
      score:
        aspect.quality === "harmonious"
          ? pair.weight * 2
          : aspect.quality === "fusion"
          ? pair.weight
          : aspect.quality === "challenging"
          ? -pair.weight
          : -Math.round(pair.weight / 2),
    });
  }

  contacts.sort((x, y) => Math.abs(y.score) - Math.abs(x.score));
  return contacts;
};

/** Compare elements / modalities of the two Sun and Moon signs */
const compareTemperaments = (chart1, chart2) => {
  const build = (planetKey) => {
    const sign1 = chart1.tropical[planetKey === "moon" ? "moonSign" : "sunSign"];
    const sign2 = chart2.tropical[planetKey === "moon" ? "moonSign" : "sunSign"];
    if (!sign1 || !sign2) return null;
    const elementMatch =
      sign1.element === sign2.element
        ? "the same element"
        : ELEMENT_HARMONY[sign1.element][sign2.element];
    const modalityMatch =
      sign1.modality === sign2.modality
        ? "the same modality"
        : MODALITY_HARMONY[sign1.modality][sign2.modality];
    return {
      planet: bodyLabel(planetKey),
      person1: { sign: sign1.name, element: sign1.element, modality: sign1.modality, ruler: sign1.ruler },
      person2: { sign: sign2.name, element: sign2.element, modality: sign2.modality, ruler: sign2.ruler },
      elementMatch,
      modalityMatch,
      elementScore: ELEMENT_HARMONY[sign1.element][sign2.element],
      matches:
        sign1.element === sign2.element ||
        ELEMENT_HARMONY[sign1.element][sign2.element] === "high",
    };
  };

  const moon = build("moon");
  const sun = build("sun");

  return {
    moon,
    sun,
    elementNote: moon
      ? `${moon.person1.element} (${moon.person1.sign}) with ${moon.person2.element} (${moon.person2.sign}) is ${moon.elementMatch} by element.`
      : "",
    modalityNote: moon
      ? `${moon.person1.modality} with ${moon.person2.modality} is ${moon.modalityMatch} by modality.`
      : "",
    summary:
      moon && sun
        ? `Moon signs: ${moon.person1.sign} (${moon.person1.element}) meets ${moon.person2.sign} (${moon.person2.element}) — ${moon.elementMatch}. Sun signs: ${sun.person1.sign} meets ${sun.person2.sign} — ${sun.elementMatch}.`
        : "",
  };
};

module.exports = {
  ASPECTS,
  CONTACT_PAIRS,
  aspectOf,
  bodyLabel,
  positionOf,
  findContacts,
  compareTemperaments,
};
/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Chart service — THE single calculation pipeline
 *
 *  Every calculator (sun sign, moon sign, rashi, ascendant,
 *  ayanamsa, nakshatra, compatibility ...) calls buildChart()
 *  so tropical and sidereal values always come from the same
 *  code path with the same engine settings.
 * ==========================================================
 */

const engine = require("./engine");
const timezoneService = require("./timezoneService");
const { SIGNS, VASHYA_HALF_SIGN, VARNA_RANK } = require("./constants");
const { NAKSHATRAS } = require("./nakshatras");
const { norm360, toDms, round } = require("./utils");

const NAKSHATRA_SPAN = 360 / 27; // 13°20'
const PADA_SPAN = NAKSHATRA_SPAN / 4; // 3°20'

const CORE_BODIES = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "truenode",
];

const PLANET_LABELS = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  truenode: "Rahu (True Node)",
};

/* =========================
   LONGITUDE -> SIGN / NAKSHATRA
========================= */

/** Sign (rashi) that owns a longitude, plus the position inside it */
const signFromLongitude = (longitude) => {
  const lon = norm360(longitude);
  const index = Math.floor(lon / 30);
  const sign = SIGNS[index];
  const degreesInSign = lon - index * 30;
  const dms = toDms(degreesInSign);
  return {
    ...sign,
    longitude: round(lon, 6),
    degreesInSign: round(degreesInSign, 6),
    dms,
    formatted: `${dms.degrees}° ${String(dms.minutes).padStart(2, "0")}' ${String(
      dms.seconds
    ).padStart(2, "0")}"`,
    short: `${dms.degrees}° ${String(dms.minutes).padStart(2, "0")}' ${sign.name}`,
  };
};

/** Nakshatra + pada that owns a sidereal longitude */
const nakshatraFromLongitude = (longitude) => {
  const lon = norm360(longitude);
  const index = Math.floor(lon / NAKSHATRA_SPAN); // 0..26
  const nakshatra = NAKSHATRAS[index];
  const degreesInNakshatra = lon - index * NAKSHATRA_SPAN;
  const pada = Math.floor(degreesInNakshatra / PADA_SPAN) + 1;
  const dms = toDms(degreesInNakshatra);
  return {
    ...nakshatra,
    pada,
    position: round(degreesInNakshatra, 6),
    formatted: `${dms.degrees}° ${String(dms.minutes).padStart(2, "0")}' ${String(
      dms.seconds
    ).padStart(2, "0")}"`,
    spanStart: round(index * NAKSHATRA_SPAN, 6),
    spanEnd: round((index + 1) * NAKSHATRA_SPAN, 6),
  };
};

/**
 * Vashya group of a Moon sign. Sagittarius and Capricorn change group at
 * 15° of the sign, which is why the degree inside the sign is required.
 */
const vashyaOf = (signName, degreesInSign) => {
  const half = VASHYA_HALF_SIGN[signName];
  if (half) {
    return degreesInSign < 15 ? half.first : half.second;
  }
  const sign = SIGNS.find((item) => item.name === signName);
  return sign ? sign.vashya : null;
};

const rashiSummary = (sign) => ({
  name: sign.name,
  sanskrit: sign.sanskrit,
  symbol: sign.symbol,
  element: sign.element,
  modality: sign.modality,
  ruler: sign.ruler,
  varna: sign.varna,
  varnaRank: VARNA_RANK[sign.varna],
});

/* =========================
   POSITION PAYLOAD
========================= */

const buildPosition = (body, raw) => ({
  body,
  label: PLANET_LABELS[body] || body,
  longitude: round(norm360(raw.longitude), 6),
  latitude: round(raw.latitude, 6),
  speed: round(raw.speed, 6),
  retrograde: raw.speed < 0,
  sign: null, // filled by the caller
});

/* =========================
   BUILD A FULL CHART
========================= */

/**
 * @param {object} input validated birth input
 * @param {string} input.date "YYYY-MM-DD" local calendar date at the birth place
 * @param {string} input.time "HH:MM" or "HH:MM:SS" local wall clock
 * @param {number} input.latitude
 * @param {number} input.longitude
 * @param {string} [input.timeZone] IANA zone resolved from the birth place
 * @param {number} [input.utcOffsetMinutes] manual override
 * @param {string} [input.ayanamsa] sidereal system key
 * @param {string} [input.houseSystem]
 */
const buildChart = (input) => {
  engine.ensureReady();

  const [year, month, day] = input.date.split("-").map(Number);
  const timeParts = input.time.split(":").map(Number);
  const wall = {
    year,
    month,
    day,
    hour: timeParts[0] || 0,
    minute: timeParts[1] || 0,
    second: timeParts[2] || 0,
  };

  const hasManualOffset =
    input.utcOffsetMinutes !== null &&
    input.utcOffsetMinutes !== undefined &&
    Number.isFinite(Number(input.utcOffsetMinutes));

  const conversion = hasManualOffset
    ? timezoneService.fixedOffsetToUtc(wall, Number(input.utcOffsetMinutes))
    : timezoneService.wallClockToUtc(wall, input.timeZone);

  const jdUT = engine.julianDayUT(conversion.utc);
  const ayanamsaKey = engine.resolveAyanamsaId(input.ayanamsa);
  const houseSystem = input.houseSystem || engine.DEFAULT_HOUSE_SYSTEM;

  // --- Tropical (Western) positions of date ------------------------------
  const tropicalRaw = engine.positions(jdUT, CORE_BODIES, { sidereal: false });
  const tropicalHouses = engine.houses(jdUT, input.latitude, input.longitude, {
    houseSystem,
    sidereal: false,
  });

  // --- Sidereal (Vedic) positions with the requested ayanamsa ------------
  const siderealRaw = engine.positions(jdUT, CORE_BODIES, {
    sidereal: true,
    ayanamsa: ayanamsaKey,
  });
  const siderealHouses = engine.houses(jdUT, input.latitude, input.longitude, {
    houseSystem,
    sidereal: true,
    ayanamsa: ayanamsaKey,
  });
  const ayanamsa = engine.ayanamsaForDate(jdUT, ayanamsaKey);

  const decorate = (raw) => {
    const out = {};
    for (const body of Object.keys(raw)) {
      const position = buildPosition(body, raw[body]);
      position.sign = signFromLongitude(position.longitude);
      out[body] = position;
    }
    return out;
  };

  const tropicalPlanets = decorate(tropicalRaw);
  const siderealPlanets = decorate(siderealRaw);

  const angle = (longitude, label) => {
    const position = buildPosition(label, { longitude, latitude: 0, speed: 0 });
    position.sign = signFromLongitude(longitude);
    return position;
  };

  const tropicalAngles = {
    ascendant: angle(tropicalHouses.ascendant, "ascendant"),
    mc: angle(tropicalHouses.mc, "mc"),
  };
  const siderealAngles = {
    ascendant: angle(siderealHouses.ascendant, "ascendant"),
    mc: angle(siderealHouses.mc, "mc"),
  };

  const moonSidereal = siderealPlanets.moon;
  const nakshatra = nakshatraFromLongitude(moonSidereal.longitude);
  const rashiPosition = signFromLongitude(moonSidereal.longitude);

  return {
    input: {
      date: input.date,
      time: input.time,
      place: input.place || null,
      city: input.city || null,
      region: input.region || null,
      country: input.country || null,
      latitude: round(Number(input.latitude), 6),
      longitude: round(Number(input.longitude), 6),
      timeZone: conversion.timeZone || null,
      offsetLabel: conversion.offsetLabel,
      offsetMinutes: conversion.offsetMinutes,
      ayanamsa: ayanamsaKey,
      houseSystem,
    },
    time: {
      local: { ...wall, date: input.date, time: input.time },
      utc: conversion.utc,
      julianDayUT: round(jdUT, 8),
      timeZone: conversion.timeZone,
      offsetMinutes: conversion.offsetMinutes,
      offsetLabel: conversion.offsetLabel,
      abbreviation: conversion.abbreviation,
      isDst: conversion.isDst,
      dstNote: conversion.note,
      ambiguous: conversion.ambiguous,
      nonexistent: conversion.nonexistent,
      source: hasManualOffset
        ? "Manual UTC offset supplied with the birth details"
        : "IANA time zone resolved from the birth place (historical DST rules applied)",
    },
    ayanamsa: {
      key: ayanamsaKey,
      system: ayanamsa.system.name,
      value: round(ayanamsa.ayanamsa, 6),
      dms: toDms(ayanamsa.ayanamsa),
      description: ayanamsa.system.description,
      usedFor: ayanamsa.system.usedFor,
    },
    tropical: {
      zodiac: "Tropical (Western) — 0° Aries is the equinox of date",
      planets: tropicalPlanets,
      angles: tropicalAngles,
      sunSign: rashiSummary(tropicalPlanets.sun.sign),
      moonSign: rashiSummary(tropicalPlanets.moon.sign),
      ascendantSign: rashiSummary(tropicalAngles.ascendant.sign),
    },
    sidereal: {
      zodiac: "Sidereal (Vedic) — the ayanamsa is subtracted from the tropical longitude",
      planets: siderealPlanets,
      angles: siderealAngles,
      rashi: rashiSummary(rashiPosition),
      rashiPosition,
      nakshatra,
      vashya: vashyaOf(rashiPosition.name, rashiPosition.degreesInSign),
      houseSystem: siderealHouses.system,
      cusps: siderealHouses.cusps.map((cusp, index) => ({
        house: index + 1,
        longitude: round(norm360(cusp), 6),
        sign: signFromLongitude(cusp).name,
      })),
    },
    meta: {
      engine: engine.getStatus(),
      generatedAt: new Date().toISOString(),
    },
  };
};

module.exports = {
  buildChart,
  signFromLongitude,
  nakshatraFromLongitude,
  vashyaOf,
  rashiSummary,
  PLANET_LABELS,
  NAKSHATRA_SPAN,
  PADA_SPAN,
  CORE_BODIES,
};
/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Calculator service — the ONE orchestration layer
 *
 *  Every calculator endpoint funnels through here. Chart
 *  mathematics happens ONLY in chartService/engine; this file
 *  decides which pieces a given calculator needs and wraps
 *  them with interpretation text.
 * ==========================================================
 */

const engine = require("./engine");
const { buildChart, rashiSummary } = require("./chartService");
const numerologyService = require("./numerologyService");
const kutaService = require("./kutaService");
const synastry = require("./synastry");
const interpretations = require("./interpretationService");
const timezoneService = require("./timezoneService");
const { SIGNS } = require("./constants");
const { round } = require("./utils");

/* =========================
   HELPERS
========================= */

const chartInput = (person) => ({
  date: person.date,
  time: person.time,
  latitude: person.latitude,
  longitude: person.longitude,
  timeZone: person.timeZone,
  utcOffsetMinutes: person.utcOffsetMinutes,
  ayanamsa: person.ayanamsa,
  houseSystem: person.houseSystem,
  city: person.city,
  region: person.region,
  country: person.country,
  place: person.place,
});

/** Echo of the birth details actually used — nothing extra, nothing invented */
const birthEcho = (person) => ({
  date: person.date,
  time: person.time,
  city: person.city || null,
  region: person.region || null,
  country: person.country || null,
  place: person.place || null,
  latitude: person.latitude,
  longitude: person.longitude,
  timeZone: person.timeZone || null,
  utcOffsetMinutes: person.utcOffsetMinutes === undefined ? null : person.utcOffsetMinutes,
  ayanamsa: person.ayanamsa,
  houseSystem: person.houseSystem,
});

const readingFor = (map, name) => map[name] || { keywords: [], text: "" };

const timeDetails = (chart) => ({
  local: chart.time.local,
  utc: chart.time.utc,
  julianDayUT: chart.time.julianDayUT,
  timeZone: chart.time.timeZone,
  offsetLabel: chart.time.offsetLabel,
  offsetMinutes: chart.time.offsetMinutes,
  abbreviation: chart.time.abbreviation,
  isDst: chart.time.isDst,
  dstNote: chart.time.dstNote,
  ambiguous: chart.time.ambiguous,
  nonexistent: chart.time.nonexistent,
  source: chart.time.source,
});

/* =========================
   1. NUMEROLOGY
========================= */

const numerology = (value) =>
  numerologyService.calculate({
    fullName: value.fullName,
    dateOfBirth: value.dateOfBirth,
    system: value.system,
  });

/* =========================
   2. MOON SIGN (tropical)
========================= */

const moonSign = (value) => {
  const chart = buildChart(chartInput(value));
  const moon = chart.tropical.planets.moon;
  const sign = moon.sign;
  const reading = readingFor(interpretations.MOON_READINGS, sign.name);
  return {
    calculator: "moon-sign",
    input: birthEcho(value),
    moon: {
      sign: {
        name: sign.name,
        symbol: sign.symbol,
        element: sign.element,
        modality: sign.modality,
        ruler: sign.ruler,
        approximateRange: sign.westernRange || null,
      },
      degree: sign.degreesInSign,
      formatted: sign.formatted,
      fullPosition: sign.short,
      longitude: moon.longitude,
      speed: moon.speed,
      retrograde: moon.retrograde,
    },
    zodiac: "Tropical (Western)",
    interpretation: {
      keywords: reading.keywords,
      text: reading.text,
      synthesis: `Your natal Moon was at ${sign.formatted} of ${sign.name} when you were born. ${reading.text}`,
    },
    time: timeDetails(chart),
    meta: chart.meta,
  };
};

/* =========================
   3. SUN SIGN (tropical)
========================= */

const sunSign = (value) => {
  const chart = buildChart(chartInput(value));
  const sun = chart.tropical.planets.sun;
  const sign = sun.sign;
  const reading = readingFor(interpretations.SUN_READINGS, sign.name);
  return {
    calculator: "sun-sign",
    input: birthEcho(value),
    sun: {
      sign: {
        name: sign.name,
        symbol: sign.symbol,
        element: sign.element,
        modality: sign.modality,
        ruler: sign.ruler,
        approximateRange: sign.westernRange || null,
      },
      degree: sign.degreesInSign,
      formatted: sign.formatted,
      fullPosition: sign.short,
      longitude: sun.longitude,
    },
    zodiac: "Tropical (Western)",
    note:
      "The sign is derived from the Sun's real ecliptic longitude at your birth moment, not from a date table — the popular date ranges are approximations that can shift by a day near sign boundaries.",
    interpretation: {
      keywords: reading.keywords,
      text: reading.text,
      synthesis: `The Sun stood at ${sign.formatted} of ${sign.name} at your birth. ${reading.text}`,
    },
    time: timeDetails(chart),
    meta: chart.meta,
  };
};

/* =========================
   4. RASHI (sidereal Moon)
========================= */

const rashi = (value) => {
  const chart = buildChart(chartInput(value));
  const rashiPosition = chart.sidereal.rashiPosition;
  const nakshatra = chart.sidereal.nakshatra;
  const reading = readingFor(interpretations.RASHI_READINGS, rashiPosition.name);
  return {
    calculator: "rashi",
    input: birthEcho(value),
    rashi: {
      name: rashiPosition.name,
      sanskrit: rashiPosition.sanskrit,
      symbol: rashiPosition.symbol,
      element: rashiPosition.element,
      modality: rashiPosition.modality,
      ruler: rashiPosition.ruler,
      varna: rashiPosition.varna,
      degree: rashiPosition.degreesInSign,
      formatted: rashiPosition.formatted,
      fullPosition: rashiPosition.short,
      siderealLongitude: rashiPosition.longitude,
    },
    nakshatra: {
      name: nakshatra.name,
      pada: nakshatra.pada,
      lord: nakshatra.lord,
    },
    vashya: chart.sidereal.vashya,
    ayanamsa: {
      key: chart.ayanamsa.key,
      name: chart.ayanamsa.system,
      value: chart.ayanamsa.value,
      dms: chart.ayanamsa.dms,
    },
    zodiac: "Sidereal (Vedic)",
    interpretation: {
      keywords: reading.keywords,
      text: reading.text,
      synthesis: `Chandra (the Moon) occupied ${rashiPosition.formatted} of ${rashiPosition.sanskrit} (${rashiPosition.name}) in the ${chart.ayanamsa.system} zodiac. ${reading.text}`,
    },
    time: timeDetails(chart),
    meta: chart.meta,
  };
};

/* =========================
   5. ASCENDANT (tropical + sidereal)
========================= */

const ascendant = (value) => {
  const chart = buildChart(chartInput(value));
  const tropicalAsc = chart.tropical.angles.ascendant;
  const siderealAsc = chart.sidereal.angles.ascendant;
  const reading = readingFor(interpretations.ASCENDANT_READINGS, tropicalAsc.sign.name);
  return {
    calculator: "ascendant",
    input: birthEcho(value),
    ascendant: {
      sign: {
        name: tropicalAsc.sign.name,
        symbol: tropicalAsc.sign.symbol,
        element: tropicalAsc.sign.element,
        modality: tropicalAsc.sign.modality,
        ruler: tropicalAsc.sign.ruler,
      },
      degree: tropicalAsc.sign.degreesInSign,
      formatted: tropicalAsc.sign.formatted,
      fullPosition: tropicalAsc.sign.short,
      longitude: tropicalAsc.longitude,
    },
    siderealLagna: {
      sign: {
        name: siderealAsc.sign.name,
        sanskrit: siderealAsc.sign.sanskrit,
        symbol: siderealAsc.sign.symbol,
      },
      degree: siderealAsc.sign.degreesInSign,
      formatted: siderealAsc.sign.formatted,
      fullPosition: siderealAsc.sign.short,
    },
    midheaven: {
      sign: chart.tropical.angles.mc.sign.name,
      symbol: chart.tropical.angles.mc.sign.symbol,
      formatted: chart.tropical.angles.mc.sign.formatted,
    },
    houseSystem: chart.sidereal.houseSystem,
    ayanamsa: {
      key: chart.ayanamsa.key,
      name: chart.ayanamsa.system,
      value: chart.ayanamsa.value,
      dms: chart.ayanamsa.dms,
    },
    zodiac: "Tropical (Western) ascendant with the sidereal Lagna for reference",
    interpretation: {
      keywords: reading.keywords,
      text: reading.text,
      synthesis: `${tropicalAsc.sign.name} was rising at ${tropicalAsc.sign.formatted} on the eastern horizon at your birth moment. ${reading.text}`,
    },
    time: timeDetails(chart),
    meta: chart.meta,
  };
};

/* =========================
   6. AYANAMSA
========================= */

/** degrees -> DMS object */
const toDmsObject = (value) => {
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutesFull = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = Math.round((minutesFull - minutes) * 60);
  const carry = seconds === 60 ? 1 : 0;
  return {
    degrees: value < 0 ? -(degrees + carry) : degrees + carry,
    minutes: carry ? 0 : minutes,
    seconds: carry ? 0 : seconds,
  };
};

const ayanamsa = (value) => {
  engine.ensureReady();

  const [year, month, day] = value.date.split("-").map(Number);
  const [hour, minute, second = 0] = value.time.split(":").map(Number);
  const wall = { year, month, day, hour, minute, second };

  const hasManualOffset = value.utcOffsetMinutes !== null && value.utcOffsetMinutes !== undefined;
  const conversion = hasManualOffset
    ? timezoneService.fixedOffsetToUtc(wall, Number(value.utcOffsetMinutes))
    : timezoneService.wallClockToUtc(wall, value.timeZone);

  const jdUT = engine.julianDayUT(conversion.utc);
  const selected = engine.ayanamsaForDate(jdUT, value.ayanamsa);

  const comparison = Object.keys(engine.AYANAMSA_SYSTEMS).map((key) => {
    const entry = engine.ayanamsaForDate(jdUT, key);
    return {
      key,
      name: entry.system.name,
      value: round(entry.ayanamsa, 6),
      dms: toDmsObject(entry.ayanamsa),
    };
  });

  return {
    calculator: "ayanamsa",
    input: {
      date: value.date,
      time: value.time,
      timeZone: value.timeZone || null,
      utcOffsetMinutes: hasManualOffset ? value.utcOffsetMinutes : null,
    },
    time: {
      local: { date: value.date, time: value.time },
      utc: conversion.utc,
      julianDayUT: round(jdUT, 8),
      timeZone: conversion.timeZone,
      offsetLabel: conversion.offsetLabel,
      offsetMinutes: conversion.offsetMinutes,
      abbreviation: conversion.abbreviation,
      isDst: conversion.isDst,
      ambiguous: conversion.ambiguous,
      nonexistent: conversion.nonexistent,
      source: hasManualOffset
        ? "Manual UTC offset supplied"
        : "IANA time zone (historical DST rules applied)",
    },
    selected: {
      key: selected.key,
      name: selected.system.name,
      value: round(selected.ayanamsa, 6),
      dms: toDmsObject(selected.ayanamsa),
      description: selected.system.description,
      usedFor: selected.system.usedFor,
    },
    explanation:
      `On this date the ${selected.system.name} ayanamsa is ${round(selected.ayanamsa, 4)}°. ` +
      `To convert a tropical (Western) longitude into a sidereal (Vedic) longitude, subtract this value: ` +
      `sidereal = tropical − ${round(selected.ayanamsa, 4)}°. The ayanamsa grows by about 50.3 arc-seconds per year ` +
      `as the equinox precesses, which is why it is always computed for the exact moment — and why every PlutoAstro ` +
      `Vedic calculator derives it from the same Swiss Ephemeris call.`,
    comparison,
    meta: { engine: engine.getStatus(), generatedAt: new Date().toISOString() },
  };
};

/* =========================
   7. NAKSHATRA (sidereal Moon)
========================= */

const nakshatra = (value) => {
  const chart = buildChart(chartInput(value));
  const nak = chart.sidereal.nakshatra;
  const moon = chart.sidereal.planets.moon;
  const rashiPosition = chart.sidereal.rashiPosition;
  const reading = readingFor(interpretations.NAKSHATRA_READINGS, nak.name);
  return {
    calculator: "nakshatra",
    input: birthEcho(value),
    nakshatra: {
      name: nak.name,
      sanskrit: nak.sanskrit,
      index: nak.index,
      pada: nak.pada,
      lord: nak.lord,
      deity: nak.deity,
      gana: nak.gana,
      yoni: nak.yoni,
      nadi: nak.nadi,
      position: nak.position,
      formatted: nak.formatted,
      spanStart: nak.spanStart,
      spanEnd: nak.spanEnd,
    },
    moon: {
      sign: moon.sign.name,
      formatted: moon.sign.formatted,
      siderealLongitude: moon.longitude,
    },
    rashi: rashiSummary(rashiPosition),
    ayanamsa: {
      key: chart.ayanamsa.key,
      name: chart.ayanamsa.system,
      value: chart.ayanamsa.value,
      dms: chart.ayanamsa.dms,
    },
    zodiac: "Sidereal (Vedic)",
    interpretation: {
      keywords: reading.keywords,
      text: reading.text,
      synthesis: `Your Moon occupied ${nak.formatted} of ${nak.name} (pada ${nak.pada} of 4), ruled by ${nak.lord}. ${reading.text}`,
    },
    time: timeDetails(chart),
    meta: chart.meta,
  };
};

/* =========================
   8 & 9. COMPATIBILITY
========================= */

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const compatSummary = (chart, person, label) => ({
  label,
  name: person.name || null,
  gender: person.gender || null,
  birth: birthEcho(person),
  sunSign: {
    name: chart.tropical.sunSign.name,
    symbol: chart.tropical.sunSign.symbol,
    element: chart.tropical.sunSign.element,
    modality: chart.tropical.sunSign.modality,
  },
  moonSign: {
    name: chart.tropical.moonSign.name,
    symbol: chart.tropical.moonSign.symbol,
    element: chart.tropical.moonSign.element,
    modality: chart.tropical.moonSign.modality,
  },
  ascendant: chart.tropical.ascendantSign.name,
  rashi: chart.sidereal.rashi.name,
  nakshatra: {
    name: chart.sidereal.nakshatra.name,
    pada: chart.sidereal.nakshatra.pada,
    lord: chart.sidereal.nakshatra.lord,
  },
});

/** Classical Ashtakoota over the two sidereal Moons (groom row / bride column) */
const gunaMilan = (chartGroom, chartBride) => {
  const groomRashi = chartGroom.sidereal.rashiPosition;
  const brideRashi = chartBride.sidereal.rashiPosition;
  const groomNak = chartGroom.sidereal.nakshatra;
  const brideNak = chartBride.sidereal.nakshatra;

  const kutas = [
    kutaService.varnaKuta(chartGroom.sidereal.rashi, chartBride.sidereal.rashi),
    kutaService.vashyaKuta(chartGroom.sidereal.vashya, chartBride.sidereal.vashya),
    kutaService.taraKuta(groomNak, brideNak),
    kutaService.yoniKuta(groomNak.yoni, brideNak.yoni),
    kutaService.grahaMaitriKuta(chartGroom.sidereal.rashi.ruler, chartBride.sidereal.rashi.ruler),
    kutaService.ganaKuta(groomNak.gana, brideNak.gana),
    kutaService.bhakootKuta(groomRashi.index, brideRashi.index, groomRashi.name, brideRashi.name),
    kutaService.nadiKuta(groomNak.nadi, brideNak.nadi),
  ];

  const total = kutas.reduce((sum, kuta) => sum + kuta.points, 0);
  const max = kutas.reduce((sum, kuta) => sum + kuta.maxPoints, 0);

  return {
    kutas,
    total: Math.round(total * 10) / 10,
    max,
    percentage: Math.round((total / max) * 1000) / 10,
    ratio: total / max,
  };
};

/** Normalise the synastry contact scores to a 0..1 ratio */
const synastryRatio = (contacts) => {
  const weightSum = contacts.reduce((sum, contact) => sum + contact.weight, 0);
  if (!weightSum) return 0.5;
  const net = contacts.reduce((sum, contact) => sum + contact.score, 0);
  return clamp01((net + weightSum) / (2 * weightSum));
};

const isSupportive = (contact) =>
  contact.aspect.quality === "harmonious" || contact.aspect.quality === "fusion";

const isTense = (contact) =>
  contact.aspect.quality === "challenging" || contact.aspect.quality === "polarizing";

const loveCompatibility = (value) => {
  const chart1 = buildChart(chartInput(value.person1));
  const chart2 = buildChart(chartInput(value.person2));

  /* Classical kutas are directional (groom/bride). Use gender when given. */
  const groomFirst =
    value.person1.gender === "male" && value.person2.gender === "female" ? true : false;
  const chartGroom = groomFirst ? chart1 : chart2;
  const chartBride = groomFirst ? chart2 : chart1;

  const milan = gunaMilan(chartGroom, chartBride);
  const contacts = synastry.findContacts(chart1, chart2, { friendship: false });
  const temperaments = synastry.compareTemperaments(chart1, chart2);

  const sRatio = synastryRatio(contacts);
  const overall = clamp01(0.5 * milan.ratio + 0.5 * sRatio);
  const band = interpretations.loveBandFor(overall);

  const strengths = [
    ...milan.kutas
      .filter((kuta) => kuta.percentage >= 75)
      .slice(0, 3)
      .map((kuta) => `${kuta.name}: ${kuta.points}/${kuta.maxPoints} — ${kuta.detail}`),
    ...contacts
      .filter(isSupportive)
      .slice(0, 3)
      .map((contact) => `${contact.headline} — ${contact.aspect.quality}: ${contact.theme}`),
  ].slice(0, 5);

  const challenges = [
    ...milan.kutas
      .filter((kuta) => kuta.points === 0)
      .slice(0, 3)
      .map((kuta) => `${kuta.name}: 0/${kuta.maxPoints} — ${kuta.detail}`),
    ...contacts
      .filter(isTense)
      .slice(0, 3)
      .map((contact) => `${contact.headline} — ${contact.aspect.quality}: ${contact.theme}`),
  ].slice(0, 5);

  return {
    calculator: "love-compatibility",
    people: {
      person1: compatSummary(chart1, value.person1, "Person 1"),
      person2: compatSummary(chart2, value.person2, "Person 2"),
    },
    gunaMilan: {
      method: "Ashtakoota (Guna Milan) — the classical eight-fold Vedic Moon matching, computed from both sidereal Moon positions",
      total: milan.total,
      max: milan.max,
      percentage: milan.percentage,
      kutas: milan.kutas,
    },
    synastry: {
      method: "Western synastry — real aspects between the two tropical charts",
      contacts,
      temperaments,
    },
    score: {
      value: Math.round(overall * 100),
      label: band.label,
      tone: band.tone,
      text: band.text,
      interpretation: `${band.text} The Vedic Guna Milan total is ${milan.total} of ${milan.max} (${milan.percentage}%), and the Western synastry contacts ${
        sRatio >= 0.6 ? "lean clearly harmonious" : sRatio >= 0.45 ? "lean mildly harmonious" : "lean demanding"
      }. Use both views together: the kutas describe instinctive harmony, the synastry describes how the two personalities actually meet.`,
    },
    strengths,
    challenges,
    meta: { engine: engine.getStatus(), generatedAt: new Date().toISOString() },
  };
};

/* =========================
   9. FRIENDSHIP COMPATIBILITY
========================= */

const friendshipCompatibility = (value) => {
  const chart1 = buildChart(chartInput(value.person1));
  const chart2 = buildChart(chartInput(value.person2));

  const contacts = synastry.findContacts(chart1, chart2, { friendship: true });
  const temperaments = synastry.compareTemperaments(chart1, chart2);
  const milan = gunaMilan(chart1, chart2);

  const sRatio = synastryRatio(contacts);
  const overall = clamp01(0.4 * milan.ratio + 0.6 * sRatio);
  const band = interpretations.friendshipBandFor(overall);

  /* Communication: Mercury and Moon contacts carry the dialogue */
  const commContacts = contacts.filter((contact) => {
    const bodies = [contact.person1Body.toLowerCase(), contact.person2Body.toLowerCase()];
    return bodies.includes("mercury") || bodies.includes("moon");
  });
  const commRatio = commContacts.length ? synastryRatio(commContacts) : sRatio;
  const communication = {
    score: Math.round(commRatio * 100),
    label: commRatio >= 0.7 ? "Easy flow" : commRatio >= 0.45 ? "Mostly smooth" : "Needs patience",
    detail: commContacts.length
      ? `${commContacts.filter((c) => c.score > 0).length} of ${commContacts.length} Mercury/Moon contacts are supportive — the strongest is ${commContacts[0].headline}.`
      : "No close Mercury or Moon contacts within orb — conversations stay pleasant but rarely deepen on their own.",
  };

  const strengths = [
    ...contacts
      .filter(isSupportive)
      .slice(0, 4)
      .map((contact) => `${contact.headline} — ${contact.theme}`),
    ...milan.kutas
      .filter((kuta) => kuta.percentage >= 75)
      .slice(0, 2)
      .map((kuta) => `${kuta.name} ${kuta.points}/${kuta.maxPoints} — ${kuta.about}`),
  ].slice(0, 5);

  const temperamentNotes = [temperaments.elementNote, temperaments.modalityNote].filter(Boolean);
  const differences = [
    ...contacts
      .filter(isTense)
      .slice(0, 4)
      .map((contact) => `${contact.headline} — ${contact.theme}`),
    ...(temperaments.moon && !temperaments.moon.matches ? temperamentNotes.slice(0, 2) : []),
  ].slice(0, 5);

  return {
    calculator: "friendship-compatibility",
    people: {
      person1: compatSummary(chart1, value.person1, "Person 1"),
      person2: compatSummary(chart2, value.person2, "Person 2"),
    },
    score: {
      value: Math.round(overall * 100),
      label: band.label,
      tone: band.tone,
      text: band.text,
      interpretation: `${band.text} The Guna Milan baseline between your Moons is ${milan.total} of ${milan.max}, and the friendship-weighted synastry contacts ${
        sRatio >= 0.6 ? "are clearly supportive" : sRatio >= 0.45 ? "are mildly supportive" : "need conscious effort"
      }.`,
    },
    communication,
    synastry: {
      method: "Western synastry weighted for friendship — Mercury (communication), Moon (comfort), Venus (warmth), Jupiter (fun and trust), Sun/Saturn/Mars (reliability and friction)",
      contacts,
      temperaments,
    },
    gunaMilan: {
      total: milan.total,
      max: milan.max,
      percentage: milan.percentage,
      kutas: milan.kutas,
    },
    strengths,
    differences,
    meta: { engine: engine.getStatus(), generatedAt: new Date().toISOString() },
  };
};

module.exports = {
  numerology,
  moonSign,
  sunSign,
  rashi,
  ascendant,
  ayanamsa,
  nakshatra,
  loveCompatibility,
  friendshipCompatibility,
};






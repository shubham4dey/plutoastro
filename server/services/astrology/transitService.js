/** ==========================================================
 *  PlutoAstro — Calculators
 *  Transit service — planetary positions & transits for a
 *  selected moment, place and time zone.
 *
 *  ALL planetary positions come from the Swiss Ephemeris engine
 *  (server/services/astrology/engine.js). Nothing here is mock
 *  or static — every degree, speed and retrograde flag is
 *  computed live for the user's selected date, time and timezone.
 *
 *  Supports IST, UK, US and every IANA timezone, with DST handled
 *  by the existing timezoneService.
 * ========================================================== */

const engine = require("./engine");
const timezoneService = require("./timezoneService");
const { buildChart, signFromLongitude } = require("./chartService");
const { norm360, angleDiff, round } = require("./utils");
const { SIGNS } = require("./constants");

/* ---------- bodies shown on the transit wheel ---------- */

const TRANSIT_BODIES = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "truenode",
  "ketu",
];

const PLANET_LABEL = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  truenode: "Rahu",
  ketu: "Ketu",
};

/* Display-only: nodes showed the raw engine keys ("True Node"/"Mean Node").
   Keep "true/middle node" OUT of transit labels entirely — Rahu/Ketu only. */
const TRANSIT_DISPLAY_LABEL = {
  truenode: "Rahu",
  ketu: "Ketu",
};

const transitLabelFor = (body) => TRANSIT_DISPLAY_LABEL[body] || PLANET_LABEL[body] || body;

const PLANET_SYMBOL = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  truenode: "☊",
  ketu: "☋",
};

/* Ketu is ALWAYS exactly opposite Rahu — derived, never computed separately. */
const ketuFromRahu = (rahu) => {
  const lon = round(norm360(rahu.longitude + 180), 6);
  return {
    body: "ketu",
    label: "Ketu",
    symbol: PLANET_SYMBOL.ketu,
    longitude: lon,
    speed: rahu.speed,
    isRetrograde: rahu.isRetrograde,
    sign: signFromLongitude(lon),
    degreesInSign: round(lon % 30, 4),
  };
};

/* ---------- helper: one body position at a given JD (tropical) ---------- */

const bodyPositionAt = (jdUT, body) => {
  if (body === "ketu") {
    return ketuFromRahu(bodyPositionAt(jdUT, "truenode"));
  }
  const data = engine.bodyPosition(jdUT, body, { sidereal: false });
  const lon = round(data.longitude, 6);
  const speed = round(data.speed, 8);
  return {
    body,
    label: transitLabelFor(body),
    symbol: PLANET_SYMBOL[body] || "",
    longitude: lon,
    speed,
    isRetrograde: speed < 0,
    sign: signFromLongitude(lon),
    degreesInSign: round(lon % 30, 4),
  };
};

/* ---------- helper: detect near-term sign changes ---------- */

const sampleSignHistory = (jdUT, body, daysBack = 4, daysAhead = 8) => {
  const samples = [];
  for (let d = -daysBack; d <= daysAhead; d++) {
    const jd = jdUT + d;
    const pos = bodyPositionAt(jd, body);
    samples.push({ jd, dayOffset: d, ...pos });
  }
  return samples;
};

const detectSignChange = (samples) => {
  const changes = [];
  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1];
    const curr = samples[i];
    if (prev.sign.index !== curr.sign.index) {
      const entering = curr.sign.index > prev.sign.index;
      changes.push({
        type: "signChange",
        body: curr.body,
        label: transitLabelFor(curr.body),
        symbol: PLANET_SYMBOL[curr.body] || "",
        direction: entering ? "entering" : "leaving",
        fromSign: prev.sign.name,
        toSign: curr.sign.name,
        fromSymbol: prev.sign.symbol,
        toSymbol: curr.sign.symbol,
        dayOffset: curr.dayOffset,
        longitudeAtChange: curr.longitude,
      });
    }
  }
  return changes;
};

/* ---------- upcoming transits: real sky aspects in the window ----------
 *
 *  A transit chart is read for a MOMENT and a PLACE, not for a birth
 *  chart, so an "upcoming transit" here is an aspect between two planets
 *  in the sky (for example "Mercury trine Saturn"). Both planets are
 *  sampled at the SAME instant while the window advances, so every entry
 *  is a genuine astronomical contact — never a planet aspecting its own
 *  frozen position at the selected moment.
 *
 *  - The Moon is left out of the scan: it sweeps every aspect to every
 *    planet roughly once a month and would drown the list. It is still
 *    drawn on the wheel with its real degree, sign and speed.
 *  - Ketu is left out of the scan: it is always exactly opposite Rahu, so
 *    every Ketu aspect would duplicate a Rahu aspect. It is still drawn
 *    on the wheel.
 */

const TRANSIT_ASPECTS = [
  { name: "Conjunction", exact: 0, orb: 8 },
  { name: "Opposition", exact: 180, orb: 8 },
  { name: "Trine", exact: 120, orb: 6 },
  { name: "Square", exact: 90, orb: 6 },
  { name: "Sextile", exact: 60, orb: 5 },
  { name: "Quincunx", exact: 150, orb: 3 },
];

/* Listed fastest-first: a pair is always written the same way
   ("Mercury Trine Saturn") so one geometry is never reported twice. */
const ASPECT_SCAN_BODIES = [
  "sun",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "truenode",
];

/* An "exact" contact: the tightest separation reached inside the window
   must be within this many degrees of the exact aspect angle. */
const EXACT_CONTACT_ORB = 1;
const MAX_UPCOMING_TRANSITS = 12;

const bodyVibeFor = (body) => {
  const map = {
    sun: "identity, vitality and purpose",
    moon: "feelings, habits and private life",
    mercury: "thinking, speech and daily exchange",
    venus: "values, affection and taste",
    mars: "drive, courage and the way you act",
    jupiter: "growth, confidence and expansion",
    saturn: "structure, discipline and long-term lessons",
    uranus: "change, originality and sudden insight",
    neptune: "imagination, dreams and what dissolves",
    pluto: "depth, transformation and power",
    truenode: "karmic direction and growth edges",
    ketu: "karmic release and familiar patterns",
  };
  return map[body] || "planetary energy";
};

const ASPECT_TONE = {
  Conjunction: "blends its energy with",
  Opposition: "stands in polarity with",
  Trine: "flows in easy harmony with",
  Square: "builds creative tension with",
  Sextile: "opens a supportive link with",
  Quincunx: "asks for a careful adjustment with",
};

const transitInterpretation = (r) =>
  `${r.labelA} in ${r.signA.name} ${ASPECT_TONE[r.aspect] || "forms a contact with"} ${r.labelB} in ${r.signB.name} — ${bodyVibeFor(r.bodyA)} meets ${bodyVibeFor(r.bodyB)}.`;

/* Local refinement around the closest sampled day, so the reported orb and
   timing are not limited by the one-day sampling step. */
const REFINE_HALF_WINDOW_DAYS = 1.5;
const REFINE_STEP_DAYS = 0.125; // 3 hours

const refineContact = (jdUT, bodyA, bodyB, aspectExact, approxDayOffset) => {
  let best = null;
  const start = approxDayOffset - REFINE_HALF_WINDOW_DAYS;
  const end = approxDayOffset + REFINE_HALF_WINDOW_DAYS;
  for (let offset = start; offset <= end + 1e-9; offset += REFINE_STEP_DAYS) {
    const jd = jdUT + offset;
    const a = bodyPositionAt(jd, bodyA);
    const b = bodyPositionAt(jd, bodyB);
    const sep = Math.abs(angleDiff(a.longitude, b.longitude));
    const orb = Math.abs(sep - aspectExact);
    if (!best || orb < best.orb) {
      best = { orb, dayOffset: round(offset, 4), a, b };
    }
  }
  return best;
};

/**
 * Upcoming transits = real aspects that actually become exact in the sky
 * during the window. Both planets are sampled at the SAME instant, so every
 * entry is a genuine astronomical contact (e.g. "Mercury Trine Saturn") and
 * never a planet aspecting its own frozen position.
 */
const upcomingTransits = (jdUT, windowDays = 30) => {
  /* ---- coarse daily sweep ---- */
  const coarse = new Map(); // bodyA|bodyB|aspect -> tightest daily sample

  for (let day = 1; day <= windowDays; day++) {
    const jdFwd = jdUT + day;
    const positionsToday = {};
    for (const body of ASPECT_SCAN_BODIES) {
      positionsToday[body] = bodyPositionAt(jdFwd, body);
    }

    for (let i = 0; i < ASPECT_SCAN_BODIES.length; i++) {
      const bodyA = ASPECT_SCAN_BODIES[i];
      const a = positionsToday[bodyA];
      for (let j = i + 1; j < ASPECT_SCAN_BODIES.length; j++) {
        const bodyB = ASPECT_SCAN_BODIES[j];
        const b = positionsToday[bodyB];
        const sep = Math.abs(angleDiff(a.longitude, b.longitude));
        for (const aspect of TRANSIT_ASPECTS) {
          const orb = Math.abs(sep - aspect.exact);
          if (orb > aspect.orb) continue;
          const key = `${bodyA}|${bodyB}|${aspect.name}`;
          const existing = coarse.get(key);
          if (!existing || orb < existing.orb) {
            coarse.set(key, { bodyA, bodyB, aspect, orb, dayOffset: day });
          }
          break; // one geometry is reported once
        }
      }
    }
  }

  /* ---- refine + keep only genuine contacts ---- */
  const entries = [];
  for (const hit of coarse.values()) {
    const refined = refineContact(
      jdUT,
      hit.bodyA,
      hit.bodyB,
      hit.aspect.exact,
      hit.dayOffset
    );
    if (!refined) continue;
    // A real transit must actually reach the exact angle inside the window.
    if (refined.orb > EXACT_CONTACT_ORB) continue;

    const a = refined.a;
    const b = refined.b;
    entries.push({
      aspect: hit.aspect.name,
      bodyA: hit.bodyA,
      labelA: a.label,
      symbolA: a.symbol,
      signA: a.sign,
      longitudeA: a.longitude,
      bodyB: hit.bodyB,
      labelB: b.label,
      symbolB: b.symbol,
      signB: b.sign,
      longitudeB: b.longitude,
      /* Back-compat aliases (share text and older renderers read these). */
      transitBody: hit.bodyA,
      transitLabel: a.label,
      transitSymbol: a.symbol,
      transitLongitude: a.longitude,
      transitSign: a.sign,
      natalBody: hit.bodyB,
      natalLabel: b.label,
      natalLongitude: b.longitude,
      natalSign: b.sign,
      orb: round(refined.orb, 3),
      dayOffset: refined.dayOffset,
      exactDayOffset: Math.ceil(refined.dayOffset),
      withinNextDays: Math.max(0, Math.round(refined.dayOffset)),
      isExact: true,
    });
  }

  const sorted = entries.sort((x, y) => {
    if (x.dayOffset !== y.dayOffset) return x.dayOffset - y.dayOffset;
    return x.orb - y.orb;
  });

  /* Diversity guard: no single planet + aspect combination floods the list. */
  const perPlanetAspect = new Map();
  const diverse = [];
  for (const entry of sorted) {
    const key = `${entry.bodyA}|${entry.aspect}`;
    const used = perPlanetAspect.get(key) || 0;
    if (used >= 2) continue;
    perPlanetAspect.set(key, used + 1);
    diverse.push(entry);
  }

  return diverse.slice(0, MAX_UPCOMING_TRANSITS).map((entry) => ({
    ...entry,
    interpretation: transitInterpretation(entry),
  }));
};

/* ---------- main computeTransits ---------- */

const computeTransits = (input) => {
  const {
    date,
    time,
    latitude,
    longitude,
    timeZone,
    utcOffsetMinutes,
    dstCorrection,
    ayanamsa,
    houseSystem,
    city,
    region,
    country,
    place,
  } = input;

  const wall = {
    year: Number(date.split("-")[0]),
    month: Number(date.split("-")[1]),
    day: Number(date.split("-")[2]),
    hour: time ? Number(time.split(":")[0]) : 12,
    minute: time && time.includes(":") ? Number(time.split(":")[1]) : 0,
    second: time && time.split(":").length > 2 ? Number(time.split(":")[2]) : 0,
  };

  let conversion;
  if (utcOffsetMinutes != null && Number.isFinite(Number(utcOffsetMinutes))) {
    // Manual offset wins when BOTH are present (same precedence as buildChart).
    conversion = timezoneService.fixedOffsetToUtc(wall, Number(utcOffsetMinutes));
  } else if (timeZone && timezoneService.isValidTimeZone(timeZone)) {
    conversion = timezoneService.wallClockToUtc(wall, timeZone);
    // OPTIONAL DST correction override (minutes): "auto"/null = trust the
    // real historical DST rules from timezoneService (default). A numeric
    // value shifts the resolved UTC instant by that many minutes.
    const dstShift = Number(dstCorrection);
    if (dstCorrection != null && dstCorrection !== "auto" && Number.isFinite(dstShift) && dstShift !== 0) {
      const shiftedMs = conversion.utcMs - dstShift * 60000;
      const shiftedDate = new Date(shiftedMs);
      conversion = {
        ...conversion,
        utcMs: shiftedMs,
        utcDate: shiftedDate,
        utc: {
          year: shiftedDate.getUTCFullYear(),
          month: shiftedDate.getUTCMonth() + 1,
          day: shiftedDate.getUTCDate(),
          hour: shiftedDate.getUTCHours(),
          minute: shiftedDate.getUTCMinutes(),
          second: shiftedDate.getUTCSeconds(),
        },
        note: `${conversion.note || ""} Manual DST correction of ${dstShift} minutes applied.`.trim(),
      };
    }
  } else {
    throw new Error("A valid time zone or UTC offset is required for transit calculations.");
  }

  const jdUT = engine.julianDayUT(conversion.utc);

  // The selected moment is also run through the one authoritative chart
  // pipeline, so the transit chart can report the rising sign / Midheaven of
  // the chosen place and moment. Note the chart is built at the SAME instant
  // and location the user selected — it is not a natal chart of a birth, and
  // it is never used as a frozen reference for the transit list below.
  const momentChart = buildChart({
    date,
    time,
    latitude,
    longitude,
    timeZone: conversion.timeZone,
    utcOffsetMinutes: conversion.offsetMinutes,
    ayanamsa: ayanamsa || undefined,
    houseSystem: houseSystem || undefined,
    city,
    region,
    country,
    place,
  });

  const chartAngles = {
    ascendant: {
      label: "Ascendant (rising sign)",
      longitude: momentChart.tropical.angles.ascendant.longitude,
      sign: momentChart.tropical.angles.ascendant.sign,
      speed: 0,
      body: "ascendant",
    },
    midheaven: {
      label: "Midheaven (MC)",
      longitude: momentChart.tropical.angles.mc.longitude,
      sign: momentChart.tropical.angles.mc.sign,
      speed: 0,
      body: "mc",
    },
    houseSystem: momentChart.tropical.houseSystem || momentChart.input.houseSystem || null,
  };

  const currentTransits = TRANSIT_BODIES.map((body) => {
    const pos = bodyPositionAt(jdUT, body);
    const samples = sampleSignHistory(jdUT, body, 4, 8);
    const changes = detectSignChange(samples);
    const upcoming = changes.find((c) => c.dayOffset > 0);
    const recent = changes.find((c) => c.dayOffset <= 0);
    let nearest = null;
    if (upcoming && recent) {
      nearest =
        upcoming.dayOffset < Math.abs(recent.dayOffset) ? upcoming : recent;
    } else {
      nearest = upcoming || recent || null;
    }
    const signChange = nearest
      ? {
          ...nearest,
          daysUntil: nearest.dayOffset > 0 ? nearest.dayOffset : null,
          daysSince: nearest.dayOffset <= 0 ? Math.abs(nearest.dayOffset) : null,
        }
      : null;

    return {
      ...pos,
      signChange,
      isRetrograde: pos.isRetrograde,
      isSpeedNotable: Math.abs(pos.speed) < 0.1,
    };
  });

  const windowDays = 30;
  const upcoming = upcomingTransits(jdUT, windowDays);

  const zodiacWheel = currentTransits.map((t) => ({
    body: t.body,
    label: t.label,
    symbol: t.symbol,
    longitude: t.longitude,
    speed: t.speed,
    isRetrograde: t.isRetrograde,
    sign: t.sign,
    degreesInSign: t.degreesInSign,
    signIndex: t.sign.index,
    signChange: t.signChange,
  }));

  return {
    calculator: "planetary-transits",
    input: {
      date,
      time,
      latitude,
      longitude,
      timeZone: conversion.timeZone,
      utcOffsetMinutes: conversion.offsetMinutes,
      ayanamsa: ayanamsa || null,
      houseSystem: houseSystem || null,
      city: city || null,
      region: region || null,
      country: country || null,
      place: place || null,
    },
    time: {
      local: wall,
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
      source:
        conversion.timeZone
          ? "IANA time zone resolved from the selected place (historical DST rules applied)"
          : "Fixed UTC offset supplied with the selected details",
    },
    tropicalWheel: zodiacWheel,
    angles: chartAngles,
    retrogradeBodies: zodiacWheel.filter((t) => t.isRetrograde).map((t) => ({
      body: t.body,
      label: t.label,
      symbol: t.symbol,
      sign: t.sign,
      degreesInSign: t.degreesInSign,
      longitude: t.longitude,
    })),
    signChanges: currentTransits.map((t) => t.signChange).filter(Boolean),
    upcomingTransits: upcoming,
    transitWindowDays: windowDays,
    transitAspectBodies: ASPECT_SCAN_BODIES,
    summary: buildSummary(zodiacWheel, upcoming, windowDays),
    meta: {
      engine: engine.getStatus(),
      generatedAt: new Date().toISOString(),
    },
  };
};

const buildSummary = (wheel, upcoming, windowDays = 30) => {
  const retroCount = wheel.filter((t) => t.isRetrograde).length;
  const changeCount = wheel.filter((t) => t.signChange).length;
  const topTransit = upcoming.length ? upcoming[0] : null;

  const parts = [];
  parts.push(
    `${wheel.length} real planetary positions from the Swiss Ephemeris, computed for your selected moment, place and time zone.`
  );
  if (retroCount > 0) {
    parts.push(
      `${retroCount} planet${retroCount > 1 ? "s are" : " is"} retrograde right now — their motion appears to reverse from Earth's viewpoint.`
    );
  }
  if (changeCount > 0) {
    parts.push(
      `${changeCount} planet${changeCount > 1 ? "s" : ""} change sign in the near future.`
    );
  }
  if (topTransit) {
    const days = topTransit.withinNextDays;
    parts.push(
      `The next exact sky transit is ${topTransit.labelA} ${topTransit.aspect} ${topTransit.labelB} — within about ${days} day${days === 1 ? "" : "s"} (orb ${topTransit.orb}°).`
    );
  } else {
    parts.push(
      `No exact major planetary aspect forms between the slower planets over the next ${windowDays} days.`
    );
  }
  return parts.join(" ");
};

module.exports = {
  TRANSIT_BODIES,
  PLANET_LABEL,
  PLANET_SYMBOL,
  computeTransits,
};
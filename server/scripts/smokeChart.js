/* Temporary smoke test for the calculator engine chain. */
const fs = require("fs");
const path = require("path");
const engine = require("../services/astrology/engine");
const tz = require("../services/astrology/timezoneService");
const chartService = require("../services/astrology/chartService");

const out = [];
const log = (k, v) =>
  out.push(k + " => " + (typeof v === "string" ? v : JSON.stringify(v)).slice(0, 800));
const round6 = (v) => Math.round(v * 1e6) / 1e6;
const round3 = (v) => Math.round(v * 1e3) / 1e3;

try {
  engine.initialise();
  log("engine status", engine.getStatus());

  // --- Anchors -----------------------------------------------------------
  const jd2000 = engine.julianDayUT({ year: 2000, month: 1, day: 1, hour: 12 });
  log("JD 2000-01-01 12UT", jd2000);
  log("ayanamsa Lahiri J2000", engine.ayanamsaForDate(jd2000, "lahiri").ayanamsa);
  const jd1990 = engine.julianDayUT({ year: 1990, month: 4, day: 15, hour: 6, minute: 30 });
  log("ayanamsa Lahiri 1990-04-15", engine.ayanamsaForDate(jd1990, "lahiri").ayanamsa);
  log("ayanamsa KP 2000", engine.ayanamsaForDate(jd2000, "krishnamurti").ayanamsa);
  log("ayanamsa Fagan/Bradley 2000", engine.ayanamsaForDate(jd2000, "fagan_bradley").ayanamsa);

  // sidereal = tropical - ayanamsa consistency check
  const tropMoon = engine.bodyPosition(jd1990, "moon", { sidereal: false }).longitude;
  const sidMoon = engine.bodyPosition(jd1990, "moon", { sidereal: true, ayanamsa: "lahiri" }).longitude;
  const ayan = engine.ayanamsaForDate(jd1990, "lahiri").ayanamsa;
  log("sidereal consistency (arcsec)", {
    tropical: tropMoon,
    sidereal: sidMoon,
    difference: ((tropMoon - sidMoon - ayan + 540) % 360) - 180,
    arcsec: (((tropMoon - sidMoon - ayan + 540) % 360) - 180) * 3600,
  });

  // Independent Ascendant cross-check (Meeus standard formula) versus the engine
  const meanObliquity = (T) =>
    23.439291111 - 0.0130041667 * T - 1.638889e-7 * T * T + 5.036111e-7 * T * T * T;
  const jdToT = (jd) => (jd - 2451545.0) / 36525;
  const expectedAsc = (jd, latDeg, lonDeg) => {
    const eps = (meanObliquity(jdToT(jd)) * Math.PI) / 180;
    const armcDeg = engine.houses(jd, latDeg, lonDeg, { sidereal: false }).armc;
    const ramc = (armcDeg * Math.PI) / 180;
    const phi = (latDeg * Math.PI) / 180;
    let asc =
      Math.atan2(
        Math.cos(ramc),
        -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))
      ) *
      (180 / Math.PI);
    asc = ((asc % 360) + 360) % 360;
    return asc;
  };
  const places = [
    { name: "equator (Quito)", lat: 0, lon: -78.5 },
    { name: "Delhi", lat: 28.6139, lon: 77.209 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Sydney", lat: -33.8679, lon: 151.207 },
    { name: "Reykjavik", lat: 64.1466, lon: -21.9426 },
    { name: "Singapore", lat: 1.3521, lon: 103.8198 },
  ];
  for (const place of places) {
    const eng = engine.houses(jd1990, place.lat, place.lon, { sidereal: false }).ascendant;
    const ref = expectedAsc(jd1990, place.lat, place.lon);
    log(
      "asc cross-check " + place.name,
      { engine: round6(eng), independent: round6(ref), diffArcsec: round3(((eng - ref + 540) % 360 - 180) * 3600) }
    );
  }

  // --- Timezone ----------------------------------------------------------
  log("tz Delhi 1990-04-15 12:30", tz.wallClockToUtc({ year: 1990, month: 4, day: 15, hour: 12, minute: 30 }, "Asia/Kolkata").utc);
  log("tz New York 1990-07-04 09:00 (DST)", tz.wallClockToUtc({ year: 1990, month: 7, day: 4, hour: 9, minute: 0 }, "America/New_York"));
  log("tz London 1947-01-15 08:00", tz.wallClockToUtc({ year: 1947, month: 1, day: 15, hour: 8, minute: 0 }, "Europe/London").offsetMinutes);
  log("tz nonexistent 2024-03-10 02:30 NY", (() => {
    const r = tz.wallClockToUtc({ year: 2024, month: 3, day: 10, hour: 2, minute: 30 }, "America/New_York");
    return { offset: r.offsetMinutes, nonexistent: r.nonexistent, utc: r.utc };
  })());
  log("tz ambiguous 2024-11-03 01:30 NY", (() => {
    const r = tz.wallClockToUtc({ year: 2024, month: 11, day: 3, hour: 1, minute: 30 }, "America/New_York");
    return { offset: r.offsetMinutes, ambiguous: r.ambiguous, utc: r.utc };
  })());

  // --- Full charts -------------------------------------------------------
  const charts = [
    { label: "Delhi 1990-04-15 12:30 IST", input: { date: "1990-04-15", time: "12:30", latitude: 28.6139, longitude: 77.209, timeZone: "Asia/Kolkata", city: "New Delhi", country: "India" } },
    { label: "New York 1975-11-02 01:30 EST/EDT", input: { date: "1975-11-02", time: "01:30", latitude: 40.7128, longitude: -74.006, timeZone: "America/New_York" } },
    { label: "Sydney 2001-02-28 23:59 AEDT", input: { date: "2001-02-28", time: "23:59", latitude: -33.8679, longitude: 151.207, timeZone: "Australia/Sydney" } },
    { label: "London 2000-09-23 00:00 BST", input: { date: "2000-09-23", time: "00:00", latitude: 51.5074, longitude: -0.1278, timeZone: "Europe/London" } },
  ];
  for (const item of charts) {
    const chart = chartService.buildChart(item.input);
    log(item.label, {
      utc: chart.time.utc,
      offset: chart.time.offsetLabel,
      isDst: chart.time.isDst,
      sunTropical: chart.tropical.planets.sun.sign.name + " " + chart.tropical.planets.sun.sign.formatted,
      moonTropical: chart.tropical.planets.moon.sign.name + " " + chart.tropical.planets.moon.sign.formatted,
      ascTropical: chart.tropical.angles.ascendant.sign.name + " " + chart.tropical.angles.ascendant.sign.formatted,
      moonSidereal: chart.sidereal.planets.moon.sign.name + " " + chart.sidereal.planets.moon.sign.formatted,
      rashi: chart.sidereal.rashi.name + " (" + chart.sidereal.rashi.sanskrit + ")",
      nakshatra: chart.sidereal.nakshatra.name + " pada " + chart.sidereal.nakshatra.pada,
      ascSidereal: chart.sidereal.angles.ascendant.sign.name + " " + chart.sidereal.angles.ascendant.sign.formatted,
      ayanamsa: chart.ayanamsa.value,
    });
  }
} catch (error) {
  out.push("ERROR: " + (error && error.stack ? error.stack : error));
}

fs.writeFileSync(path.join(__dirname, "smoke.out.txt"), out.join("\n"), "utf8");
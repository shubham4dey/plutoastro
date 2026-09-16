/**
 * Extended accuracy / boundary probe for the PlutoAstro calculator engine.
 * Cross-checks engine output against known published ephemeris values and
 * verifies internal consistency, DST edge handling, leap years, unusual offsets.
 *
 * Run: node scripts/_accuracyProbe.js
 */
const engine = require("../services/astrology/engine");
const { buildChart } = require("../services/astrology/chartService");

let failures = 0;
const check = (name, actual, expected, tolerance) => {
  const ok =
    typeof actual === "string"
      ? actual === expected
      : Math.abs(actual - expected) <= tolerance;
  if (!ok) failures += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name}: actual=${actual} expected≈${expected} (tol ${tolerance})`
  );
};

const chart = (date, time, lat, lon, tz) =>
  buildChart({ date, time, latitude: lat, longitude: lon, timeZone: tz, ayanamsa: "lahiri" });

engine.ensureReady();

console.log("=== 1. Known reference values ===");
/* Sun 2000-01-01 12:00 UT ≈ 280.2° (10.2° Capricorn) */
const sunRef = chart("2000-01-01", "12:00", 51.5, -0.12, "Europe/London");
check("Sun longitude 2000-01-01 12:00 UT", sunRef.tropical.planets.sun.longitude, 280.2, 0.2);
check("Sun sign 2000-01-01", sunRef.tropical.planets.sun.sign.name, "Capricorn", 0);

/* Lahiri ayanamsa 2000-01-01 ≈ 23°51'11" = 23.8531° */
const jdRef = engine.julianDayUT({ year: 2000, month: 1, day: 1, hour: 12 });
const lahiri = engine.ayanamsaForDate(jdRef, "lahiri");
check("Lahiri ayanamsa 2000-01-01 12:00 UT", lahiri.ayanamsa, 23.8531, 0.02);

/* Moon 1990-08-15 09:00 UT ≈ 75.04° (Gemini 15°) — Swiss Ephemeris */
const moonRef = chart("1990-08-15", "14:30", 28.6139, 77.209, "Asia/Kolkata");
check("Moon longitude 1990-08-15 09:00 UT", moonRef.tropical.planets.moon.longitude, 75.037, 0.05);

console.log("\n=== 2. Internal consistency (sidereal = tropical − ayanamsa) ===");
const delhi = chart("1995-06-21", "06:45", 28.6139, 77.209, "Asia/Kolkata");
const tropicalMoon = delhi.tropical.planets.moon.longitude;
const siderealMoon = delhi.sidereal.rashiPosition.longitude;
const ayaValue = (((tropicalMoon - siderealMoon) % 360) + 360) % 360;
check("tropical − sidereal = Lahiri ayanamsa (1995-06-21)", ayaValue, 23.797, 0.03);
check(
  "Rashi == floor(siderealMoon/30) sign",
  delhi.sidereal.rashiPosition.name,
  ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][Math.floor(siderealMoon / 30)],
  0
);
const nakIndex = Math.floor(siderealMoon / (360 / 27));
check(
  "Nakshatra == floor(siderealMoon/13°20')",
  delhi.sidereal.nakshatra.name,
  ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"][nakIndex],
  0
);
const pada = Math.floor((siderealMoon % (360 / 27)) / (360 / 108)) + 1;
check("Nakshatra pada matches degree", delhi.sidereal.nakshatra.pada, pada, 0);

/* Sidereal Lagna must equal tropical Ascendant − ayanamsa */
const tropicalAsc = delhi.tropical.angles.ascendant.longitude;
const lagnaBandStart = Math.floor(((((tropicalAsc - ayaValue) % 360) + 360) % 360) / 30) * 30;
check(
  "Sidereal Lagna == tropical Asc − ayanamsa (same sign band)",
  delhi.sidereal.angles.ascendant.longitude >= lagnaBandStart &&
    delhi.sidereal.angles.ascendant.longitude < lagnaBandStart + 30
    ? 1
    : 0,
  1,
  0
);

console.log("\n=== 3. Sun sign cusp — Dec 2009 solstice (Sun enters Capricorn 17:47 UT) ===");
const beforeCusp = chart("2009-12-21", "17:00", 51.5, -0.12, "Europe/London");
const afterCusp = chart("2009-12-21", "18:30", 51.5, -0.12, "Europe/London");
check("Sun 17:00 UT (before cusp)", beforeCusp.tropical.planets.sun.sign.name, "Sagittarius", 0);
check("Sun 18:30 UT (after cusp)", afterCusp.tropical.planets.sun.sign.name, "Capricorn", 0);

console.log("\n=== 4. Moon sign boundary inside July 2024 ===");
let boundaryFound = false;
for (let d = 1; d <= 28; d++) {
  const day = String(d).padStart(2, "0");
  const c1 = chart(`2024-07-${day}`, "00:30", 0, 0, "UTC");
  const c2 = chart(`2024-07-${day}`, "23:30", 0, 0, "UTC");
  if (c1.tropical.planets.moon.sign.name !== c2.tropical.planets.moon.sign.name) {
    console.log(
      `PASS  Moon changes sign during 2024-07-${day}: ${c1.tropical.planets.moon.sign.name} → ${c2.tropical.planets.moon.sign.name}`
    );
    boundaryFound = true;
    break;
  }
}
if (!boundaryFound) {
  failures += 1;
  console.log("FAIL  No Moon sign boundary found in July 2024 (unexpected)");
}

console.log("\n=== 5. Ascendant advance ===");
const asc1 = chart("1990-08-15", "14:30", 28.6139, 77.209, "Asia/Kolkata");
const asc2 = chart("1990-08-15", "14:40", 28.6139, 77.209, "Asia/Kolkata");
const ascDelta = Math.abs(
  asc2.tropical.angles.ascendant.longitude - asc1.tropical.angles.ascendant.longitude
);
check("Ascendant advances in 10 minutes (~2.5°)", ascDelta, 2.5, 0.4);

console.log("\n=== 6. DST / timezone edges ===");
const gap = chart("2024-03-10", "02:30", 40.7128, -74.006, "America/New_York");
console.log(
  `INFO  Spring-forward gap: nonexistent=${gap.time.nonexistent} utc=${JSON.stringify(gap.time.utc)} abbr=${gap.time.abbreviation}`
);
check("Spring-forward gap does not crash (chart produced)", gap.tropical.planets.sun.sign.name, "Pisces", 0);

const amb = chart("2024-11-03", "01:30", 40.7128, -74.006, "America/New_York");
console.log(`INFO  Fall-back ambiguity: offset=${amb.time.offsetLabel} dst=${amb.time.isDst}`);
check("Fall-back first pass uses EDT (−04:00)", amb.time.offsetLabel, "UTC-04:00", 0);

const tokyoMidnight = chart("1999-12-31", "00:00", 35.6762, 139.6503, "Asia/Tokyo");
check("Tokyo 1999-12-31 00:00 local → 1999-12-30 UTC", tokyoMidnight.time.utc.day, 30, 0);
check("Tokyo midnight UTC hour = 15", tokyoMidnight.time.utc.hour, 15, 0);

const kathmandu = chart("1990-08-15", "14:30", 27.7172, 85.324, "Asia/Kathmandu");
check("Kathmandu offset +05:45", kathmandu.time.offsetMinutes, 345, 0);
const tehran = chart("1990-08-15", "14:30", 35.6892, 51.389, "Asia/Tehran");
check("Tehran offset +03:30 (1990)", tehran.time.offsetMinutes, 210, 0);
const honolulu = chart("1990-08-15", "14:30", 21.3069, -157.8583, "Pacific/Honolulu");
check("Honolulu offset −10:00 (never DST)", honolulu.time.offsetMinutes, -600, 0);

console.log("\n=== 7. Leap years ===");
const leapChart = chart("2000-02-29", "12:00", 0, 0, "UTC");
check("2000-02-29 accepted (leap century)", leapChart.tropical.planets.sun.sign.name, "Pisces", 0);
const leap96 = chart("1996-02-29", "12:00", 0, 0, "UTC");
check("1996-02-29 accepted", leap96.tropical.planets.sun.sign.name, "Pisces", 0);

console.log("\n=== 8. Southern hemisphere / high latitude ===");
const sydney = chart("1990-01-15", "09:00", -33.8688, 151.2093, "Australia/Sydney");
check(
  "Sydney ascendant is finite",
  Number.isFinite(sydney.tropical.angles.ascendant.longitude) ? 1 : 0,
  1,
  0
);
const tromso = chart("1990-06-15", "12:00", 69.6492, 18.9553, "Europe/Oslo");
check(
  "Tromsø (midnight sun) ascendant is finite",
  Number.isFinite(tromso.tropical.angles.ascendant.longitude) ? 1 : 0,
  1,
  0
);

console.log(
  failures === 0 ? "\nACCURACY PROBE OK — all checks passed" : `\n${failures} CHECK(S) FAILED`
);
process.exit(failures === 0 ? 0 : 1);


/* Calculator service smoke test — run: node scripts/calculatorSmoke.js */
const path = require("path");
const svc = require(path.join(__dirname, "..", "services", "astrology", "calculatorService"));

const p1 = {
  date: "1990-08-15",
  time: "14:30",
  latitude: 28.6139,
  longitude: 77.209,
  timeZone: "Asia/Kolkata",
  city: "Delhi",
  country: "India",
};
const p2 = {
  date: "1992-03-02",
  time: "06:15",
  latitude: 40.7128,
  longitude: -74.006,
  utcOffsetMinutes: -300,
  city: "New York",
  country: "USA",
};

const show = (label, result, keys) => {
  console.log(`\n=== ${label} ===`);
  for (const key of keys) {
    console.log(`${key}:`, JSON.stringify(result[key]));
  }
};

const v1 = { ...p1, ayanamsa: "lahiri", houseSystem: "P" };
const v2 = { ...p2, ayanamsa: "lahiri", houseSystem: "P" };

show("NUMEROLOGY", svc.numerology({ fullName: "Rohan Sharma", dateOfBirth: "1990-08-15" }), [
  "lifePath",
  "expression",
  "soulUrge",
]);

show("MOON SIGN", svc.moonSign(v1), ["moon", "zodiac"]);
show("SUN SIGN", svc.sunSign(v1), ["sun"]);
show("RASHI", svc.rashi(v1), ["rashi", "nakshatra", "ayanamsa"]);
show("ASCENDANT", svc.ascendant(v1), ["ascendant", "siderealLagna", "midheaven"]);
show(
  "AYANAMSA",
  svc.ayanamsa({ date: "1990-08-15", time: "14:30", timeZone: "Asia/Kolkata", ayanamsa: "lahiri" }),
  ["selected", "comparison", "explanation"]
);
show("NAKSHATRA", svc.nakshatra(v1), ["nakshatra", "rashi"]);

const love = svc.loveCompatibility({ person1: v1, person2: v2 });
console.log("\n=== LOVE ===");
console.log("score:", JSON.stringify(love.score));
console.log("gunaMilan:", love.gunaMilan.total, "/", love.gunaMilan.max, `(${love.gunaMilan.percentage}%)`);
console.log("strengths:", JSON.stringify(love.strengths, null, 1));
console.log("challenges:", JSON.stringify(love.challenges, null, 1));
console.log("contacts:", love.synastry.contacts.length);

const friend = svc.friendshipCompatibility({ person1: v1, person2: v2 });
console.log("\n=== FRIENDSHIP ===");
console.log("score:", JSON.stringify(friend.score));
console.log("communication:", JSON.stringify(friend.communication));
console.log("strengths:", JSON.stringify(friend.strengths, null, 1));
console.log("differences:", JSON.stringify(friend.differences, null, 1));

/* Boundary probes: midnight + DST + location variation */
console.log("\n=== BOUNDARIES ===");
const midnightNY = svc.ascendant({ ...p2, time: "00:00", date: "1992-03-01" });
console.log("NY midnight asc:", midnightNY.ascendant.sign.name, midnightNY.ascendant.formatted, "utc:", midnightNY.time.utc);
const dstLondon = svc.ascendant({
  date: "1995-07-01",
  time: "13:00",
  latitude: 51.5074,
  longitude: -0.1278,
  timeZone: "Europe/London",
});
console.log("London July (BST) asc:", dstLondon.ascendant.sign.name, dstLondon.ascendant.formatted, "offset:", dstLondon.time.offsetLabel, "dst:", dstLondon.time.isDst);
const tokyo = svc.moonSign({
  date: "2000-01-01",
  time: "00:30",
  latitude: 35.6762,
  longitude: 139.6503,
  timeZone: "Asia/Tokyo",
});
console.log("Tokyo new-year moon:", tokyo.moon.sign.name, tokyo.moon.formatted, "utc:", tokyo.time.utc);
const leap = svc.sunSign({
  date: "2004-02-29",
  time: "23:59",
  latitude: 51.5074,
  longitude: -0.1278,
  timeZone: "Europe/London",
});
console.log("Leap-day sun:", leap.sun.sign.name, leap.sun.formatted);
console.log("\nSMOKE OK");

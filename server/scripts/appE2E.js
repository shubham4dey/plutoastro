/**
 * End-to-end check against the REAL production app (server/app.js),
 * verifying the /api/calculators mount point and every route through
 * the actual Express app, not an ephemeral one.
 */
const http = require("http");

process.env.NODE_ENV = "test";

/* Load the same environment server.js uses */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

let app;
try {
  app = require("../app");
} catch (error) {
  console.error("Could not load server/app.js:", error.message);
  process.exit(1);
}

const server = http.createServer(app);
server.listen(0, "127.0.0.1", async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (url, body) =>
    fetch(`${base}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(async (r) => ({ status: r.status, json: await r.json() }));

  const birth = {
    date: "1990-08-15",
    time: "14:30",
    latitude: 28.6139,
    longitude: 77.209,
    timeZone: "Asia/Kolkata",
    city: "Delhi",
    region: "Delhi",
    country: "India",
    ayanamsa: "lahiri",
  };

  const routes = [
    ["numerology", { fullName: "Rohan Sharma", dateOfBirth: "1990-08-15" }],
    ["moon-sign", birth],
    ["sun-sign", birth],
    ["rashi", birth],
    ["ascendant", birth],
    ["ayanamsa", { date: "1990-08-15", time: "14:30", timeZone: "Asia/Kolkata" }],
    ["nakshatra", birth],
    ["love-compatibility", { person1: birth, person2: { ...birth, city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, timeZone: "Asia/Tokyo" } }],
    ["friendship-compatibility", { person1: birth, person2: { ...birth, city: "London", country: "UK", latitude: 51.5072, longitude: -0.1276, timeZone: "Europe/London" } }],
  ];

  let failed = 0;
  for (const [name, body] of routes) {
    const { status, json } = await post(`/api/calculators/${name}`, body);
    const ok = status === 200 && json.success === true && json.data && json.data.calculator === name;
    if (!ok) failed += 1;
    console.log(`${ok ? "OK  " : "FAIL"} ${String(status).padEnd(4)} /api/calculators/${name}`);
  }

  /* validation guard through the real app */
  const bad = await post("/api/calculators/moon-sign", { date: "1990-08-15", time: "14:30" });
  const guardOk = bad.status === 400;
  console.log(`${guardOk ? "OK  " : "FAIL"} 400 guard /api/calculators/moon-sign (missing location)`);
  if (!guardOk) failed += 1;

  /* Existing (pre-calculator) API endpoints must still respond.
     /api/horoscope is DB-free, so it is a safe regression probe. */
  const existing = await fetch(`${base}/api/horoscope/aries`).then((r) => r.status).catch(() => 0);
  const existingOk = existing === 200;
  if (!existingOk) failed += 1;
  console.log(`${existingOk ? "OK  " : "FAIL"} existing route /api/horoscope/aries (status ${existing})`);

  const missing = await fetch(`${base}/api/definitely-not-a-route`).then((r) => r.status).catch(() => 0);
  const missingOk = missing === 404;
  if (!missingOk) failed += 1;
  console.log(`${missingOk ? "OK  " : "FAIL"} unknown path still 404 (status ${missing})`);

  const geo = await fetch(`${base}/api/calculators/geo/search?q=Paris`).then((r) => r.status).catch(() => 0);
  const geoOk = geo === 200;
  if (!geoOk) failed += 1;
  console.log(`${geoOk ? "OK  " : "FAIL"} GET /api/calculators/geo/search (status ${geo})`);

  server.close();
  console.log(failed === 0 ? "\nAPP E2E OK — all 9 endpoints live in server/app.js" : `\n${failed} CHECK(S) FAILED`);
  process.exit(failed === 0 ? 0 : 1);
});
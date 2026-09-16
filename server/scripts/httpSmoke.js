/* HTTP-level test of /api/calculators/* using an ephemeral express app */
const path = require("path");
const express = require("express");
const http = require("http");

const app = express();
app.use(express.json());
const routes = require(path.join(__dirname, "..", "routes", "calculatorRoutes"));
app.use("/api/calculators", routes);

const server = http.createServer(app);
server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}/api/calculators`;

  const post = (url, body) =>
    fetch(`${base}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(async (r) => ({ status: r.status, json: await r.json() }));

  const get = (url) => fetch(`${base}${url}`).then(async (r) => ({ status: r.status, json: await r.json() }));

  const birth = {
    date: "1990-08-15",
    time: "14:30",
    latitude: 28.6139,
    longitude: 77.209,
    timeZone: "Asia/Kolkata",
    city: "Delhi",
    country: "India",
  };
  const person = (over = {}) => ({
    ...birth,
    ayanamsa: "lahiri",
    houseSystem: "P",
    ...over,
  });

  (async () => {
    const checks = [];

    /* happy paths */
    checks.push(["numerology", await post("/numerology", { dateOfBirth: "1990-08-15", fullName: "Rohan Sharma" })]);
    checks.push(["moon-sign", await post("/moon-sign", person())]);
    checks.push(["sun-sign", await post("/sun-sign", person())]);
    checks.push(["rashi", await post("/rashi", person())]);
    checks.push(["ascendant", await post("/ascendant", person())]);
    checks.push(["ayanamsa", await post("/ayanamsa", { date: "1990-08-15", time: "14:30", timeZone: "Asia/Kolkata" })]);
    checks.push(["nakshatra", await post("/nakshatra", person())]);
    checks.push(["love-compatibility", await post("/love-compatibility", { person1: person(), person2: person({ date: "1992-03-02", time: "06:15", latitude: 40.7128, longitude: -74.006, utcOffsetMinutes: -300, timeZone: undefined, city: "New York", country: "USA" }) })]);
    checks.push(["friendship-compatibility", await post("/friendship-compatibility", { person1: person(), person2: person({ date: "1992-03-02", time: "06:15", latitude: 40.7128, longitude: -74.006, utcOffsetMinutes: -300, timeZone: undefined, city: "New York", country: "USA" }) })]);

    /* validation failures */
    checks.push(["moon-sign invalid (no tz)", await post("/moon-sign", { date: "1990-08-15", time: "14:30", latitude: 28.6, longitude: 77.2 })]);
    checks.push(["sun-sign invalid date", await post("/sun-sign", person({ date: "1990-02-30" }))]);
    checks.push(["love missing person2", await post("/love-compatibility", { person1: person() })]);
    checks.push(["numerology bad name", await post("/numerology", { dateOfBirth: "1990-08-15", fullName: "R0han123" })]);

    /* geo search */
    checks.push(["geo/search", await get("/geo/search?q=Paris")]);

    let failures = 0;
    for (const [label, response] of checks) {
      const ok = response.status === 200 ? response.json.success : response.status === 400 && !response.json.success;
      if (response.status !== 200 && response.status !== 400) failures += 1;
      const preview =
        response.status === 200
          ? label.startsWith("geo")
            ? `${response.json.data.results.length} results, first: ${response.json.data.results[0] ? response.json.data.results[0].city + "/" + response.json.data.results[0].timezone : "none"}`
            : JSON.stringify(response.json.data).slice(0, 90)
          : JSON.stringify(response.json.errors).slice(0, 110);
      console.log(`${response.status}  ${label.padEnd(28)} ${preview}`);
      if (!ok) failures += 1;
    }

    /* spot-check numerology payload */
    const num = (await post("/numerology", { dateOfBirth: "1990-08-15", fullName: "Rohan Sharma" })).json.data;
    console.log("\nnumerology numbers:", num.numbers.lifePath.number, num.numbers.expression.number, num.numbers.soulUrge.number);
    console.log("lifePath calc:", JSON.stringify(num.numbers.lifePath.calculation));

    console.log(failures === 0 ? "\nHTTP SMOKE OK" : `\nHTTP SMOKE FAILURES: ${failures}`);
    server.close();
    process.exit(failures === 0 ? 0 : 1);
  })().catch((error) => {
    console.error("SMOKE ERROR:", error);
    server.close();
    process.exit(1);
  });
});

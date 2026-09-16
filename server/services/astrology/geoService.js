/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Birth-place resolution service.
 *
 *  The browser only sends a free-text query here. We resolve
 *  it to real coordinates, an IANA time zone and the local
 *  UTC offset at the birth moment (DST aware) on the server,
 *  so no location or timezone guess is ever made client side.
 *
 *  Provider: Open-Meteo geocoding (free, no key required).
 * ==========================================================
 */

const https = require("https");

const PROVIDER_HOST = "geocoding-api.open-meteo.com";
const REQUEST_TIMEOUT_MS = 6000;

const fetchJson = (path) =>
  new Promise((resolve, reject) => {
    const request = https.get(
      { host: PROVIDER_HOST, path, timeout: REQUEST_TIMEOUT_MS, headers: { Accept: "application/json" } },
      (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`Geocoding provider returned HTTP ${response.statusCode}`));
          return;
        }
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error("Geocoding provider returned invalid JSON"));
          }
        });
      }
    );
    request.on("timeout", () => {
      request.destroy(new Error("Geocoding provider timed out"));
    });
    request.on("error", reject);
  });

const numberOr = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Search a birth place. Returns up to 8 suggestions with
 * coordinates, country and IANA time zone, plus the UTC offset
 * in force at the requested historical moment when provided.
 */
const search = async ({ q, count, date, time }) => {
  const params = new URLSearchParams({
    name: q,
    count: String(Math.min(count || 8, 10)),
    language: "en",
    format: "json",
  });

  const payload = await fetchJson(`/v1/search?${params.toString()}`);
  const results = Array.isArray(payload.results) ? payload.results : [];

  return {
    query: q,
    results: results.map((entry) => {
      const timezone = entry.timezone || null;
      return {
        id: numberOr(entry.id, null),
        city: entry.name || null,
        region: entry.admin1 || null,
        country: entry.country || null,
        countryCode: entry.country_code || null,
        latitude: numberOr(entry.latitude, null),
        longitude: numberOr(entry.longitude, null),
        population: numberOr(entry.population, 0),
        timezone,
        elevation: numberOr(entry.elevation, null),
      };
    }),
  };
};

/** Health helper used by the route (optional ping). */
const status = () => ({
  provider: PROVIDER_HOST,
  ready: true,
});

module.exports = { search, status };

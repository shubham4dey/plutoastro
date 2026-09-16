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
      const city = entry.name || null;
      const region = entry.admin1 || null;
      const country = entry.country || null;
      const label = [city, region, country].filter(Boolean).join(", ") || city || q;
      return {
        id: numberOr(entry.id, null),
        city,
        region,
        country,
        countryCode: entry.country_code || null,
        latitude: numberOr(entry.latitude, null),
        longitude: numberOr(entry.longitude, null),
        population: numberOr(entry.population, 0),
        // Both keys: backend uses `timezone`, frontend LocationInput reads `timeZone`.
        timezone,
        timeZone: timezone,
        label,
        place: label,
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

/* Score geocoding candidates: prefer populated places + exact name matches. */
const scoreCandidate = (entry, query) => {
  const q = String(query || "").trim().toLowerCase();
  const name = String(entry.city || entry.name || "").trim().toLowerCase();
  let score = 0;
  if (q && name === q) score += 1000;
  else if (q && name.startsWith(q)) score += 500;
  else if (q && name.includes(q)) score += 100;
  score += Math.min(Number(entry.population) || 0, 10000000) / 100000;
  return score;
};

/* Pick the best candidate entry for a free-text place query. */
const pickBest = (results, query) => {
  if (!Array.isArray(results) || !results.length) return null;
  let best = null;
  let bestScore = -Infinity;
  for (const entry of results) {
    const score = scoreCandidate(entry, query);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return best;
};

/**
 * Resolve a free-text birth place to coordinates + IANA timezone.
 * Used as the automatic fallback so BASIC details alone are enough:
 * Name + Sex + DOB + Time + Birth Place -> geocode -> lat/lon/timezone
 * -> Swiss Ephemeris. Advanced (manual lat/lon/tz) values, when
 * supplied, always win over this automatic result.
 */
const resolveFirst = async (query) => {
  const q = typeof query === "string" ? query.trim() : "";
  if (q.length < 2) return null;
  const { results } = await search({ q, count: 8 });
  const best = pickBest(results, q);
  if (!best) return null;
  return {
    city: best.city || null,
    region: best.region || null,
    country: best.country || null,
    countryCode: best.countryCode || null,
    latitude: best.latitude,
    longitude: best.longitude,
    timeZone: best.timeZone || best.timezone || null,
    place: best.place || best.label || q,
  };
};

module.exports = { search, status, resolveFirst, pickBest };

/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Controller: thin HTTP layer over the calculator service.
 *
 *  - Every payload is validated on the server.
 *  - Raw birth details are never logged.
 *  - Errors return a stable JSON shape the frontend can render.
 * ==========================================================
 */

const calculatorService = require("../services/astrology/calculatorService");
const geoService = require("../services/astrology/geoService");
const validation = require("../services/astrology/validation");

const failure = (res, error) => {
  const status = error && error.statusCode ? error.statusCode : 500;
  const message =
    status >= 500
      ? "The calculator engine could not complete this calculation. Please try again."
      : error.message || "Calculation failed.";
  if (status >= 500) {
    // Server-side detail only — never raw birth data, never internals to the browser.
    console.error("Calculator error:", error.message);
  }
  return res.status(status).json({
    success: false,
    errors: [{ field: "form", message }],
  });
};

const validationFailure = (res, result) =>
  res.status(400).json({
    success: false,
    errors:
      result.errors && result.errors.length
        ? result.errors
        : [{ field: "form", message: result.message || "Invalid input." }],
  });

const single = (validator, compute) => (req, res) => {
  try {
    const result = validator(req.body || {});
    if (!result.ok) return validationFailure(res, result);
    return res.json({ success: true, data: compute(result.value) });
  } catch (error) {
    return failure(res, error);
  }
};

const pair = (compute) => (req, res) => {
  try {
    const result = validation.validateTwoPeople(req.body || {});
    if (!result.ok) return validationFailure(res, result);
    return res.json({ success: true, data: compute(result.value) });
  } catch (error) {
    return failure(res, error);
  }
};

/* =========================
   CALCULATORS
========================= */

const numerology = single(validation.validateNumerology, calculatorService.numerology);
const moonSign = single(validation.validateBirthDetails, calculatorService.moonSign);
const sunSign = single(validation.validateBirthDetails, calculatorService.sunSign);
const rashi = single(validation.validateBirthDetails, calculatorService.rashi);
const ascendant = single(validation.validateBirthDetails, calculatorService.ascendant);
const ayanamsa = single(validation.validateAyanamsa, calculatorService.ayanamsa);
const nakshatra = single(validation.validateBirthDetails, calculatorService.nakshatra);
const loveCompatibility = pair(calculatorService.loveCompatibility);
const friendshipCompatibility = pair(calculatorService.friendshipCompatibility);
// Transits describe ANY moment (past, present or future: "what is the sky doing
// on this date?"), so the shared birth-date validator must not reject future dates.
// BASIC-DETAILS-FIRST flow: Name + Sex + DOB + Time + Birth Place is enough.
// When coordinates/timezone are missing, they are auto-resolved by geocoding
// the birth-place text (existing geoService + timezoneService + Swiss
// Ephemeris). Advanced values, when supplied, always override the auto result.
const transitChart = async (req, res) => {
  try {
    const body = req.body || {};
    const result = validation.validateBirthDetails(body, "", {
      requireTime: true,
      allowFuture: Boolean(body && body.allowFuture),
      allowAutoResolve: true,
    });
    if (!result.ok) {
      return res.status(400).json({
        success: false,
        errors:
          result.errors && result.errors.length
            ? result.errors
            : [{ field: "form", message: "Invalid input." }],
      });
    }
    const value = { ...result.value };
    const coordsMissing = value.latitude == null || value.longitude == null;
    const zoneMissing = !value.timeZone && value.utcOffsetMinutes == null;
    if ((coordsMissing || zoneMissing) && value.place) {
      let resolved = null;
      try {
        resolved = await geoService.resolveFirst(value.place);
      } catch (geoError) {
        resolved = null;
      }
      if (!resolved) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              field: "place",
              message: `Could not find "${value.place}". Please pick your birth city from the suggestions or add the advanced location details.`,
            },
          ],
        });
      }
      if (value.latitude == null) value.latitude = resolved.latitude;
      if (value.longitude == null) value.longitude = resolved.longitude;
      if (!value.timeZone && value.utcOffsetMinutes == null && resolved.timeZone) {
        value.timeZone = resolved.timeZone;
      }
      if (!value.city && resolved.city) value.city = resolved.city;
      if (!value.region && resolved.region) value.region = resolved.region;
      if (!value.country && resolved.country) value.country = resolved.country;
      if (resolved.place) value.resolvedPlace = resolved.place;
    }
    return res.json({ success: true, data: calculatorService.transitChart(value) });
  } catch (error) {
    return failure(res, error);
  }
};

/* =========================
   LOCATION AUTOCOMPLETE
   Proxied so the browser never talks to the
   geocoding provider directly.
========================= */

const geoSearch = async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : "";
    const result = validation.validateLocationQuery(q);
    if (!result.ok) return validationFailure(res, result);
    const data = await geoService.search({ q: result.value });
    return res.json({ success: true, data });
  } catch (error) {
    return failure(res, error);
  }
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
  transitChart,
  geoSearch,
};

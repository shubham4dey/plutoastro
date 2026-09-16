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
  geoSearch,
};

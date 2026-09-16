/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Routes: POST /api/calculators/*
 * ==========================================================
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/calculatorController");

/* Location autocomplete (proxied to the geocoding provider) */
router.get("/geo/search", controller.geoSearch);

/* Single-person calculators */
router.post("/numerology", controller.numerology);
router.post("/moon-sign", controller.moonSign);
router.post("/sun-sign", controller.sunSign);
router.post("/rashi", controller.rashi);
router.post("/ascendant", controller.ascendant);
router.post("/ayanamsa", controller.ayanamsa);
router.post("/nakshatra", controller.nakshatra);

/* Two-person calculators */
router.post("/love-compatibility", controller.loveCompatibility);
router.post("/friendship-compatibility", controller.friendshipCompatibility);

module.exports = router;

/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Astrology math helpers (shared by every calculator)
 * ==========================================================
 */

/* Normalise any angle into 0 <= x < 360 */
const norm360 = (deg) => {
  const v = Number(deg) % 360;
  return v < 0 ? v + 360 : v;
};

/* Shortest signed difference a - b in (-180, 180] */
const angleDiff = (a, b) => {
  let d = norm360(a - b);
  if (d > 180) d -= 360;
  return d;
};

/* Forward (zodiacal) distance from a to b in [0, 360) */
const forwardDistance = (from, to) => norm360(to - from);

/* Convert decimal degrees to {deg, min, sec} */
const toDms = (deg) => {
  const value = Math.abs(deg);
  let d = Math.floor(value);
  let mFloat = (value - d) * 60;
  let m = Math.floor(mFloat);
  let s = Math.round((mFloat - m) * 60);
  if (s === 60) {
    s = 0;
    m += 1;
  }
  if (m === 60) {
    m = 0;
    d += 1;
  }
  return { degrees: d, minutes: m, seconds: s, negative: deg < 0 };
};

/* Human readable d°m's" (always positive, use the sign separately) */
const formatDms = (deg) => {
  const { degrees, minutes, seconds } = toDms(deg);
  return `${degrees}° ${String(minutes).padStart(2, "0")}' ${String(seconds).padStart(2, "0")}"`;
};

/* Round to n decimals as a Number (keeps JSON payload clean) */
const round = (value, decimals = 4) => {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
};

/* Divide a 30° sign span into equal parts and return the 1-based part */
const partWithin = (positionInSign, spanDegrees) => {
  const idx = Math.floor(positionInSign / spanDegrees) + 1;
  return Math.min(4, Math.max(1, idx));
};

/* Aspect between two longitudes using a configurable orb table */
const findAspect = (lon1, lon2, aspectTable, maxOrb) => {
  const sep = Math.abs(angleDiff(lon1, lon2));
  let best = null;
  for (const aspect of aspectTable) {
    const orb = Math.abs(sep - aspect.exact);
    if (orb <= (aspect.orb || maxOrb) && (!best || orb < best.orb)) {
      best = { ...aspect, orb, separation: sep };
    }
  }
  return best;
};

module.exports = {
  norm360,
  angleDiff,
  forwardDistance,
  toDms,
  formatDms,
  round,
  partWithin,
  findAspect,
};
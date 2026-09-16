/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Calculation engine (Swiss Ephemeris)
 *
 *  ONE authoritative engine for every calculator.
 *  Nothing else in the codebase is allowed to compute
 *  planetary positions or house cusps.
 *
 *  Library : sweph (Swiss Ephemeris, N-API prebuilds)
 *  Data    : bundled Moshier ephemeris by default (no data
 *            files needed); if `server/ephe` contains Swiss
 *            Ephemeris data files they are used automatically.
 *
 *  All functions are synchronous on purpose: the engine keeps
 *  the sidereal mode as global state, so the mode + the
 *  calculations must run inside one synchronous block.
 * ==========================================================
 */

const fs = require("fs");
const path = require("path");

let sweph = null;
let loadError = null;
const engineInfo = {
  ready: false,
  library: "sweph",
  ephemeris: "unknown",
  precisionNote: "",
  ephePath: "",
  warned: false,
};

/* Physical bodies used by the calculators (sweph ids) */
const BODIES = {
  sun: "SE_SUN",
  moon: "SE_MOON",
  mercury: "SE_MERCURY",
  venus: "SE_VENUS",
  mars: "SE_MARS",
  jupiter: "SE_JUPITER",
  saturn: "SE_SATURN",
  uranus: "SE_URANUS",
  neptune: "SE_NEPTUNE",
  pluto: "SE_PLUTO",
  meannode: "SE_MEAN_NODE",
  truenode: "SE_TRUE_NODE",
};

const AYANAMSA_SYSTEMS = {
  lahiri: {
    id: "lahiri",
    name: "Lahiri (Chitrapaksha)",
    swephConstant: "SE_SIDM_LAHIRI",
    description:
      "Official Government of India (Calendar Reform Committee) ayanamsa, referenced to the star Chitra (Spica). This is the standard sidereal zero point used by Indian ephemerides.",
    usedFor: "Rashi, Nakshatra and every Vedic (sidereal) calculation on PlutoAstro",
  },
  raman: {
    id: "raman",
    name: "Raman",
    swephConstant: "SE_SIDM_RAMAN",
    description:
      "Ayanamsa defined by Dr. B. V. Raman — same Chitra reference as Lahiri with a slightly different epoch value.",
    usedFor: "Alternative sidereal option",
  },
  krishnamurti: {
    id: "krishnamurti",
    name: "KP (Krishnamurti)",
    swephConstant: "SE_SIDM_KRISHNAMURTI",
    description:
      "Ayanamsa used by the Krishnamurti Paddhati (KP) system.",
    usedFor: "KP system charts and Krishnamurti Paddhati analysis",
  },
  fagan_bradley: {
    id: "fagan_bradley",
    name: "Fagan/Bradley",
    swephConstant: "SE_SIDM_FAGAN_BRADLEY",
    description:
      "Ayanamsa of the Western sidereal tradition with the zero point fixed at Aldebaran in 221 AD.",
    usedFor: "Western sidereal astrology",
  },
  yukteshwar: {
    id: "yukteshwar",
    name: "Yukteshwar",
    swephConstant: "SE_SIDM_YUKTESHWAR",
    description:
      "Ayanamsa defined by Sri Yukteswar Giri in 'The Holy Science' (1894), based on a 24,000 year equinoctial cycle.",
    usedFor: "Alternative sidereal option",
  },
  true_citra: {
    id: "true_citra",
    name: "True Chitra (Spica)",
    swephConstant: "SE_SIDM_TRUE_CITRA",
    description:
      "Dynamic ayanamsa which holds the star Chitra (Spica) exactly at 180° of sidereal longitude for the date of the chart.",
    usedFor: "Chitrapaksha purists who fix Spica at 180° on every date",
  },
  true_revati: {
    id: "true_revati",
    name: "True Revati",
    swephConstant: "SE_SIDM_TRUE_REVATI",
    description:
      "Dynamic ayanamsa which holds the star Revati (zeta Piscium) exactly at 359°59'59\" of sidereal longitude.",
    usedFor: "Revati-paksha sidereal option",
  },
  true_pushya: {
    id: "true_pushya",
    name: "True Pushya (PVRN Rao)",
    swephConstant: "SE_SIDM_TRUE_PUSHYA",
    description:
      "Dynamic ayanamsa which holds the star Pushya (gamma Cancri) exactly at 106° of sidereal longitude.",
    usedFor: "Pushya-paksha sidereal option",
  },
  lahiri_icrc: {
    id: "lahiri_icrc",
    name: "Lahiri (ICRC)",
    swephConstant: "SE_SIDM_LAHIRI_ICRC",
    description:
      "Lahiri ayanamsa as published by the Indian Calendar Reform Committee in 1956. Differs from standard Lahiri by about 1.1 arcseconds.",
    usedFor: "Comparison with the official ICRC publication",
  },
  j2000: {
    id: "j2000",
    name: "J2000",
    swephConstant: "SE_SIDM_J2000",
    description:
      "Sidereal zero point fixed at the J2000.0 equinox.",
    usedFor: "Technical and research calculations",
  },
};

const DEFAULT_AYANAMSA = "lahiri";

/* House systems users may select (Swiss Ephemeris codes) */
const HOUSE_SYSTEMS = {
  W: { code: "W", name: "Whole Sign", description: "Classical Vedic bhava — one whole sign per house" },
  P: { code: "P", name: "Placidus", description: "Most common modern quadrant system" },
  A: { code: "A", name: "Equal (Ascendant)", description: "Equal 30° houses counted from the Ascendant" },
  O: { code: "O", name: "Porphyry", description: "Classical quadrant system" },
  R: { code: "R", name: "Regiomontanus", description: "Classical quadrant system" },
  C: { code: "C", name: "Campanus", description: "Classical quadrant system" },
};

const DEFAULT_HOUSE_SYSTEM = "P";

/* =========================
   INITIALISATION
========================= */

const baseFlags = () => {
  const isSwiss = engineInfo.ephemeris === "swiss-ephemeris";
  return (
    (isSwiss ? sweph.constants.SEFLG_SWIEPH : sweph.constants.SEFLG_MOSEPH) |
    sweph.constants.SEFLG_SPEED
  );
};

const resolveEphePath = () =>
  process.env.SWEPH_EPHE_PATH
    ? path.resolve(process.env.SWEPH_EPHE_PATH)
    : path.join(__dirname, "..", "..", "ephe");

const countEphemerisFiles = (dir) => {
  try {
    return fs.readdirSync(dir).filter((file) => /\.se1$/i.test(file)).length;
  } catch (error) {
    return 0;
  }
};

const initialise = () => {
  if (sweph || loadError) return;
  try {
    // eslint-disable-next-line global-require
    sweph = require("sweph");

    const ephePath = resolveEphePath();
    if (!fs.existsSync(ephePath)) {
      fs.mkdirSync(ephePath, { recursive: true });
    }
    sweph.set_ephe_path(ephePath);

    const fileCount = countEphemerisFiles(ephePath);
    engineInfo.ephePath = ephePath;
    engineInfo.ephemeris = fileCount > 0 ? "swiss-ephemeris" : "moshier";
    engineInfo.precisionNote =
      fileCount > 0
        ? `${fileCount} Swiss Ephemeris data file(s) detected — full Swiss Ephemeris precision in use.`
        : "Bundled Moshier ephemeris in use (no data files required). Accuracy is better than about one arcsecond for the Sun and the Moon — thousands of times finer than the 30° sign and 3°20' pada boundaries.";

    // Self test — never answer requests with a broken engine.
    const jd = sweph.julday(2000, 1, 1, 12, sweph.constants.SE_GREG_CAL);
    const probe = sweph.calc_ut(jd, sweph.constants.SE_SUN, baseFlags());
    if (!probe || !Array.isArray(probe.data) || !Number.isFinite(probe.data[0])) {
      throw new Error("engine self-test failed (no Sun longitude for J2000)");
    }

    engineInfo.ready = true;
    console.log(
      `✅ Calculator engine ready — ${engineInfo.ephemeris} (${ephePath})`
    );
  } catch (error) {
    loadError = error;
    engineInfo.ready = false;
    console.error("❌ Calculator engine unavailable:", error.message);
  }
};

const ensureReady = () => {
  initialise();
  if (!engineInfo.ready) {
    const error = new Error(
      "Astrology calculation engine is unavailable on the server. Please try again in a moment."
    );
    error.statusCode = 503;
    error.code = "ENGINE_UNAVAILABLE";
    throw error;
  }
  return sweph;
};

/* sweph returns { flag, error, data } objects */
const unwrap = (result, label) => {
  if (!result) {
    throw new Error(`Swiss Ephemeris returned no result for ${label}`);
  }
  if (result.error && (result.data === undefined || result.data === null)) {
    throw new Error(`Swiss Ephemeris error for ${label}: ${result.error}`);
  }
  if (result.error && String(result.error).trim() && !engineInfo.warned) {
    // Informational notices (e.g. an optional data file is missing) do not
    // invalidate the result — they are surfaced once in the server log.
    engineInfo.warned = true;
    console.warn("⚠️ Calculator engine notice:", String(result.error).trim());
  }
  return result.data;
};

/* =========================
   TIME / JULIAN DAY
========================= */

/**
 * Julian Day for a UTC calendar moment.
 * @param {{year:number, month:number, day:number, hour?:number, minute?:number, second?:number}} utc
 */
const julianDayUT = (utc) => {
  const api = ensureReady();
  const hour = (utc.hour || 0) + (utc.minute || 0) / 60 + (utc.second || 0) / 3600;
  return api.julday(utc.year, utc.month, utc.day, hour, api.constants.SE_GREG_CAL);
};

/* =========================
   SIDEREAL MODE
========================= */

const resolveAyanamsaId = (id) => {
  const key = id ? String(id).toLowerCase() : DEFAULT_AYANAMSA;
  return AYANAMSA_SYSTEMS[key] ? key : DEFAULT_AYANAMSA;
};

const setSiderealMode = (ayanamsaId) => {
  const api = ensureReady();
  const key = resolveAyanamsaId(ayanamsaId);
  const constant = api.constants[AYANAMSA_SYSTEMS[key].swephConstant];
  if (constant === undefined) {
    throw new Error(`Ayanamsa system '${key}' is not supported by the engine`);
  }
  api.set_sid_mode(constant, 0, 0);
  return key;
};

/* =========================
   PLANETARY POSITIONS
========================= */

const bodyId = (api, body) => {
  const constant = BODIES[String(body).toLowerCase()];
  if (!constant) throw new Error(`Unknown celestial body: ${body}`);
  const value = api.constants[constant];
  if (value === undefined) {
    throw new Error(`Celestial body '${body}' missing from engine`);
  }
  return value;
};

/**
 * Position of one celestial body.
 * @param {number} jdUT julian day in Universal Time
 * @param {string} body key of BODIES (sun, moon, ...)
 * @param {{sidereal?:boolean, ayanamsa?:string}} options
 */
const bodyPosition = (jdUT, body, options = {}) => {
  const api = ensureReady();
  const { sidereal = false, ayanamsa = DEFAULT_AYANAMSA } = options;
  let flags = baseFlags();
  if (sidereal) {
    setSiderealMode(ayanamsa);
    flags |= api.constants.SEFLG_SIDEREAL;
  }
  const data = unwrap(api.calc_ut(jdUT, bodyId(api, body), flags), body);
  return {
    longitude: data[0],
    latitude: data[1],
    distance: data[2],
    speed: data[3],
  };
};

/** Positions of several bodies in one synchronous batch */
const positions = (jdUT, bodies, options = {}) => {
  ensureReady();
  const result = {};
  for (const body of bodies) {
    result[String(body).toLowerCase()] = bodyPosition(jdUT, body, options);
  }
  return result;
};

/* =========================
   AYANAMSA OF DATE
========================= */

/**
 * Ayanamsa of a date — exactly the value the engine subtracts when it
 * builds sidereal longitudes for that moment.
 */
const ayanamsaForDate = (jdUT, ayanamsaId) => {
  const api = ensureReady();
  const key = setSiderealMode(ayanamsaId);
  const data = unwrap(api.get_ayanamsa_ex_ut(jdUT, baseFlags()), "ayanamsa");
  const value = typeof data === "number" ? data : data && data[0];
  if (!Number.isFinite(value)) {
    throw new Error("Could not compute the ayanamsa value");
  }
  return { ayanamsa: value, system: AYANAMSA_SYSTEMS[key], key };
};

/* =========================
   HOUSES / ANGLES
========================= */

/**
 * House cusps and angles (Ascendant, MC) for a birth moment.
 * @param {number} jdUT
 * @param {number} latitude degrees (+ north)
 * @param {number} longitude degrees (+ east)
 * @param {{houseSystem?:string, sidereal?:boolean, ayanamsa?:string}} options
 */
const houses = (jdUT, latitude, longitude, options = {}) => {
  const api = ensureReady();
  const {
    houseSystem = DEFAULT_HOUSE_SYSTEM,
    sidereal = false,
    ayanamsa = DEFAULT_AYANAMSA,
  } = options;
  const code = HOUSE_SYSTEMS[houseSystem] ? houseSystem : DEFAULT_HOUSE_SYSTEM;
  let flags = baseFlags();
  if (sidereal) {
    setSiderealMode(ayanamsa);
    flags |= api.constants.SEFLG_SIDEREAL;
  }
  const data = unwrap(
    api.houses_ex(jdUT, flags, latitude, longitude, code),
    "houses"
  );
  const points = data.points || data.ascmc || [];
  return {
    system: HOUSE_SYSTEMS[code],
    cusps: data.houses,
    ascendant: points[0],
    mc: points[1],
    armc: points[2],
    vertex: points[3],
  };
};

/* =========================
   TIME HELPERS
========================= */

/** Seconds of universal time -> { hour, minute, second } */
const secondsOfDayToTime = (seconds) => {
  const wrapped = ((seconds % 86400) + 86400) % 86400;
  return {
    hour: Math.floor(wrapped / 3600),
    minute: Math.floor((wrapped % 3600) / 60),
    second: Math.floor(wrapped % 60),
  };
};

module.exports = {
  BODIES,
  AYANAMSA_SYSTEMS,
  DEFAULT_AYANAMSA,
  HOUSE_SYSTEMS,
  DEFAULT_HOUSE_SYSTEM,
  initialise,
  ensureReady,
  getStatus: () => ({ ...engineInfo }),
  julianDayUT,
  bodyPosition,
  positions,
  ayanamsaForDate,
  houses,
  resolveAyanamsaId,
  secondsOfDayToTime,
};

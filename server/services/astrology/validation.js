/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Shared request validation (one validator for every route)
 *
 *  The frontend validates too, but the backend never trusts it:
 *  every value that reaches the calculation engine passes
 *  through here first.
 * ==========================================================
 */

const engine = require("./engine");
const timezoneService = require("./timezoneService");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{1,2}:\d{2}(:\d{2})?$/;
const NAME_PATTERN = /^[\p{L}\p{M} .'\-]{1,80}$/u;
const MIN_YEAR = 1200;

const pushError = (errors, field, message) => {
  errors.push({ field, message });
};

const isRealDate = (year, month, day) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

/**
 * Validate one person's birth details.
 * @param {object} body
 * @param {string} prefix field prefix used in error messages (e.g. "person1")
 * @param {{requireTime?:boolean, requireName?:boolean}} options
 */
const validateBirthDetails = (body, prefix = "", options = {}) => {
  const { requireTime = true, requireName = false, allowFuture = false, allowAutoResolve = false } = options;
  const errors = [];
  const value = {};
  const label = prefix ? `${prefix}.` : "";
  const source = body && typeof body === "object" ? body : {};

  /* ---- name (optional except for numerology) ---- */
  const name = typeof source.name === "string" ? source.name.trim() : "";
  if (requireName && !name) {
    pushError(errors, `${label}name`, "Please enter your full name.");
  } else if (name && !NAME_PATTERN.test(name)) {
    pushError(
      errors,
      `${label}name`,
      "Name may contain letters, spaces, apostrophes, dots and hyphens only (max 80 characters)."
    );
  } else {
    value.name = name || null;
  }

  /* ---- date of birth ---- */
  const date = typeof source.date === "string" ? source.date.trim() : "";
  if (!date) {
    pushError(errors, `${label}date`, "Date of birth is required.");
  } else if (!DATE_PATTERN.test(date)) {
    pushError(errors, `${label}date`, "Date of birth must be in YYYY-MM-DD format.");
  } else {
    const [year, month, day] = date.split("-").map(Number);
    const now = new Date();
    if (year < MIN_YEAR) {
      pushError(
        errors,
        `${label}date`,
        `Please use a year between ${MIN_YEAR} and ${now.getUTCFullYear()}.`
      );
    } else if (!isRealDate(year, month, day)) {
      pushError(errors, `${label}date`, "That calendar date does not exist. Please check the date.");
    } else if (
      !allowFuture &&
      Date.UTC(year, month - 1, day) >
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    ) {
      pushError(errors, `${label}date`, "Date of birth cannot be in the future.");
    } else {
      value.date = date;
    }
  }

  /* ---- time of birth ---- */
  const rawTime = typeof source.time === "string" ? source.time.trim() : "";
  if (!rawTime && requireTime) {
    pushError(errors, `${label}time`, "Exact time of birth is required for this calculator.");
  } else if (rawTime && !TIME_PATTERN.test(rawTime)) {
    pushError(errors, `${label}time`, "Time of birth must be in HH:MM (24 hour) format.");
  } else if (rawTime) {
    const [hour, minute, second = 0] = rawTime.split(":").map(Number);
    if (hour > 23 || minute > 59 || second > 59) {
      pushError(errors, `${label}time`, "Time of birth must be a valid 24 hour time.");
    } else {
      value.time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(
        second
      ).padStart(2, "0")}`;
    }
  } else {
    value.time = "12:00:00";
  }

  /* ---- birth place (basic detail: free text is enough) ----
   * BASIC details flow: Name + Sex + DOB + Time + Birth Place must be
   * enough. The backend auto-resolves coordinates/timezone (see
   * transitChart fallback), so a plain typed place string is valid here.
   * Advanced manual lat/lon/timezone values are OPTIONAL overrides. */
  const city = typeof source.city === "string" ? source.city.trim().slice(0, 120) : "";
  const region = typeof source.region === "string" ? source.region.trim().slice(0, 120) : "";
  const country = typeof source.country === "string" ? source.country.trim().slice(0, 120) : "";
  const freePlace = typeof source.place === "string" ? source.place.trim().slice(0, 200) : "";
  value.city = city || null;
  value.region = region || null;
  value.country = country || null;
  value.place = [city, region, country].filter(Boolean).join(", ") || freePlace || null;

  const hasPlaceText = Boolean(value.place);

  /* ---- coordinates (OPTIONAL override; auto-resolved when missing) ----
   * When the caller passes allowAutoResolve (transit flow), missing or
   * invalid coordinates do NOT fail validation: the controller geocodes
   * the birth-place text instead. Explicit values are range-checked. */
  const rawLat = source.latitude;
  const rawLon = source.longitude;
  const latMissing = rawLat === undefined || rawLat === null || rawLat === "";
  const lonMissing = rawLon === undefined || rawLon === null || rawLon === "";
  const latitude = Number(rawLat);
  const longitude = Number(rawLon);
  const latOk = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
  const lonOk = Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
  if (latOk) {
    value.latitude = latitude;
  } else if (!latMissing || !options.allowAutoResolve || !hasPlaceText) {
    pushError(
      errors,
      `${label}latitude`,
      "Birth latitude is missing or invalid. Search for your birth city or enter a latitude between -90 and 90."
    );
  } else {
    value.latitude = null;
  }
  if (lonOk) {
    value.longitude = longitude;
  } else if (!lonMissing || !options.allowAutoResolve || !hasPlaceText) {
    pushError(
      errors,
      `${label}longitude`,
      "Birth longitude is missing or invalid. Search for your birth city or enter a longitude between -180 and 180."
    );
  } else {
    value.longitude = null;
  }

  /* ---- time zone / UTC offset (OPTIONAL; auto-resolved when missing) ---- */
  const rawOffset = source.utcOffsetMinutes;
  const hasOffset =
    rawOffset !== undefined &&
    rawOffset !== null &&
    rawOffset !== "" &&
    Number.isFinite(Number(rawOffset));
  const timeZone = typeof source.timeZone === "string" ? source.timeZone.trim() : "";

  if (hasOffset) {
    const offset = Number(rawOffset);
    if (offset < -720 || offset > 840) {
      pushError(errors, `${label}utcOffsetMinutes`, "UTC offset must be between -720 and +840 minutes.");
    } else {
      value.utcOffsetMinutes = offset;
      value.timeZone = timezoneService.isValidTimeZone(timeZone) ? timeZone : null;
    }
  } else if (!timeZone) {
    // Transit/basic flow: a free-text place is enough — the controller
    // auto-resolves the IANA zone from the geocoded birth place.
    if (options.allowAutoResolve && hasPlaceText) {
      value.timeZone = null;
      value.utcOffsetMinutes = null;
    } else {
      pushError(
        errors,
        `${label}timeZone`,
        "The time zone of the birth place is required. Select your birth city from the suggestions, or set the UTC offset manually."
      );
    }
  } else if (!timezoneService.isValidTimeZone(timeZone)) {
    pushError(errors, `${label}timeZone`, `'${timeZone}' is not a recognised IANA time zone.`);
  } else {
    value.timeZone = timeZone;
    value.utcOffsetMinutes = null;
  }

  /* ---- engine options (all OPTIONAL; engine defaults apply) ---- */
  const ayanamsa = typeof source.ayanamsa === "string" ? source.ayanamsa.trim().toLowerCase() : "";
  if (ayanamsa && !engine.AYANAMSA_SYSTEMS[ayanamsa]) {
    pushError(
      errors,
      `${label}ayanamsa`,
      `Unknown ayanamsa '${ayanamsa}'. Supported: ${Object.keys(engine.AYANAMSA_SYSTEMS).join(", ")}.`
    );
  } else {
    value.ayanamsa = ayanamsa || engine.DEFAULT_AYANAMSA;
  }

  const houseSystem =
    typeof source.houseSystem === "string" ? source.houseSystem.trim().toUpperCase() : "";
  if (houseSystem && !engine.HOUSE_SYSTEMS[houseSystem]) {
    pushError(
      errors,
      `${label}houseSystem`,
      `Unknown house system '${houseSystem}'. Supported: ${Object.keys(engine.HOUSE_SYSTEMS).join(", ")}.`
    );
  } else {
    value.houseSystem = houseSystem || engine.DEFAULT_HOUSE_SYSTEM;
  }

  /* ---- optional transit extras (DST correction, chart style, KP horary) ----
   * Stored/forwarded only; never required.	dstCorrection: "auto" (default)
   * uses real historical DST rules from timezoneService; a numeric minute
   * value applies a manual override on top of the resolved offset. */
  const dstRaw = source.dstCorrection;
  if (dstRaw === undefined || dstRaw === null || dstRaw === "") {
    value.dstCorrection = null;
  } else if (typeof dstRaw === "string" && dstRaw.trim().toLowerCase() === "auto") {
    value.dstCorrection = "auto";
  } else if (Number.isFinite(Number(dstRaw)) && Number(dstRaw) >= -180 && Number(dstRaw) <= 180) {
    value.dstCorrection = Number(dstRaw);
  } else {
    pushError(errors, `${label}dstCorrection`, "DST correction must be 'auto' or between -180 and +180 minutes.");
  }
  const chartStyle = typeof source.chartStyle === "string" ? source.chartStyle.trim().slice(0, 40) : "";
  value.chartStyle = chartStyle || null;
  const horaryRaw = source.kpHoraryNumber;
  if (horaryRaw === undefined || horaryRaw === null || horaryRaw === "") {
    value.kpHoraryNumber = null;
  } else if (Number.isInteger(Number(horaryRaw)) && Number(horaryRaw) >= 1 && Number(horaryRaw) <= 249) {
    value.kpHoraryNumber = Number(horaryRaw);
  } else {
    pushError(errors, `${label}kpHoraryNumber`, "KP horary number must be an integer between 1 and 249.");
  }
  const sexRaw = typeof source.sex === "string" ? source.sex.trim().toLowerCase()
    : typeof source.gender === "string" ? source.gender.trim().toLowerCase() : "";
  value.sex = ["male", "female", "other"].includes(sexRaw) ? sexRaw : null;
  if (sexRaw) value.gender = value.sex;

  return { ok: errors.length === 0, errors, value };
};

/** Validate a two person payload for the compatibility calculators */
const validateTwoPeople = (body, options = {}) => {
  const errors = [];
  const source = body && typeof body === "object" ? body : {};

  const person1 = validateBirthDetails(source.person1, "person1", options);
  const person2 = validateBirthDetails(source.person2, "person2", options);
  errors.push(...person1.errors, ...person2.errors);

  const readGender = (person) => {
    const raw = person && typeof person.gender === "string" ? person.gender.toLowerCase() : "";
    return ["male", "female", "other"].includes(raw) ? raw : null;
  };

  return {
    ok: errors.length === 0,
    errors,
    value: {
      person1: { ...person1.value, gender: readGender(source.person1) },
      person2: { ...person2.value, gender: readGender(source.person2) },
    },
  };
};

/** Validate the numerology payload */
const validateNumerology = (body) => {
  const errors = [];
  const source = body && typeof body === "object" ? body : {};
  const fullName = typeof source.fullName === "string" ? source.fullName.trim() : "";
  const dateOfBirth = typeof source.dateOfBirth === "string" ? source.dateOfBirth.trim() : "";

  if (!dateOfBirth) {
    pushError(errors, "dateOfBirth", "Date of birth is required to calculate your life path number.");
  } else if (!DATE_PATTERN.test(dateOfBirth)) {
    pushError(errors, "dateOfBirth", "Date of birth must be in YYYY-MM-DD format.");
  } else {
    const [year, month, day] = dateOfBirth.split("-").map(Number);
    const now = new Date();
    if (year < MIN_YEAR || year > now.getUTCFullYear() || !isRealDate(year, month, day)) {
      pushError(errors, "dateOfBirth", "Please enter a valid date of birth between 1200 and today.");
    } else if (
      Date.UTC(year, month - 1, day) >
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    ) {
      pushError(errors, "dateOfBirth", "Date of birth cannot be in the future.");
    }
  }

  if (fullName && !NAME_PATTERN.test(fullName)) {
    pushError(
      errors,
      "fullName",
      "Name may contain letters, spaces, apostrophes, dots and hyphens only (max 80 characters)."
    );
  }

  const system = typeof source.system === "string" ? source.system.toLowerCase() : "pythagorean";
  if (!["pythagorean", "chaldean"].includes(system)) {
    pushError(errors, "system", "Numerology system must be either 'pythagorean' or 'chaldean'.");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { fullName: fullName || null, dateOfBirth, system },
  };
};

/** Validate the location search query */
const validateLocationQuery = (query) => {
  const q = typeof query === "string" ? query.trim() : "";
  if (q.length < 2) {
    return { ok: false, message: "Type at least 2 characters to search for a city." };
  }
  if (q.length > 80) {
    return { ok: false, message: "Search text is too long." };
  }
  return { ok: true, value: q };
};

/**
 * Validate the ayanamsa calculator payload — needs only a date,
 * an optional time and a time zone / UTC offset. No coordinates:
 * the ayanamsa is a function of time alone.
 */
const validateAyanamsa = (body) => {
  const errors = [];
  const value = {};
  const source = body && typeof body === "object" ? body : {};

  const date = typeof source.date === "string" ? source.date.trim() : "";
  if (!date) {
    pushError(errors, "date", "The date is required to calculate the ayanamsa.");
  } else if (!DATE_PATTERN.test(date)) {
    pushError(errors, "date", "Date must be in YYYY-MM-DD format.");
  } else {
    const [year, month, day] = date.split("-").map(Number);
    const now = new Date();
    if (year < MIN_YEAR || year > now.getUTCFullYear() + 100 || !isRealDate(year, month, day)) {
      pushError(errors, "date", "Please enter a valid calendar date.");
    } else {
      value.date = date;
    }
  }

  const rawTime = typeof source.time === "string" ? source.time.trim() : "";
  if (rawTime && !TIME_PATTERN.test(rawTime)) {
    pushError(errors, "time", "Time must be in HH:MM (24 hour) format.");
  } else if (rawTime) {
    const [hour, minute, second = 0] = rawTime.split(":").map(Number);
    if (hour > 23 || minute > 59 || second > 59) {
      pushError(errors, "time", "Time must be a valid 24 hour time.");
    } else {
      value.time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    }
  } else {
    value.time = "12:00:00";
  }

  const rawOffset = source.utcOffsetMinutes;
  const hasOffset =
    rawOffset !== undefined && rawOffset !== null && rawOffset !== "" && Number.isFinite(Number(rawOffset));
  const timeZone = typeof source.timeZone === "string" ? source.timeZone.trim() : "";

  if (hasOffset) {
    const offset = Number(rawOffset);
    if (offset < -720 || offset > 840) {
      pushError(errors, "utcOffsetMinutes", "UTC offset must be between -720 and +840 minutes.");
    } else {
      value.utcOffsetMinutes = offset;
      value.timeZone = timezoneService.isValidTimeZone(timeZone) ? timeZone : null;
    }
  } else if (!timeZone) {
    pushError(errors, "timeZone", "Select the time zone the date and time refer to.");
  } else if (!timezoneService.isValidTimeZone(timeZone)) {
    pushError(errors, "timeZone", `'${timeZone}' is not a recognised IANA time zone.`);
  } else {
    value.timeZone = timeZone;
    value.utcOffsetMinutes = null;
  }

  const ayanamsa = typeof source.ayanamsa === "string" ? source.ayanamsa.trim().toLowerCase() : "";
  if (ayanamsa && !engine.AYANAMSA_SYSTEMS[ayanamsa]) {
    pushError(
      errors,
      "ayanamsa",
      `Unknown ayanamsa '${ayanamsa}'. Supported: ${Object.keys(engine.AYANAMSA_SYSTEMS).join(", ")}.`
    );
  } else {
    value.ayanamsa = ayanamsa || engine.DEFAULT_AYANAMSA;
  }

  return { ok: errors.length === 0, errors, value };
};

module.exports = {
  validateBirthDetails,
  validateTwoPeople,
  validateNumerology,
  validateAyanamsa,
  validateLocationQuery,
  isRealDate,
};
/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Birth time -> Universal Time conversion
 *
 *  Rules:
 *  - The time zone is ALWAYS the one resolved from the birth
 *    location (or explicitly supplied by the user).
 *  - We never fall back to the visitor's own time zone and we
 *    never use the current location.
 *  - Historical DST rules come from the IANA time zone
 *    database of the Node runtime (via Intl), so a 1974 Indian
 *    birth or a 1947 British birth converts correctly.
 * ==========================================================
 */

const MS_PER_MINUTE = 60000;
const MS_PER_DAY = 86400000;

const hasIntlTimeZones = (() => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC" });
    return true;
  } catch (error) {
    return false;
  }
})();

const isValidTimeZone = (timeZone) => {
  if (!timeZone || typeof timeZone !== "string") return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch (error) {
    return false;
  }
};

const formatterCache = new Map();

const getFormatter = (timeZone, options) => {
  const key = `${timeZone}|${JSON.stringify(options)}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.DateTimeFormat("en-US", { timeZone, ...options })
    );
  }
  return formatterCache.get(key);
};

const partsToObject = (parts) => {
  const out = {};
  for (const part of parts) {
    if (part.type !== "literal") out[part.type] = part.value;
  }
  return out;
};

/** UTC milliseconds that the zone clock shows for the given wall clock parts */
const partsToUtcMs = (parts) =>
  Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second || 0)
  );

/** Zone offset (minutes east of UTC) in force at a given UTC instant */
const offsetMinutesAt = (timeZone, utcMs) => {
  const parts = partsToObject(
    getFormatter(timeZone, {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date(utcMs))
  );
  return Math.round((partsToUtcMs(parts) - utcMs) / MS_PER_MINUTE);
};

/** Wall clock (in the zone) for a UTC instant */
const wallClockAt = (timeZone, utcMs) => {
  const parts = partsToObject(
    getFormatter(timeZone, {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date(utcMs))
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second || 0),
  };
};

const sameWallClock = (a, b) =>
  a.year === b.year &&
  a.month === b.month &&
  a.day === b.day &&
  a.hour === b.hour &&
  a.minute === b.minute &&
  Math.abs(a.second - b.second) <= 1;

const formatOffset = (minutes) => {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const mins = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${mins}`;
};

const zoneAbbreviation = (timeZone, utcMs) => {
  try {
    const parts = getFormatter(timeZone, { timeZoneName: "short" }).formatToParts(
      new Date(utcMs)
    );
    const found = parts.find((part) => part.type === "timeZoneName");
    return found ? found.value : "";
  } catch (error) {
    return "";
  }
};

/**
 * Standard (winter) offset of the zone in a given year — used only to
 * report whether a birth moment fell inside daylight saving time.
 */
const standardOffsetForYear = (timeZone, year) => {
  const jan = offsetMinutesAt(timeZone, Date.UTC(year, 0, 15, 12));
  const jul = offsetMinutesAt(timeZone, Date.UTC(year, 6, 15, 12));
  // Standard time always has the numerically smaller offset than DST
  // (e.g. New York -300 vs -240, Berlin +60 vs +120, Sydney +600 vs +660).
  return Math.min(jan, jul);
};

const getTimeZoneSupport = () => ({
  supported: hasIntlTimeZones,
  source: hasIntlTimeZones
    ? "IANA time zone database of the Node runtime (ICU)"
    : "unavailable",
});

/**
 * Convert a local wall-clock birth time in a named time zone to UTC.
 *
 * @param {{year:number, month:number, day:number, hour:number, minute:number, second?:number}} wall
 * @param {string} timeZone IANA zone name, e.g. "Asia/Kolkata"
 */
const wallClockToUtc = (wall, timeZone) => {
  if (!hasIntlTimeZones) {
    throw new Error("This server runtime does not provide IANA time zone data");
  }
  if (!isValidTimeZone(timeZone)) {
    throw new Error(`Unknown time zone: ${timeZone}`);
  }

  const second = wall.second || 0;
  const target = { ...wall, second };
  const wallMs = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    second
  );

  const offsetBefore = offsetMinutesAt(timeZone, wallMs - MS_PER_DAY);
  const offsetAfter = offsetMinutesAt(timeZone, wallMs + MS_PER_DAY);

  let utcMs;
  let offsetMinutes;
  let ambiguous = false;
  let nonexistent = false;

  if (offsetBefore === offsetAfter) {
    // No offset change anywhere near this local time — simple fix point.
    utcMs = wallMs - offsetBefore * MS_PER_MINUTE;
    offsetMinutes = offsetBefore;
    if (!sameWallClock(wallClockAt(timeZone, utcMs), target)) {
      // Guards against unusual zones whose offset changes within the day.
      let guess = wallMs;
      for (let i = 0; i < 5; i += 1) {
        const offset = offsetMinutesAt(timeZone, guess);
        const next = wallMs - offset * MS_PER_MINUTE;
        if (next === guess) break;
        guess = next;
      }
      utcMs = guess;
      offsetMinutes = offsetMinutesAt(timeZone, guess);
    }
  } else {
    // A DST transition happened within a day of this wall clock time.
    const candidateBefore = wallMs - offsetBefore * MS_PER_MINUTE;
    const candidateAfter = wallMs - offsetAfter * MS_PER_MINUTE;
    const beforeValid = sameWallClock(wallClockAt(timeZone, candidateBefore), target);
    const afterValid = sameWallClock(wallClockAt(timeZone, candidateAfter), target);

    if (beforeValid && afterValid) {
      // Clocks turned back: the same wall time exists twice.
      ambiguous = true;
      utcMs = Math.min(candidateBefore, candidateAfter);
      offsetMinutes = offsetMinutesAt(timeZone, utcMs);
    } else if (beforeValid) {
      utcMs = candidateBefore;
      offsetMinutes = offsetBefore;
    } else if (afterValid) {
      utcMs = candidateAfter;
      offsetMinutes = offsetAfter;
    } else {
      // Clocks jumped forward: this wall time never existed.
      nonexistent = true;
      utcMs = candidateBefore;
      offsetMinutes = offsetBefore;
    }
  }

  const standardOffset = standardOffsetForYear(timeZone, wall.year);
  const utcDate = new Date(utcMs);

  return {
    utcMs,
    utcDate,
    utc: {
      year: utcDate.getUTCFullYear(),
      month: utcDate.getUTCMonth() + 1,
      day: utcDate.getUTCDate(),
      hour: utcDate.getUTCHours(),
      minute: utcDate.getUTCMinutes(),
      second: utcDate.getUTCSeconds(),
    },
    timeZone,
    offsetMinutes,
    offsetLabel: formatOffset(offsetMinutes),
    abbreviation: zoneAbbreviation(timeZone, utcMs),
    isDst: offsetMinutes - standardOffset > 0,
    ambiguous,
    nonexistent,
    note: ambiguous
      ? "This local time occurs twice on this date because the clocks were turned back (end of daylight saving). The first occurrence was used — if the birth happened during the second occurrence, use the manual UTC offset option."
      : nonexistent
      ? "This local time did not exist because the clocks jumped forward (start of daylight saving). The offset in force just before the change was used — please double check the birth time."
      : "",
  };
};

/** Convert UTC to the local wall clock of a zone (for display) */
const utcToWallClock = (utcMs, timeZone) => {
  if (!isValidTimeZone(timeZone)) {
    throw new Error(`Unknown time zone: ${timeZone}`);
  }
  return {
    ...wallClockAt(timeZone, utcMs),
    offsetMinutes: offsetMinutesAt(timeZone, utcMs),
  };
};

/**
 * Convert a local time using a user supplied fixed UTC offset.
 * @param {{year:number,month:number,day:number,hour:number,minute:number,second?:number}} wall
 * @param {number} offsetMinutes minutes east of UTC
 */
const fixedOffsetToUtc = (wall, offsetMinutes) => {
  const utcMs =
    Date.UTC(
      wall.year,
      wall.month - 1,
      wall.day,
      wall.hour,
      wall.minute,
      wall.second || 0
    ) -
    offsetMinutes * MS_PER_MINUTE;
  const utcDate = new Date(utcMs);
  return {
    utcMs,
    utcDate,
    utc: {
      year: utcDate.getUTCFullYear(),
      month: utcDate.getUTCMonth() + 1,
      day: utcDate.getUTCDate(),
      hour: utcDate.getUTCHours(),
      minute: utcDate.getUTCMinutes(),
      second: utcDate.getUTCSeconds(),
    },
    timeZone: null,
    offsetMinutes,
    offsetLabel: formatOffset(offsetMinutes),
    abbreviation: "",
    isDst: false,
    ambiguous: false,
    nonexistent: false,
    note: "A fixed UTC offset was supplied with the birth details, so it was used instead of a named time zone.",
  };
};

module.exports = {
  isValidTimeZone,
  offsetMinutesAt,
  wallClockToUtc,
  utcToWallClock,
  fixedOffsetToUtc,
  formatOffset,
  zoneAbbreviation,
  getTimeZoneSupport,
};

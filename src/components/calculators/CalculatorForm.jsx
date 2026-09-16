import React, { useState } from "react";
import LocationInput from "./LocationInput";

/* ==========================================================
   Reusable calculator form.
   kind: "numerology" | "ayanamsa" | "birth" | "pair"
   Props: calc (registry entry), loading, apiError, onCalculate(payload)
   ========================================================== */

const EMPTY_PERSON = {
  name: "",
  gender: "",
  date: "",
  time: "",
  city: "",
  region: "",
  country: "",
  place: "",
  latitude: "",
  longitude: "",
  timeZone: "",
  utcOffsetMinutes: null,
};

const COMMON_ZONES = [
  "Asia/Kolkata", "Asia/Karachi", "Asia/Dhaka", "Asia/Kathmandu", "Asia/Colombo",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Asia/Dubai", "Asia/Tehran",
  "Asia/Jerusalem", "Asia/Bangkok", "Asia/Jakarta", "Asia/Seoul", "Asia/Manila",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow", "Europe/Istanbul",
  "Europe/Athens", "Europe/Madrid", "Europe/Rome", "Europe/Amsterdam",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Sao_Paulo", "America/Mexico_City", "America/Anchorage",
  "Australia/Sydney", "Australia/Melbourne", "Australia/Perth", "Pacific/Auckland",
  "Pacific/Honolulu", "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg", "UTC",
];

const AYANAMSA_OPTIONS = [
  { value: "lahiri", label: "Lahiri (Chitrapaksha) — standard Vedic" },
  { value: "raman", label: "B.V. Raman" },
  { value: "krishnamurti", label: "KP (Krishnamurti)" },
  { value: "fagan_bradley", label: "Fagan/Bradley (Western sidereal)" },
  { value: "yukteshwar", label: "Yukteshwar" },
  { value: "true_citra", label: "True Chitra (Spica)" },
  { value: "true_revati", label: "True Revati" },
  { value: "true_pushya", label: "True Pushya (PVRN Rao)" },
  { value: "lahiri_icrc", label: "Lahiri (ICRC)" },
];

const inputClass =
  "w-full rounded-lg bg-white/5 border border-purple-500/30 px-3 py-2 text-sm text-purple-100 placeholder-purple-300/40 outline-none focus:border-fuchsia-400/70 focus:shadow-[0_0_16px_rgba(192,132,252,0.25)] transition-all";

const Field = ({ label, error, required, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200/80 mb-1.5">
      {label} {required && <span className="text-fuchsia-400">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1 text-[11px] text-purple-300/50">{hint}</p>}
    {error && <p className="mt-1 text-[11px] text-rose-400">{error}</p>}
  </div>
);

const locationValid = (p) =>
  p &&
  p.latitude !== "" &&
  p.longitude !== "" &&
  Number.isFinite(Number(p.latitude)) &&
  Number.isFinite(Number(p.longitude)) &&
  ((p.timeZone && p.timeZone.trim()) || Number.isFinite(Number(p.utcOffsetMinutes)));

const validateBirth = (p, label, errors) => {
  const prefix = label ? `${label} ` : "";
  if (!p.date) errors[`${prefix}date`] = "Date of birth is required.";
  if (!p.time) errors[`${prefix}time`] = "Time of birth is required.";
  if (!locationValid(p)) {
    errors[`${prefix}location`] =
      "Select your birth city from the suggestions, or enter latitude, longitude and time zone manually.";
  }
};

const birthPayload = (p, extra = {}) => ({
  date: p.date,
  time: p.time,
  latitude: Number(p.latitude),
  longitude: Number(p.longitude),
  city: p.city || undefined,
  region: p.region || undefined,
  country: p.country || undefined,
  timeZone: p.timeZone || undefined,
  utcOffsetMinutes: p.utcOffsetMinutes === "" || p.utcOffsetMinutes === null ? undefined : Number(p.utcOffsetMinutes),
  name: p.name || undefined,
  gender: p.gender || undefined,
  ...extra,
});

/* ---- one person's birth details (pair mode) ---- */
const PersonCard = ({ number, person, errors, onChange }) => {
  const patch = (next) => onChange(number - 1, next);
  return (
    <div className="rounded-2xl border border-purple-500/25 bg-purple-950/40 backdrop-blur-md shadow-[0_0_35px_rgba(126,34,206,0.18)] p-5 md:p-6">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-purple-700/40 border border-fuchsia-400/40 flex items-center justify-center text-fuchsia-200 font-bold">
          {number}
        </span>
        <h4 className="font-semibold text-purple-100">Person {number}</h4>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name (optional)">
          <input
            type="text"
            value={person.name}
            onChange={(e) => patch({ name: e.target.value })}
            className={inputClass}
            placeholder={number === 1 ? "e.g. Alex" : "e.g. Sam"}
          />
        </Field>
        <Field label="Gender (used for classical kutas)">
          <select
            value={person.gender}
            onChange={(e) => patch({ gender: e.target.value })}
            className={inputClass}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label="Date of Birth" error={errors[`p${number}Date`]} required>
          <input
            type="date"
            value={person.date}
            min="1900-01-01"
            max="2100-12-31"
            onChange={(e) => patch({ date: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Time of Birth (local clock)" error={errors[`p${number}Time`]} required>
          <input
            type="time"
            value={person.time}
            onChange={(e) => patch({ time: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Place of Birth" error={errors[`p${number}Location`]} required>
          <LocationInput
            idPrefix={`person${number}`}
            value={person}
            onChange={(next) => patch(next || { ...EMPTY_PERSON })}
          />
        </Field>
      </div>
    </div>
  );
};

/* ---- shared birth fields (single-birth mode) ---- */
const BirthFields = ({ person, errors, onChange, showAyanamsa }) => {
  const patch = onChange;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Date of Birth" error={errors.date} required>
        <input
          type="date"
          value={person.date}
          min="1900-01-01"
          max="2100-12-31"
          onChange={(e) => patch({ date: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field
        label="Time of Birth (local clock)"
        error={errors.time}
        required
        hint="Exact time matters — the Moon and Ascendant move continuously."
      >
        <input
          type="time"
          value={person.time}
          onChange={(e) => patch({ time: e.target.value })}
          className={inputClass}
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="Place of Birth" error={errors.location} required>
          <LocationInput
            idPrefix="birth"
            value={person}
            onChange={(next) => patch(next || { ...EMPTY_PERSON })}
          />
        </Field>
      </div>
      {showAyanamsa && (
        <div className="md:col-span-2">
          <Field
            label="Ayanamsa System"
            hint="Lahiri is the official Indian standard — most Vedic astrologers use it."
          >
            <select
              value={person.ayanamsa}
              onChange={(e) => patch({ ayanamsa: e.target.value })}
              className={inputClass}
            >
              {AYANAMSA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
    </div>
  );
};

/* =========================
   MAIN FORM COMPONENT
========================= */
const collectPairErrors = (people) => {
  const nextErrors = {};
  [[0, "p1"], [1, "p2"]].forEach(([index, prefix]) => {
    const local = {};
    validateBirth(people[index], "", local);
    Object.keys(local).forEach((key) => {
      nextErrors[`${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}`] = local[key];
    });
  });
  return nextErrors;
};

const CalculatorForm = ({ calc, loading, onCalculate, onReset }) => {
  const kind = calc.kind;
  const vedic = ["rashi", "nakshatra", "ascendant"].includes(calc.slug);

  const [person, setPerson] = useState(() => ({ ...EMPTY_PERSON, ayanamsa: "lahiri" }));
  const [people, setPeople] = useState(() => [{ ...EMPTY_PERSON }, { ...EMPTY_PERSON }]);
  const [numerology, setNumerology] = useState({ fullName: "", dateOfBirth: "", system: "pythagorean" });
  const [ayanamsaForm, setAyanamsaForm] = useState({
    date: "",
    time: "",
    timeZone: "Asia/Kolkata",
    ayanamsa: "lahiri",
  });
  const [errors, setErrors] = useState({});

  const reset = () => {
    setPerson({ ...EMPTY_PERSON, ayanamsa: "lahiri" });
    setPeople([{ ...EMPTY_PERSON }, { ...EMPTY_PERSON }]);
    setNumerology({ fullName: "", dateOfBirth: "", system: "pythagorean" });
    setAyanamsaForm({ date: "", time: "", timeZone: "Asia/Kolkata", ayanamsa: "lahiri" });
    setErrors({});
    if (onReset) onReset(); // let the page clear any previous result too
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return; // prevent duplicate submissions
    let nextErrors = {};
    let payload = null;

    if (kind === "numerology") {
      if (!numerology.dateOfBirth) nextErrors.dateOfBirth = "Date of birth is required.";
      if (!numerology.fullName.trim()) nextErrors.fullName = "Full name is required.";
      if (!Object.keys(nextErrors).length) {
        payload = {
          fullName: numerology.fullName.trim(),
          dateOfBirth: numerology.dateOfBirth,
          system: numerology.system,
        };
      }
    } else if (kind === "ayanamsa") {
      if (!ayanamsaForm.date) nextErrors.date = "The date is required.";
      if (!ayanamsaForm.timeZone.trim()) nextErrors.timeZone = "Time zone is required.";
      if (!Object.keys(nextErrors).length) {
        payload = {
          date: ayanamsaForm.date,
          time: ayanamsaForm.time || "12:00",
          timeZone: ayanamsaForm.timeZone.trim(),
          ayanamsa: ayanamsaForm.ayanamsa,
        };
      }
    } else if (kind === "birth") {
      validateBirth(person, "", nextErrors);
      if (!Object.keys(nextErrors).length) {
        payload = birthPayload(person, vedic ? { ayanamsa: person.ayanamsa } : {});
      }
    } else {
      nextErrors = collectPairErrors(people);
      if (!Object.keys(nextErrors).length) {
        payload = {
          person1: birthPayload(people[0], { ayanamsa: "lahiri" }),
          person2: birthPayload(people[1], { ayanamsa: "lahiri" }),
        };
      }
    }

    setErrors(nextErrors);
    if (payload) onCalculate(payload);
  };

  const cardClass =
    "rounded-3xl border border-purple-500/30 bg-purple-950/40 backdrop-blur-md shadow-[0_0_50px_rgba(126,34,206,0.25)] p-6 md:p-8";

  return (
    <form onSubmit={handleSubmit} className={cardClass} noValidate>
      {kind === "numerology" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.fullName} required hint="Birth name gives the truest Expression number.">
            <input
              type="text" value={numerology.fullName}
              onChange={(e) => setNumerology({ ...numerology, fullName: e.target.value })}
              className={inputClass} placeholder="e.g. Rohan Sharma"
            />
          </Field>
          <Field label="Date of Birth" error={errors.dateOfBirth} required>
            <input
              type="date" value={numerology.dateOfBirth} min="1900-01-01" max="2100-12-31"
              onChange={(e) => setNumerology({ ...numerology, dateOfBirth: e.target.value })}
              className={inputClass}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Number System">
              <select
                value={numerology.system}
                onChange={(e) => setNumerology({ ...numerology, system: e.target.value })}
                className={inputClass}
              >
                <option value="pythagorean">Pythagorean (Western) — A=1 … Z=9</option>
                <option value="chaldean">Chaldean (Vedic-era) number map</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {kind === "ayanamsa" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Date" error={errors.date} required>
            <input
              type="date" value={ayanamsaForm.date} min="1900-01-01" max="2100-12-31"
              onChange={(e) => setAyanamsaForm({ ...ayanamsaForm, date: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Time (optional)" hint="Defaults to noon if left empty.">
            <input
              type="time" value={ayanamsaForm.time}
              onChange={(e) => setAyanamsaForm({ ...ayanamsaForm, time: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Time Zone" error={errors.timeZone} required hint="The zone the date and time refer to.">
            <input
              list="calc-tz-options" value={ayanamsaForm.timeZone}
              onChange={(e) => setAyanamsaForm({ ...ayanamsaForm, timeZone: e.target.value })}
              className={inputClass} placeholder="Asia/Kolkata"
            />
            <datalist id="calc-tz-options">
              {COMMON_ZONES.map((zone) => (
                <option key={zone} value={zone} />
              ))}
            </datalist>
          </Field>
          <Field label="Ayanamsa System" hint="The result compares all ten systems.">
            <select
              value={ayanamsaForm.ayanamsa}
              onChange={(e) => setAyanamsaForm({ ...ayanamsaForm, ayanamsa: e.target.value })}
              className={inputClass}
            >
              {AYANAMSA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {kind === "birth" && (
        <BirthFields
          person={person} errors={errors} showAyanamsa={vedic}
          onChange={(patch) => setPerson((prev) => ({ ...prev, ...patch }))}
        />
      )}

      {kind === "pair" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2].map((number) => (
            <PersonCard
              key={number} number={number}
              person={people[number - 1]} errors={errors}
              onChange={(index, patch) =>
                setPeople((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
              }
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="submit" disabled={loading}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-fuchsia-600 to-purple-700 shadow-[0_0_25px_rgba(192,38,211,0.45)] hover:shadow-[0_0_40px_rgba(192,38,211,0.65)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Calculating…
            </>
          ) : (
            <>Calculate {calc.short}</>
          )}
        </button>
        <button
          type="button" onClick={reset} disabled={loading}
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-purple-200 border border-purple-500/40 hover:border-fuchsia-400/70 hover:text-fuchsia-300 transition-all duration-300 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;



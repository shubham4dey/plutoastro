/**
 * =========================================================
 *  PlutoAstro — Planetary Changes
 *  Birth Details collection page (reference-style UX)
 *
 *  MANDATORY BASIC DETAILS ONLY:
 *    Name, Sex, Date of Birth, Time of Birth, Birth Place.
 *  These five alone are ALWAYS enough to generate the chart.
 *
 *  ADVANCED SETTINGS (all OPTIONAL overrides, never required):
 *    Longitude, Latitude, Time Zone, DST Correction,
 *    Ayanamsa, Chart Style, KP Horary Number.
 *  When omitted, the backend auto-geocodes the Birth Place,
 *  auto-determines the IANA zone/UTC offset (DST aware via
 *  timezoneService) and uses engine defaults for the rest.
 * =========================================================
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LocationInput from "../components/calculators/LocationInput";
import { setBirthDetails, persistBirthDetails } from "../store/birthDetailsSlice";

const inputClass =
  "w-full rounded-lg bg-white/5 border border-purple-500/30 px-3 py-2 text-sm text-purple-100 placeholder-purple-300/40 outline-none focus:border-fuchsia-400/70 focus:shadow-[0_0_16px_rgba(192,132,252,0.25)] transition-all";

const Field = ({ label, children, optional }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-purple-200/80 mb-1.5">
      {label} {!optional && <span className="text-fuchsia-400">*</span>}
    </label>
    {children}
  </div>
);

const todayISO = () => new Date().toISOString().slice(0, 10);

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

const CHART_STYLES = ["North Indian", "South Indian", "East Indian", "Western"];

const BirthDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const existing = useSelector((store) => store.birthDetails);

  const [place, setPlace] = useState(
    existing
      ? {
          place: existing.place || "",
          city: existing.city || "",
          region: existing.region || "",
          country: existing.country || "",
          latitude: existing.latitude ?? "",
          longitude: existing.longitude ?? "",
          timeZone: existing.timeZone || "",
          utcOffsetMinutes: existing.utcOffsetMinutes ?? "",
        }
      : { place: "" }
  );
  const [name, setName] = useState(existing?.name || "");
  const [sex, setSex] = useState(existing?.sex || existing?.gender || "");
  const [date, setDate] = useState(existing?.date || "");
  const [time, setTime] = useState(existing?.time || "12:00");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dstCorrection, setDstCorrection] = useState(
    existing?.dstCorrection === undefined || existing?.dstCorrection === null
      ? "auto"
      : String(existing.dstCorrection)
  );
  const [ayanamsa, setAyanamsa] = useState(existing?.ayanamsa || "lahiri");
  const [chartStyle, setChartStyle] = useState(existing?.chartStyle || "North Indian");
  const [kpHoraryNumber, setKpHoraryNumber] = useState(
    existing?.kpHoraryNumber === undefined || existing?.kpHoraryNumber === null
      ? ""
      : String(existing.kpHoraryNumber)
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.title = "Birth Details — PlutoAstro";
  }, []);

  /* BASIC details alone are enough: Name + Sex + DOB + Time + Birth Place.
   * Advanced lat/lon/timezone are OPTIONAL overrides — never required. */
  const placeText = (place.place || [place.city, place.region, place.country].filter(Boolean).join(", ")).trim();
  const canSave =
    name.trim() &&
    sex &&
    date &&
    time &&
    placeText.length >= 2 &&
    !saving;

  const handleSave = () => {
    setFormError("");
    if (!name.trim()) return setFormError("Please enter your name.");
    if (!sex) return setFormError("Please select Male, Female or Other.");
    if (!date) return setFormError("Please choose your date of birth.");
    if (!time) return setFormError("Please enter your time of birth.");
    if (!placeText || placeText.length < 2) return setFormError("Please enter your birth place.");
    const horary = kpHoraryNumber === "" ? null : Number(kpHoraryNumber);
    if (kpHoraryNumber !== "" && (!Number.isInteger(horary) || horary < 1 || horary > 249)) {
      return setFormError("KP horary number must be between 1 and 249 (or left empty).");
    }
    setSaving(true);
    const details = {
      name: name.trim(),
      sex,
      gender: sex,
      date,
      time,
      place: place.place || placeText || undefined,
      city: place.city || undefined,
      region: place.region || undefined,
      country: place.country || undefined,
      // Advanced overrides — sent only when the user actually typed them.
      latitude: place.latitude === "" || place.latitude === undefined ? undefined : Number(place.latitude),
      longitude: place.longitude === "" || place.longitude === undefined ? undefined : Number(place.longitude),
      timeZone: place.timeZone || undefined,
      utcOffsetMinutes:
        place.utcOffsetMinutes === "" || place.utcOffsetMinutes === undefined
          ? undefined
          : Number(place.utcOffsetMinutes),
      dstCorrection:
        dstCorrection === "auto" || dstCorrection === "" ? "auto" : Number(dstCorrection),
      ayanamsa: ayanamsa || "lahiri",
      chartStyle: chartStyle || "North Indian",
      kpHoraryNumber: horary,
    };
    persistBirthDetails(details);
    dispatch(setBirthDetails(details));
    setSaving(false);
    navigate("/planetary-changes");
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0b0416] via-[#150829] to-[#0b0416] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-700/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-700/15 blur-[110px]" />
      </div>

      <div className="relative z-10 pt-40 pb-20 px-4 lg:px-8 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 text-[11px] font-bold uppercase tracking-[0.3em]">
            Planetary Changes
          </span>
          <h1 className="mt-5 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-300">
            Complete Your Birth Details
          </h1>
          <p className="mt-4 text-sm text-purple-200/80 leading-relaxed">
            Basic details are enough — Name, Sex, Date of Birth, Time of
            Birth and Birth Place. Advanced settings below are optional and
            only override the automatic location/timezone detection.
          </p>
        </div>

        <div className="rounded-3xl border border-purple-500/25 bg-purple-950/40 backdrop-blur-md p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </Field>
            <Field label="Sex">
              <div className="flex gap-2">
                {["male", "female", "other"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSex(option)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition-all ${
                      sex === option
                        ? "border-fuchsia-400/70 bg-fuchsia-500/15 text-fuchsia-200"
                        : "border-purple-500/30 bg-white/5 text-purple-200/70 hover:text-purple-100"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Date of Birth">
              <input
                type="date"
                value={date}
                min="1900-01-01"
                max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Time of Birth">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Birth Place">
            <LocationInput
              label="Birth Place"
              value={place}
              onChange={(patch) => {
                if (!patch) {
                  setPlace({ place: "" });
                  return;
                }
                setPlace((prev) => ({ ...prev, ...patch }));
              }}
            />
            <p className="mt-1.5 text-[11px] text-purple-300/60">
              Just pick your city from the suggestions — latitude, longitude
              and timezone are detected automatically.
            </p>
          </Field>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-900/10">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200/80">
                Advanced Settings (optional)
              </span>
              <span className="text-fuchsia-300 text-sm">{showAdvanced ? "▲" : "▼"}</span>
            </button>
            {showAdvanced && (
              <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Longitude" optional>
                  <input
                    type="number" step="any" min="-180" max="180"
                    value={place.longitude ?? ""}
                    onChange={(e) => setPlace((prev) => ({ ...prev, longitude: e.target.value }))}
                    placeholder="auto"
                    className={inputClass}
                  />
                </Field>
                <Field label="Latitude" optional>
                  <input
                    type="number" step="any" min="-90" max="90"
                    value={place.latitude ?? ""}
                    onChange={(e) => setPlace((prev) => ({ ...prev, latitude: e.target.value }))}
                    placeholder="auto"
                    className={inputClass}
                  />
                </Field>
                <Field label="Time Zone" optional>
                  <input
                    list="birth-tz-options"
                    value={place.timeZone ?? ""}
                    onChange={(e) => setPlace((prev) => ({ ...prev, timeZone: e.target.value }))}
                    placeholder="auto"
                    className={inputClass}
                  />
                  <datalist id="birth-tz-options">
                    {COMMON_ZONES.map((zone) => (
                      <option key={zone} value={zone} />
                    ))}
                  </datalist>
                </Field>
                <Field label="DST Correction" optional>
                  <select
                    value={dstCorrection}
                    onChange={(e) => setDstCorrection(e.target.value)}
                    className={inputClass}
                  >
                    <option value="auto">Auto (historical DST rules)</option>
                    <option value="0">0 min (no correction)</option>
                    <option value="30">+30 min</option>
                    <option value="60">+60 min</option>
                    <option value="-30">-30 min</option>
                    <option value="-60">-60 min</option>
                  </select>
                </Field>
                <Field label="Ayanamsa" optional>
                  <select
                    value={ayanamsa}
                    onChange={(e) => setAyanamsa(e.target.value)}
                    className={inputClass}
                  >
                    {AYANAMSA_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Chart Style" optional>
                  <select
                    value={chartStyle}
                    onChange={(e) => setChartStyle(e.target.value)}
                    className={inputClass}
                  >
                    {CHART_STYLES.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="KP Horary Number (1-249)" optional>
                    <input
                      type="number" min="1" max="249"
                      value={kpHoraryNumber}
                      onChange={(e) => setKpHoraryNumber(e.target.value)}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            )}
          </div>

          {formError && (
            <p className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-2.5 text-sm text-rose-200">
              {formError}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate("/planetary-changes")}
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-purple-200 border border-purple-500/40 hover:border-fuchsia-400/70 hover:text-fuchsia-300 transition-all duration-300"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-fuchsia-600 to-purple-700 shadow-[0_0_25px_rgba(192,38,211,0.45)] hover:shadow-[0_0_40px_rgba(192,38,211,0.65)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {saving ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : null}
              Save &amp; View Chart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BirthDetails;



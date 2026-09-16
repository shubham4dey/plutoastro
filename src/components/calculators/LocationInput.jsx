import React, { useEffect, useRef, useState } from "react";
import { CALCULATOR_API } from "../../utils/calculators";

const merge = (value, patch) => ({ ...(value || {}), ...patch });

const composePlace = (city, country) =>
  [city, country].filter(Boolean).join(", ") || undefined;

/**
 * Location autocomplete — searches via the backend proxy
 * (/api/calculators/geo/search) so the browser never talks to
 * the geocoding provider directly. Selecting a suggestion fills
 * city, region, country, latitude, longitude and IANA time zone.
 */
const LocationInput = ({ value, onChange, error, label = "Birth Place", idPrefix = "loc" }) => {
  const [query, setQuery] = useState(value?.place || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [manual, setManual] = useState(false);
  const boxRef = useRef(null);
  const abortRef = useRef(null);

  /* keep the visible text in sync when the form resets */
  useEffect(() => {
    setQuery(value?.place || "");
    if (!value?.place) setManual(false);
  }, [value?.place]);

  useEffect(() => {
    const handler = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (manual) return undefined;
    if (!query || query.trim().length < 2 || (value?.place && query === value.place)) {
      setSuggestions([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setSearching(true);
      try {
        const res = await fetch(
          `${CALCULATOR_API}/api/calculators/geo/search?q=${encodeURIComponent(query.trim())}`,
          { signal: abortRef.current.signal }
        );
        const json = await res.json();
        setSuggestions(json.success && Array.isArray(json.data) ? json.data : []);
        setOpen(true);
      } catch (err) {
        if (err.name !== "AbortError") setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, manual, value?.place]);

  const select = (item) => {
    setQuery(item.label);
    setOpen(false);
    setManual(false);
    onChange({
      city: item.city,
      region: item.region,
      country: item.country,
      place: item.label,
      latitude: item.latitude,
      longitude: item.longitude,
      timeZone: item.timeZone,
    });
  };

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-purple-500/30 px-3 py-2 text-sm text-purple-100 placeholder-purple-300/40 outline-none focus:border-fuchsia-400/70 focus:shadow-[0_0_16px_rgba(192,132,252,0.25)] transition-all";

  return (
    <div ref={boxRef} className="relative">
      <label
        htmlFor={`${idPrefix}-place`}
        className="block text-xs font-semibold uppercase tracking-wider text-purple-200/80 mb-1.5"
      >
        {label} *
      </label>
      <input
        id={`${idPrefix}-place`}
        type="text"
        autoComplete="off"
        className={`${inputClass} ${error ? "border-rose-500/70" : ""}`}
        placeholder="Search your birth city…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value) onChange(null);
        }}
        onFocus={() => suggestions.length && setOpen(true)}
      />
      {searching && (
        <span className="absolute right-3 top-9 text-purple-300/70 text-xs">
          <i className="ri-loader-4-line animate-spin" />
        </span>
      )}
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-purple-500/30 bg-[#140b26]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          {suggestions.map((item) => (
            <li key={`${item.label}-${item.latitude}-${item.longitude}`}>
              <button
                type="button"
                onClick={() => select(item)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-purple-100 hover:bg-purple-600/20 transition-colors"
              >
                <span>
                  <span className="font-medium">{item.city || item.label}</span>
                  <span className="block text-xs text-purple-300/70">
                    {[item.region, item.country].filter(Boolean).join(", ")}
                  </span>
                </span>
                <span className="text-[10px] text-purple-300/50 whitespace-nowrap">
                  {item.timeZone}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => {
          setManual(!manual);
          if (!manual) {
            onChange(null);
            setSuggestions([]);
            setOpen(false);
          }
        }}
        className="mt-1.5 text-[11px] text-purple-300/70 underline underline-offset-2 hover:text-fuchsia-300 transition-colors"
      >
        {manual ? "← Back to search" : "Enter details manually"}
      </button>
      {manual && (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-purple-500/20 bg-purple-900/10 p-3">
          <ManualField id={`${idPrefix}-lat`} label="Latitude *" value={value?.latitude ?? ""} placeholder="28.6139" onChange={(v) => onChange(merge(value, { latitude: v }))} />
          <ManualField id={`${idPrefix}-lng`} label="Longitude *" value={value?.longitude ?? ""} placeholder="77.209" onChange={(v) => onChange(merge(value, { longitude: v }))} />
          <ManualField id={`${idPrefix}-city`} label="City" value={value?.city ?? ""} placeholder="Delhi" onChange={(v) => onChange(merge(value, { city: v, place: composePlace(v, value?.country) }))} />
          <ManualField id={`${idPrefix}-country`} label="Country" value={value?.country ?? ""} placeholder="India" onChange={(v) => onChange(merge(value, { country: v, place: composePlace(value?.city, v) }))} />
          <ManualField id={`${idPrefix}-tz`} label="IANA Time Zone *" value={value?.timeZone ?? ""} placeholder="Asia/Kolkata" onChange={(v) => onChange(merge(value, { timeZone: v }))} />
          <ManualField id={`${idPrefix}-utc`} label="UTC Offset (minutes) — optional" value={value?.utcOffsetMinutes ?? ""} placeholder="330" onChange={(v) => onChange(merge(value, { utcOffsetMinutes: v === "" ? null : Number(v) }))} />
        </div>
      )}
    </div>
  );
};

const ManualField = ({ id, label, value, onChange, placeholder }) => (
  <div className={label.startsWith("IANA") ? "col-span-2" : ""}>
    <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-wider text-purple-200/70 mb-1">
      {label}
    </label>
    <input
      id={id}
      type="text"
      className="w-full rounded-md bg-white/5 border border-purple-500/30 px-2 py-1.5 text-sm text-purple-100 placeholder-purple-300/30 outline-none focus:border-fuchsia-400/60 transition-all"
      value={value === null || value === undefined ? "" : value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default LocationInput;

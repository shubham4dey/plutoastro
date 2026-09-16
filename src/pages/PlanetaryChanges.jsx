/**
 * =========================================================
 *  PlutoAstro — Planetary Changes
 *
 *  Top-level feature: live planetary positions, retrograde
 *  status, sign changes and upcoming transits computed from
 *  the Swiss Ephemeris for the user's stored birth moment,
 *  place and time zone.
 *
 *  Architecture:
 *    - NO manual form is shown here.
 *    - Birth details are read from the existing birthDetails
 *      slice (localStorage-backed) when available.
 *    - If they are missing, a clean PlutoAstro card invites the
 *      user to complete them on /birth-details (the single place
 *      birth data is collected).
 *    - When details exist, the calculation is triggered
 *      AUTOMATICALLY (no submit event) via the existing
 *      /api/calculators/planetary-transits backend endpoint,
 *      which is the SAME real Swiss Ephemeris engine used by
 *      every other calculator — no mock data.
 * =========================================================
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CALCULATOR_API } from "../utils/calculators";
import { TransitResult } from "../components/calculators/ResultRenderers";

const STORAGE_KEY = "plutoastro:birthDetails";

const readLocalBirthDetails = () => {
  const candidates = [
    STORAGE_KEY,
    "plutoastro:birth-details",
    "plutoastro:birth",
    "birthDetails",
    "kundliBirthDetails",
    "kundli:birthDetails",
  ];
  try {
    for (const key of candidates) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (error) {
    /* ignore corrupt storage */
  }
  return null;
};

const nowInZone = (timeZone) => {
  try {
    const now = new Date();
    if (timeZone) {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(now);
      const get = (t) => (parts.find((p) => p.type === t) || {}).value;
      const date = `${get("year")}-${get("month")}-${get("day")}`;
      let hour = get("hour");
      if (hour === "24") hour = "00";
      return { date, time: `${hour}:${get("minute")}` };
    }
  } catch (error) {
    /* invalid zone — fall through to UTC */
  }
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`,
  };
};

const PlanetaryChanges = () => {
  const navigate = useNavigate();
  const storedBirthDetails = useSelector((store) => store.birthDetails);
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [payloadUsed, setPayloadUsed] = useState(null);

  useEffect(() => {
    document.title = "Planetary Changes — PlutoAstro";
  }, []);

  /*
   * Existing birth/profile details: redux slice first, then known
   * localStorage keys. BASIC details (Name + Sex + DOB + Time + Birth
   * Place text) are enough — coordinates/timezone are auto-resolved by
   * the backend when missing. Advanced manual values are overrides.
   */
  const birthDetails = useMemo(() => {
    if (storedBirthDetails && storedBirthDetails.date && storedBirthDetails.time) {
      return storedBirthDetails;
    }
    return readLocalBirthDetails();
  }, [storedBirthDetails]);

  const placeText =
    birthDetails &&
    ((birthDetails.place || [birthDetails.city, birthDetails.region, birthDetails.country].filter(Boolean).join(", ")) || "").trim();

  const hasBasicDetails =
    birthDetails &&
    birthDetails.date &&
    birthDetails.time &&
    placeText &&
    placeText.length >= 2;

  /*
   * Compute the LIVE transit chart automatically whenever BASIC details
   * exist. Moment is always "right now" in the resolved timezone.
   * Missing lat/lon/timezone are auto-resolved server-side from the
   * birth-place text; manual advanced values override when present.
   */
  useEffect(() => {
    if (!hasBasicDetails) {
      setResult(null);
      setPayloadUsed(null);
      return;
    }

    let active = true;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setApiError(null);
      setResult(null);
      try {
        const now = nowInZone(birthDetails.timeZone);
        const numOrUndefined = (v) =>
          v === "" || v === undefined || v === null || !Number.isFinite(Number(v))
            ? undefined
            : Number(v);
        const payload = {
          // Transit request — basic details (place text + DOB + local time)
          // are enough. The backend geocodes the place, resolves the IANA
          // zone / UTC offset (DST-aware) and computes the sky with Swiss
          // Ephemeris. Advanced astrology settings are optional overrides;
          // when absent the engine uses its existing defaults.
          date: now.date,
          time: now.time,
          place: placeText,
          city: birthDetails.city || undefined,
          region: birthDetails.region || undefined,
          country: birthDetails.country || undefined,
          // Optional overrides only — backend auto-resolves when omitted.
          latitude: numOrUndefined(birthDetails.latitude),
          longitude: numOrUndefined(birthDetails.longitude),
          timeZone: birthDetails.timeZone || undefined,
          utcOffsetMinutes: numOrUndefined(birthDetails.utcOffsetMinutes),
          dstCorrection: birthDetails.dstCorrection || undefined,
          ayanamsa: birthDetails.ayanamsa || undefined,
          houseSystem: birthDetails.houseSystem || undefined,
          chartStyle: birthDetails.chartStyle || undefined,
          kpHoraryNumber: birthDetails.kpHoraryNumber || undefined,
          allowFuture: true,
        };
        if (active) setPayloadUsed(payload);
        const res = await fetch(`${CALCULATOR_API}/api/calculators/planetary-transits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        const body = await res.json();
        if (!res.ok || !body || !body.success) {
          const msg =
            (body && body.errors && body.errors.length && body.errors[0].message) ||
            body?.message ||
            "Could not calculate the transit chart right now.";
          throw new Error(msg);
        }
        if (active) setResult(body.data);
      } catch (error) {
        if (error && error.name === "AbortError") return;
        if (active) setApiError(error.message || "Something went wrong.");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBasicDetails, placeText, birthDetails?.latitude, birthDetails?.longitude, birthDetails?.timeZone, birthDetails?.utcOffsetMinutes]);

    const needsBirthDetails = !hasBasicDetails;

  const placeLabel =
    (payloadUsed || birthDetails || {}).place ||
    [birthDetails?.city || payloadUsed?.city, birthDetails?.country || payloadUsed?.country]
      .filter(Boolean)
      .join(", ") ||
    "your saved location";

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0b0416] via-[#150829] to-[#0b0416] relative overflow-hidden">
      {/* Cosmic glow accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-purple-700/20 blur-[110px]" />
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-fuchsia-700/15 blur-[110px]" />
      </div>

      <div className="relative z-10 pt-40 pb-20 px-4 lg:px-8 max-w-6xl mx-auto">
        {/* ================= HERO ================= */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 text-[11px] font-bold uppercase tracking-[0.3em]">
            ✦ Live Sky · Swiss Ephemeris
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-300">
            Planetary Changes
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-purple-200/80 text-sm md:text-base leading-relaxed">
            Live planetary movements, retrogrades, sign changes &amp; upcoming
            transits — calculated right now for {placeLabel}, using your saved
            birth/profile location and time zone{user?.displayName ? ` for ${user.displayName}` : ""}. No form to fill.
          </p>
          {hasBasicDetails && payloadUsed && (
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-purple-300/60">
              Chart moment · {payloadUsed.date} {payloadUsed.time}
              {payloadUsed.timeZone ? ` · ${payloadUsed.timeZone}` : ""} · auto-refreshed on open
            </p>
          )}
        </div>

        {/* --- No birth details: clean call-to-action card --- */}
        {needsBirthDetails && (
          <div className="rounded-3xl border border-purple-500/25 bg-purple-950/40 backdrop-blur-md p-8 md:p-12 text-center">
            <div className="text-5xl md:text-6xl mb-4">🪐</div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-violet-300 mb-3">
              Complete Your Birth Details
            </h2>
            <p className="mt-3 text-purple-200/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              To show your personal transit chart we need your birth date, birth
              time and birth place. These are saved in your browser only and are
              used to set your moment, location and time zone automatically.
            </p>
            <button
              type="button"
              onClick={() => navigate("/birth-details")}
              className="mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-fuchsia-600 to-purple-700 shadow-[0_0_25px_rgba(192,38,211,0.45)] hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(192,38,211,0.65)] transition-all duration-300"
            >
              Complete Birth Details
            </button>
          </div>
        )}

        {/* --- Loading: real ephemeris calculation --- */}
        {!needsBirthDetails && loading && (
          <div className="rounded-3xl border border-purple-500/30 bg-purple-950/40 backdrop-blur-md shadow-[0_0_50px_rgba(126,34,206,0.25)] p-8 md:p-10 flex flex-col items-center gap-4">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-fuchsia-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                🪐
              </div>
            </div>
            <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest">
              Calculating planetary positions…
            </p>
            <p className="text-purple-300/70 text-xs">
              Consulting the Swiss Ephemeris for this moment in {placeLabel}.
            </p>
          </div>
        )}

        {/* --- Error */}
        {!needsBirthDetails && apiError && !loading && (
          <div className="rounded-3xl border border-rose-500/40 bg-rose-950/30 backdrop-blur-md shadow-[0_0_40px_rgba(244,63,94,0.2)] p-6 md:p-8 text-center">
            <p className="text-rose-200 font-bold text-lg">
              Could not calculate the chart
            </p>
            <p className="mt-2 text-sm text-rose-200/85">{apiError}</p>
            <button
              type="button"
              onClick={() => navigate("/birth-details")}
              className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-purple-200 border border-purple-500/40 hover:border-fuchsia-400/70 hover:text-fuchsia-300 transition-all duration-300"
            >
              Update Birth Details
            </button>
          </div>
        )}

        {/* --- Result: premium circular transit chart (visual centerpiece) --- */}
        {!needsBirthDetails && result && !loading && !apiError && (
          <div className="mt-6">
            <TransitResult result={result} />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/birth-details"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-purple-200 border border-purple-500/40 hover:border-fuchsia-400/70 hover:text-fuchsia-300 transition-all duration-300"
              >
                Update Birth Details
              </Link>
              <span className="text-[11px] text-purple-300/50">
                Showing live sky for {placeLabel} · {payloadUsed?.date} {payloadUsed?.time}
                {payloadUsed?.timeZone ? ` (${payloadUsed.timeZone})` : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlanetaryChanges;


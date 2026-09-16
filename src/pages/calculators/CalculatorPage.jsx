/**
 * PlutoAstro — Calculators
 * Individual calculator page: cosmic hero + reusable form +
 * premium result card. The calculation itself ALWAYS happens on
 * the backend (POST /api/calculators/:endpoint) — this page only
 * collects input and renders the authoritative response.
 */

import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CalculatorForm from "../../components/calculators/CalculatorForm";
import ResultCard, { ShareBar } from "../../components/calculators/ResultCard";
import {
  NumerologyResult,
  MoonSignResult,
  SunSignResult,
  RashiResult,
  AscendantResult,
  AyanamsaResult,
  NakshatraResult,
  LoveCompatibilityResult,
  FriendshipResult,
} from "../../components/calculators/ResultRenderers";
import {
  CALCULATORS,
  CALCULATOR_API,
  calculatorBySlug,
  calculatorTitle,
} from "../../utils/calculators";

const RENDERERS = {
  numerology: NumerologyResult,
  "moon-sign": MoonSignResult,
  "sun-sign": SunSignResult,
  rashi: RashiResult,
  ascendant: AscendantResult,
  ayanamsa: AyanamsaResult,
  nakshatra: NakshatraResult,
  "love-calculator": LoveCompatibilityResult,
  "friendship-calculator": FriendshipResult,
};

const RESULT_SUBTITLES = {
  numerology: "Computed digit by digit — no random numbers",
  "moon-sign": "Real Moon position from the Swiss Ephemeris",
  "sun-sign": "Real Sun longitude at your birth moment",
  rashi: "Sidereal Moon — Lahiri ayanamsa",
  ascendant: "Computed for your exact time and coordinates",
  ayanamsa: "All ten classical systems compared",
  nakshatra: "From the sidereal Moon position",
  "love-calculator": "Guna Milan + real synastry aspects",
  "friendship-calculator": "Real chart-to-chart contacts",
};

/** Plain-text summary of a result — used by the copy/share buttons. */
const buildShareText = (slug, result) => {
  const lines = [];
  const push = (label, value) => value != null && value !== "" && lines.push(`${label}: ${value}`);

  if (slug === "numerology") {
    const n = result.numbers || {};
    push("Life Path", n.lifePath?.number);
    push("Birthday", n.birthday?.number);
    push("Expression/Destiny", n.expression?.number);
    push("Soul Urge", n.soulUrge?.number);
    push("Personality", n.personality?.number);
  } else if (slug === "moon-sign") {
    push("Moon sign", `${result.moon?.sign?.name} ${result.moon?.formatted}`);
    push("Element", result.moon?.sign?.element);
  } else if (slug === "sun-sign") {
    push("Sun sign", `${result.sun?.sign?.name} ${result.sun?.formatted}`);
  } else if (slug === "rashi") {
    push("Rashi", `${result.rashi?.name} (${result.rashi?.sanskrit}) ${result.rashi?.formatted}`);
    push("Nakshatra", `${result.nakshatra?.name} pada ${result.nakshatra?.pada}`);
    push("Ayanamsa", `${result.ayanamsa?.name} ${result.ayanamsa?.value}°`);
  } else if (slug === "ascendant") {
    push("Ascendant", `${result.ascendant?.sign?.name} ${result.ascendant?.formatted}`);
    push("Sidereal Lagna", `${result.siderealLagna?.sign?.name} ${result.siderealLagna?.formatted}`);
  } else if (slug === "ayanamsa") {
    push("System", result.selected?.name);
    push("Ayanamsa", `${result.selected?.value}°`);
    push("Date", result.input?.date);
  } else if (slug === "nakshatra") {
    push("Nakshatra", `${result.nakshatra?.name} pada ${result.nakshatra?.pada}`);
    push("Ruling planet", result.nakshatra?.lord);
    push("Moon degree", result.nakshatra?.formatted);
  } else if (slug === "love-calculator" || slug === "friendship-calculator") {
    push("Score", `${result.score?.value}% — ${result.score?.label}`);
    if (result.communication) push("Communication", `${result.communication.score}% — ${result.communication.label}`);
    push("Guna Milan", result.gunaMilan ? `${result.gunaMilan.total}/${result.gunaMilan.max}` : null);
  }

  return lines.length ? `${lines.join("\n")}\n\nCalculated with PlutoAstro` : "My PlutoAstro result";
};

const CalculatorPage = () => {
  const { slug } = useParams();
  const calc = calculatorBySlug(slug);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const resultRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    document.title = calculatorTitle(calc);
    setLoading(false);
    setResult(null);
    setApiError(null);
  }, [calc]);

  useEffect(() => {
    return () => {
      if (requestRef.current) requestRef.current.abort();
    };
  }, []);

  if (!calc) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#0b0416] via-[#150829] to-[#0b0416] pt-40 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center rounded-3xl border border-purple-500/30 bg-purple-950/40 backdrop-blur-md p-10">
          <p className="text-5xl">🌠</p>
          <h1 className="mt-4 text-2xl font-extrabold text-white">This calculator drifted away</h1>
          <p className="mt-2 text-sm text-purple-200/70">
            We couldn't find a calculator at{" "}
            <span className="text-fuchsia-300">/calculators/{slug}</span>.
          </p>
          <Link
            to="/calculators"
            className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-fuchsia-600 to-purple-700 shadow-[0_0_25px_rgba(192,38,211,0.45)] hover:scale-105 transition-all duration-300"
          >
            Browse All Calculators
          </Link>
        </div>
      </section>
    );
  }

  const handleCalculate = async (payload) => {
    if (loading) return; // duplicate-submission guard
    setLoading(true);
    setApiError(null);
    setResult(null);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const res = await fetch(`${CALCULATOR_API}${calc.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      let body = null;
      try {
        body = await res.json();
      } catch (parseError) {
        throw new Error("The server returned an unreadable response. Please try again.");
      }
      if (!res.ok || !body || !body.success) {
        const firstError =
          body && Array.isArray(body.errors) && body.errors.length
            ? body.errors[0].message
            : "The calculation could not be completed. Please check your details and try again.";
        throw new Error(firstError);
      }
      setResult(body.data);
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    } catch (error) {
      if (error && error.name === "AbortError") return;
      setApiError(
        (error && error.message) || "Something went wrong while contacting the calculation engine."
      );
    } finally {
      setLoading(false);
      requestRef.current = null;
    }
  };

  const handleReset = () => {
    if (requestRef.current) requestRef.current.abort();
    setResult(null);
    setApiError(null);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ResultBody = RENDERERS[calc.slug];

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0b0416] via-[#150829] to-[#0b0416] relative overflow-hidden">
      {/* Cosmic glow accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-purple-700/20 blur-[110px]" />
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-fuchsia-700/15 blur-[110px]" />
      </div>

      <div className="relative z-10 pt-40 pb-20 px-4 lg:px-8 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <Link
          to="/calculators"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-300/70 hover:text-fuchsia-300 transition-colors duration-300"
        >
          ← All Calculators
        </Link>

        {/* Hero */}
        <div className="mt-5 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-5xl drop-shadow-[0_0_15px_rgba(192,132,252,0.6)]">
              {calc.icon}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-300">
              {calc.name}
            </h1>
          </div>
          <p className="mt-3 max-w-3xl text-purple-200/80 text-sm md:text-base leading-relaxed">
            {calc.about}
          </p>
        </div>

        {/* Form */}
        <CalculatorForm
          calc={calc}
          loading={loading}
          onCalculate={handleCalculate}
          onReset={handleReset}
        />

        {/* Result */}
        <div ref={resultRef} className="mt-10 scroll-mt-36">
          <ResultCard
            title={result ? "Your Result" : null}
            subtitle={result ? RESULT_SUBTITLES[calc.slug] : null}
            loading={loading}
            error={apiError}
          >
            {result && ResultBody && !loading && !apiError ? (
              <>
                <ResultBody result={result} />
                <ShareBar text={buildShareText(calc.slug, result)} title={`${calc.name} — PlutoAstro`} />
                <div className="mt-6 pt-5 border-t border-purple-500/20">
                  <p className="text-[11px] text-purple-300/50 leading-relaxed">
                    Calculated on the PlutoAstro server with the Swiss Ephemeris for the exact
                    moment, place and time zone above. Interpretations are for guidance and
                    entertainment — your choices write your story. Nothing you entered is stored.
                  </p>
                </div>
              </>
            ) : null}
          </ResultCard>
        </div>

        {/* Other calculators */}
        <div className="mt-14">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-300/80 mb-4">
            ✦ Explore More Calculators
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {CALCULATORS.filter((entry) => entry.slug !== calc.slug).map((entry) => (
              <Link
                key={entry.slug}
                to={`/calculators/${entry.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-2 text-xs font-semibold text-purple-200 hover:border-fuchsia-400/70 hover:text-fuchsia-300 hover:shadow-[0_0_20px_rgba(192,38,211,0.25)] transition-all duration-300"
              >
                <span>{entry.icon}</span>
                {entry.short}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorPage;

/**
 * PlutoAstro — Calculators
 * Landing page: premium cosmic grid of every calculator.
 * Copy comes from the single registry (src/utils/calculators.js).
 */

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CALCULATORS, calculatorTitle } from "../../utils/calculators";

const CalculatorsHome = () => {
  useEffect(() => {
    document.title = calculatorTitle(null);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0b0416] via-[#150829] to-[#0b0416] relative overflow-hidden">
      {/* Cosmic glow accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-700/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-700/15 blur-[110px]" />
      </div>

      <div className="relative z-10 pt-40 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
        {/* ================= HERO ================= */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 text-[11px] font-bold uppercase tracking-[0.3em]">
            Cosmic Tools
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-300">
            Astrology Calculators
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-purple-200/80 text-sm md:text-base leading-relaxed">
            Real astronomical calculations — every chart position is computed from the Swiss
            Ephemeris for your exact birth moment, place and time zone. Nothing is guessed,
            nothing is stored.
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.slug}
              to={`/calculators/${calc.slug}`}
              className="group relative rounded-3xl border border-purple-500/25 bg-purple-950/40 backdrop-blur-md p-6 shadow-[0_0_35px_rgba(126,34,206,0.18)] hover:border-fuchsia-400/60 hover:shadow-[0_0_50px_rgba(192,38,211,0.35)] hover:-translate-y-1.5 transition-all duration-300"
            >
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${calc.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
              />
              <div className="flex items-start justify-between">
                <span className="text-3xl md:text-4xl drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]">
                  {calc.icon}
                </span>
                <span className="text-fuchsia-300/0 group-hover:text-fuchsia-300/90 transition-all duration-300 text-lg">
                  →
                </span>
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">{calc.name}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-300/80">
                {calc.tagline}
              </p>
              <p className="mt-3 text-sm text-purple-200/70 leading-relaxed line-clamp-3">
                {calc.about}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-purple-300 group-hover:text-fuchsia-300 transition-colors duration-300">
                ✦ Open Calculator
              </span>
            </Link>
          ))}
        </div>

        {/* ================= FOOTNOTE ================= */}
        <p className="mt-12 text-center text-xs text-purple-300/50 max-w-2xl mx-auto leading-relaxed">
          Vedic (sidereal) results use the Lahiri ayanamsa. Western results use the tropical
          zodiac. Your birth details are sent only to compute your result and are never saved.
        </p>
      </div>
    </section>
  );
};

export default CalculatorsHome;

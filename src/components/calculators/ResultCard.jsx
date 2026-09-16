/**
 * PlutoAstro — Calculators (frontend)
 * Reusable result display: loading / error / premium result
 * card with copy + share actions. Matches the existing
 * cosmic purple/violet visual language.
 */

import React, { useState } from "react";

export const ResultShell = ({ title, subtitle, loading, error, children }) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-purple-500/30 bg-purple-950/40 backdrop-blur-md shadow-[0_0_50px_rgba(126,34,206,0.25)] p-8 md:p-10 flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-fuchsia-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">✨</div>
        </div>
        <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest">
          Consulting the stars…
        </p>
        <p className="text-purple-300/70 text-xs">
          Computing real ephemeris positions for your birth moment.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/40 bg-rose-950/30 backdrop-blur-md shadow-[0_0_40px_rgba(244,63,94,0.2)] p-6 md:p-8">
        <p className="text-rose-200 font-bold text-lg">Something went wrong</p>
        <p className="text-rose-200/80 text-sm mt-2">{error}</p>
        <p className="text-purple-300/60 text-xs mt-3">
          Check your birth details and try again. Nothing was saved.
        </p>
      </div>
    );
  }

  if (!children) return null;

  return (
    <div className="rounded-3xl border border-purple-500/30 bg-purple-950/40 backdrop-blur-md shadow-[0_0_50px_rgba(126,34,206,0.25)] overflow-hidden">
      {(title || subtitle) && (
        <div className="px-6 md:px-8 pt-6 md:pt-8">
          {title && (
            <h2 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-300">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-purple-300/80 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
};

/** Big hero number/sign at the top of a result */
export const HeroBadge = ({ icon, label, value, sub }) => (
  <div className="flex flex-col items-center text-center gap-1 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-b from-fuchsia-600/20 to-purple-900/20 px-6 py-6 shadow-[0_0_40px_rgba(192,38,211,0.3)]">
    {icon && <div className="text-4xl md:text-5xl">{icon}</div>}
    {label && (
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-fuchsia-300/90 mt-2">
        {label}
      </p>
    )}
    <p className="text-2xl md:text-4xl font-extrabold text-white">{value}</p>
    {sub && <p className="text-purple-300/80 text-sm mt-1">{sub}</p>}
  </div>
);

/** Small key/value tile grid */
export const FactGrid = ({ facts }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    {facts
      .filter((fact) => fact && fact.value !== null && fact.value !== undefined && fact.value !== "")
      .map((fact, index) => (
        <div
          key={`${fact.label}-${index}`}
          className="rounded-xl border border-purple-500/20 bg-white/5 px-3 py-2.5"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300/70">
            {fact.label}
          </p>
          <p className="text-sm font-semibold text-purple-100 mt-0.5 break-words">{fact.value}</p>
        </div>
      ))}
  </div>
);

/** Copy + share buttons for a result */
export const ShareBar = ({ text, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || "My PlutoAstro result", text });
      } catch (err) {
        /* user dismissed — nothing to do */
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-5">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-purple-100 border border-purple-500/40 hover:border-fuchsia-400/70 hover:text-fuchsia-300 transition-all duration-300"
      >
        {copied ? "✓ Copied" : "⧉ Copy result"}
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-purple-100 border border-purple-500/40 hover:border-fuchsia-400/70 hover:text-fuchsia-300 transition-all duration-300"
      >
        ↗ Share
      </button>
    </div>
  );
};

/** Score ring for compatibility results */
export const ScoreRing = ({ score, label, tone }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const offset = circumference - (clamped / 100) * circumference;
  const toneColor =
    tone === "glowing"
      ? "#e879f9"
      : tone === "positive"
        ? "#c084fc"
        : tone === "warm"
          ? "#a78bfa"
          : tone === "balanced"
            ? "#818cf8"
            : "#fb7185";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={toneColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${toneColor})`, transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white">{clamped}</span>
          <span className="text-[10px] uppercase tracking-widest text-purple-300/70">/ 100</span>
        </div>
      </div>
      {label && <p className="text-lg font-bold text-white">{label}</p>}
    </div>
  );
};

/** Bullet list with cosmic markers */
export const CosmicList = ({ items, marker = "✦" }) => {
  if (!items || !items.length) return null;
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-sm text-purple-100/90 leading-relaxed">
          <span className="text-fuchsia-400 shrink-0 mt-0.5">{marker}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

/** Section heading inside a result card */
export const ResultSection = ({ title, children }) => (
  <div className="mt-6 first:mt-5">
    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300/90 mb-3">
      {title}
    </h3>
    {children}
  </div>
);

export default ResultShell;


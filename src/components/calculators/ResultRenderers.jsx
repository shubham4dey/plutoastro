/**
 * PlutoAstro — Calculators (frontend)
 * One renderer per calculator. Each takes the API result object
 * and returns a premium cosmic-styled result card body.
 * Shared primitives come from ResultCard.jsx.
 */

import React from "react";
import { HeroBadge, FactGrid, CosmicList, ResultSection } from "./ResultCard";
import TransitWheel from "./TransitWheel";

/* ---------- shared birth meta ---------- */
const formatOffset = (minutes) => {
  if (minutes === null || minutes === undefined || !Number.isFinite(Number(minutes))) return null;
  const value = Number(minutes);
  const sign = value < 0 ? "-" : "+";
  const abs = Math.abs(value);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const mins = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${mins}`;
};

const BirthMeta = ({ input, birthLabel }) => {
  if (!input) return null;
  const place = [input.city || input.region, input.country].filter(Boolean).join(", ");
  const offsetLabel = formatOffset(input.utcOffsetMinutes);
  const tz =
    input.timeZone && offsetLabel
      ? `${input.timeZone} (${offsetLabel})`
      : input.timeZone || offsetLabel || "—";
  const local = `${input.date} ${input.time}`;
  return (
    <div className="text-xs text-purple-300/60 space-y-0.5">
      <p>🌍 <span className="text-purple-200/80">{birthLabel ? birthLabel + " place:" : "Birth place:"}</span> {place || input.place || "—"}</p>
      <p>⏰ <span className="text-purple-200/80">Local time:</span> {local}</p>
      <p>🌐 <span className="text-purple-200/80">Time zone:</span> {tz}</p>
      {input.latitude != null && input.longitude != null && (
        <p>🧭 <span className="text-purple-200/80">Coordinates:</span> {Number(input.latitude).toFixed(4)}°, {Number(input.longitude).toFixed(4)}°</p>
      )}
    </div>
  );
};

/* ---------- Numerology ---------- */
const numberBlock = (entry) => {
  if (!entry || entry.number === null || entry.number === undefined) return null;
  const steps = entry.calculation?.steps || [];
  return (
    <div className="rounded-xl border border-purple-500/20 bg-white/5 p-4">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-violet-300">
          {entry.number}
        </span>
        <div>
          <p className="text-sm font-bold text-purple-100">{entry.label}</p>
          {entry.title && <p className="text-xs text-fuchsia-300/90 font-semibold">{entry.title}</p>}
        </div>
      </div>
      {entry.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {entry.keywords.map((keyword) => (
            <span
              key={keyword}
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-200/80"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
      {steps.length > 0 && (
        <div className="mt-3 rounded-lg bg-black/30 border border-purple-500/15 px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-purple-300/60 mb-1">Calculation</p>
          {steps.map((step, index) => (
            <p key={index} className="text-xs text-purple-100/80 font-mono leading-relaxed">
              {step}
            </p>
          ))}
        </div>
      )}
      {entry.interpretation && (
        <p className="text-sm text-purple-100/90 leading-relaxed mt-3">{entry.interpretation}</p>
      )}
    </div>
  );
};

export const NumerologyResult = ({ result }) => {
  if (!result) return null;
  const numbers = result.numbers || {};
  const facts = [
    { label: "Birthday Number", value: numbers.birthday?.number },
    { label: "Expression / Destiny", value: numbers.expression?.number },
    { label: "Soul Urge", value: numbers.soulUrge?.number },
    { label: "Personality", value: numbers.personality?.number },
    { label: "Maturity", value: numbers.maturity?.number },
    { label: "System", value: result.system?.name },
  ];
  return (
    <div className="flex flex-col gap-4">
      <HeroBadge
        icon="🔢"
        label="Life Path Number"
        value={numbers.lifePath?.number}
        sub={numbers.lifePath?.title}
      />
      <FactGrid facts={facts} />
      {result.highlights?.length > 0 && (
        <ResultSection title="Highlights">
          <CosmicList items={result.highlights} />
        </ResultSection>
      )}
      <ResultSection title="Life Path — Interpretation">
        <p className="text-sm text-purple-100/90 leading-relaxed">
          {numbers.lifePath?.interpretation}
        </p>
      </ResultSection>
      <ResultSection title="Every Number, With Its Calculation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["lifePath", "birthday", "expression", "soulUrge", "personality", "maturity"]
            .map((key) => numberBlock(numbers[key]))
            .filter(Boolean)}
        </div>
      </ResultSection>
      {result.notes?.length > 0 && (
        <ResultSection title="Notes">
          <CosmicList items={result.notes} marker="ℹ" />
        </ResultSection>
      )}
      <ResultSection title="Your Input">
        <div className="text-xs text-purple-300/60 space-y-0.5">
          <p>
            🧑 <span className="text-purple-200/80">Name:</span>{" "}
            {result.input?.fullName || "— (name numbers need a full name)"}
          </p>
          <p>
            📅 <span className="text-purple-200/80">Date of birth:</span> {result.input?.dateOfBirth}
          </p>
          <p>
            📐 <span className="text-purple-200/80">Letter system:</span> {result.system?.name}
          </p>
        </div>
      </ResultSection>
    </div>
  );
};

/* ---------- Moon Sign ---------- */
export const MoonSignResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className="flex flex-col gap-4">
      <HeroBadge icon="🌙" label="Moon in" value={result.moon.sign.name} sub={`${result.moon.sign.element} — ${result.moon.sign.modality}`} />
      <FactGrid
        facts={[
          { label: "Degree", value: result.moon.formatted },
          { label: "Ruler", value: result.moon.sign.ruler },
          { label: "Speed", value: result.moon.retrograde ? `Retrograde ${result.moon.speed.toFixed(3)}°/day` : `${result.moon.speed.toFixed(3)}°/day` },
          { label: "Approximate Range", value: result.moon.sign.approximateRange },
        ]}
      />
      <ResultSection title="Interpretation">
        <p className="text-sm text-purple-100/90 leading-relaxed">{result.interpretation.text}</p>
      </ResultSection>
      <ResultSection title="Time & Location">
        <BirthMeta input={result.input} />
      </ResultSection>
    </div>
  );
};

/* ---------- Sun Sign ---------- */
export const SunSignResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className="flex flex-col gap-4">
      <HeroBadge icon="☀️" label="Sun in" value={result.sun.sign.name} sub={`${result.sun.sign.element} — ${result.sun.sign.modality}`} />
      <FactGrid
        facts={[
          { label: "Degree", value: result.sun.formatted },
          { label: "Ruler", value: result.sun.sign.ruler },
          { label: "Approximate Range", value: result.sun.sign.approximateRange || "—" },
        ]}
      />
      {result.note && (
        <ResultSection title="Note">
          <p className="text-xs text-purple-300/70 leading-relaxed">{result.note}</p>
        </ResultSection>
      )}
      <ResultSection title="Interpretation">
        <p className="text-sm text-purple-100/90 leading-relaxed">{result.interpretation.text}</p>
      </ResultSection>
      <ResultSection title="Your Birth Details">
        <BirthMeta input={result.input} />
      </ResultSection>
    </div>
  );
};

export { BirthMeta };

/* ---------- Rashi ---------- */
export const RashiResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className="flex flex-col gap-4">
      <HeroBadge icon="♒" label="Rashi" value={result.rashi.name} sub={result.rashi.sanskrit} />
      <FactGrid
        facts={[
          { label: "Degree", value: result.rashi.formatted },
          { label: "Ruler", value: result.rashi.ruler },
          { label: "Element", value: result.rashi.element },
          { label: "Modality", value: result.rashi.modality },
          { label: "Varna", value: result.rashi.varna },
          { label: "Vashya", value: result.vashya || "—" },
        ]}
      />
      <ResultSection title="Birth Nakshatra">
        <FactGrid
          facts={[
            { label: "Nakshatra", value: result.nakshatra.name },
            { label: "Pada", value: `${result.nakshatra.pada} of 4` },
            { label: "Lord", value: result.nakshatra.lord },
          ]}
        />
      </ResultSection>
      <ResultSection title="Ayanamsa">
        <FactGrid facts={[
          { label: "System", value: result.ayanamsa.name },
          { label: "Value", value: `${result.ayanamsa.value.toFixed(4)}°` },
          { label: "Key", value: result.ayanamsa.key },
        ]} />
      </ResultSection>
      <ResultSection title="Interpretation">
        <p className="text-sm text-purple-100/90 leading-relaxed">{result.interpretation.text}</p>
      </ResultSection>
      <ResultSection title="Your Birth Details">
        <BirthMeta input={result.input} />
      </ResultSection>
    </div>
  );
};

/* ---------- Ascendant ---------- */
export const AscendantResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className="flex flex-col gap-4">
      <HeroBadge
        icon="🌅"
        label="Ascendant"
        value={result.ascendant.sign.name}
        sub={`${result.ascendant.sign.element} — ${result.ascendant.sign.modality}`}
      />
      <FactGrid
        facts={[
          { label: "Degree", value: result.ascendant.formatted },
          { label: "Ruler", value: result.ascendant.sign.ruler },
          { label: "Midheaven", value: `${result.midheaven.sign} (${result.midheaven.formatted})` },
          { label: "Sidereal Lagna", value: `${result.siderealLagna.sign.name} ${result.siderealLagna.formatted}` },
        ]}
      />
      <ResultSection title="Interpretation">
        <p className="text-sm text-purple-100/90 leading-relaxed">{result.interpretation.text}</p>
      </ResultSection>
      <ResultSection title="Your Birth Details">
        <BirthMeta input={result.input} />
                <p className="text-xs text-purple-300/60 mt-1">House system: {result.houseSystem || "Placidus"}</p>
      </ResultSection>
    </div>
  );
};

/* ---------- Ayanamsa ---------- */
export const AyanamsaResult = ({ result }) => {
  if (!result) return null;
  const { selected, comparison, explanation, time } = result;
  return (
    <div className="flex flex-col gap-4">
      <HeroBadge
        icon="📐"
        label={selected.name}
        value={`${selected.value.toFixed(4)}°`}
        sub="Used for all Vedic calculations on PlutoAstro"
      />
      <FactGrid
        facts={[
          { label: "System", value: selected.name },
          { label: "Value (DMS)", value: `${selected.dms.degrees}° ${selected.dms.minutes}' ${selected.dms.seconds}"` },
          {
            label: "UTC Time",
            value: `${time.utc.year}-${String(time.utc.month).padStart(2, "0")}-${String(time.utc.day).padStart(2, "0")} ${String(time.utc.hour).padStart(2, "0")}:${String(time.utc.minute).padStart(2, "0")} UTC`,
          },
          { label: "Offset", value: time.offsetLabel },
          { label: "DST", value: time.isDst ? "Yes" : "No" },
        ]}
      />
      <ResultSection title="How It Works">
        <p className="text-sm text-purple-100/90 leading-relaxed">{explanation}</p>
      </ResultSection>
      <ResultSection title="All Ayanamsa Systems at This Moment">
        <div className="max-h-80 overflow-y-auto border border-purple-500/20 rounded-lg">
          <table className="w-full text-xs text-purple-100/80">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="text-left py-2 px-3 text-purple-300">System</th>
                <th className="text-right py-2 px-3 text-purple-300">Value</th>
                <th className="text-right py-2 px-3 text-purple-300">DMS</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item) => (
                <tr key={item.key} className="border-b border-purple-500/10">
                  <td className="py-1.5 px-3">{item.name}</td>
                  <td className="text-right py-1.5 px-3">{item.value.toFixed(4)}°</td>
                  <td className="text-right py-1.5 px-3">
                    {item.dms.degrees}° {item.dms.minutes}' {item.dms.seconds}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultSection>
    </div>
  );
};

/* ---------- Nakshatra ---------- */
export const NakshatraResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className="flex flex-col gap-4">
      <HeroBadge
        icon="✨"
        label="Birth Nakshatra"
        value={result.nakshatra.name}
        sub={`Pada ${result.nakshatra.pada} of 4 · Lord: ${result.nakshatra.lord}`}
      />
      <FactGrid
        facts={[
          { label: "Sanskrit", value: result.nakshatra.sanskrit },
          { label: "Index", value: result.nakshatra.index },
          { label: "Degree", value: result.nakshatra.formatted },
          { label: "Rashi", value: result.rashi?.name || "—" },
          { label: "Deity", value: result.nakshatra.deity },
          { label: "Gana", value: result.nakshatra.gana },
          { label: "Yoni", value: result.nakshatra.yoni },
          { label: "Nadi", value: result.nakshatra.nadi },
        ]}
      />
            <ResultSection title="Ayanamsa">
        <FactGrid facts={[
          { label: "System", value: result.ayanamsa.name },
          { label: "Value", value: `${result.ayanamsa.value.toFixed(4)}°` },
        ]} />
      </ResultSection>
      <ResultSection title="Interpretation">
        <p className="text-sm text-purple-100/90 leading-relaxed">{result.interpretation.text}</p>
      </ResultSection>
      <ResultSection title="Your Birth Details">
        <BirthMeta input={result.input} />
      </ResultSection>
    </div>
  );
};

/* ---------- Love Compatibility ---------- */
export const LoveCompatibilityResult = ({ result }) => {
  if (!result) return null;
  const { score, gunaMilan, strengths, challenges, people } = result;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <div className="text-center">
          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-300">{score.value}%</div>
          <p className="text-xl font-bold text-white mt-1">{score.label}</p>
          <p className="text-xs text-purple-300/70">{gunaMilan.percentage}% Ashtakoota · {score.tone} match</p>
        </div>
      </div>
      <ResultSection title="Compatibility Score">
        <p className="text-sm text-purple-100/90 leading-relaxed">{score.interpretation}</p>
      </ResultSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ResultSection title="Strengths"><CosmicList items={strengths} marker="✦" /></ResultSection>
        <ResultSection title="Challenges"><CosmicList items={challenges} marker="⚠" /></ResultSection>
      </div>
      <ResultSection title="Ashtakoota (Guna Milan) Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-purple-100/80">
            <thead>
              <tr className="border-b border-purple-500/30">
                <th className="text-left py-2 text-purple-300">Kuta</th>
                <th className="text-center py-2 text-purple-300">Score</th>
                <th className="text-center py-2 text-purple-300">/ Max</th>
                <th className="text-left py-2 text-purple-300">Method</th>
              </tr>
            </thead>
            <tbody>
              {gunaMilan.kutas.map((k) => (
                <tr key={k.key} className="border-b border-purple-500/10">
                  <td className="py-1.5">{k.name}</td>
                  <td className="text-center py-1.5">{k.points}</td>
                  <td className="text-center py-1.5">{k.maxPoints}</td>
                  <td className="py-1.5 text-purple-300/60 max-w-xs">{k.detail}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-purple-500/30">
                <td className="py-2 font-bold">Total</td>
                <td className="text-center py-2 font-bold">{gunaMilan.total}</td>
                <td className="text-center py-2 font-bold">{gunaMilan.max}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-purple-300/60 mt-2">{gunaMilan.method}</p>
      </ResultSection>
      <ResultSection title="Both People">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-300/60">
          {Object.values(people).map((p) => (<BirthMeta key={p.label} input={p.birth} />))}
        </div>
      </ResultSection>
    </div>
  );
};

/* ---------- Friendship Compatibility ---------- */
export const FriendshipResult = ({ result }) => {
  if (!result) return null;
  const { score, communication, strengths, differences, people } = result;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <div className="text-center">
          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-200 to-violet-300">{score.value}%</div>
          <p className="text-xl font-bold text-white mt-1">{score.label}</p>
          <p className="text-xs text-purple-300/70">Communication: {communication.score}% · {communication.label}</p>
        </div>
      </div>
      <ResultSection title="Compatibility Score">
        <p className="text-sm text-purple-100/90 leading-relaxed">{score.interpretation}</p>
      </ResultSection>
      <ResultSection title="Communication Compatibility">
        <p className="text-sm text-purple-100/90 leading-relaxed">{communication.detail}</p>
      </ResultSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ResultSection title="Friendship Strengths"><CosmicList items={strengths} marker="✦" /></ResultSection>
        <ResultSection title="Potential Differences"><CosmicList items={differences} marker="⚠" /></ResultSection>
      </div>
      <ResultSection title="Both People">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-300/60">
          {Object.values(people).map((p) => (<BirthMeta key={p.label} input={p.birth} />))}
        </div>
      </ResultSection>
    </div>
  );
};

/* ---------- Planetary Transits / Transit Chart ---------- */
export const TransitResult = ({ result }) => {
  if (!result) return null;
  const {
    tropicalWheel = [],
    retrogradeBodies = [],
    signChanges = [],
    upcomingTransits = [],
    summary,
    time,
    input,
    meta,
  } = result;

  const retroCount = retrogradeBodies.length;
  const changeCount = signChanges.length;
  const upcomingCount = upcomingTransits.length;

  const planetSymbols = {
    Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
    Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
    Rahu: "☊", Ketu: "☋",
  };

  const formatDeg = (deg) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg % 1) * 60);
    const s = Math.round(((deg % 1) * 60 % 1) * 60);
    return d + "°" + m.toString().padStart(2, "0") + "'" + s.toString().padStart(2, "0") + '"';
  };

  const pad2 = (n) => String(n ?? "").padStart(2, "0");
  const fmtWall = (w) => {
    if (w == null) return "—";
    if (typeof w === "string") return w;
    const d = w.date || (w.year != null ? w.year + "-" + pad2(w.month) + "-" + pad2(w.day) : "—");
    const t = w.time || (w.hour != null ? pad2(w.hour) + ":" + pad2(w.minute) : "");
    return (d + " " + t).trim();
  };
  const fmtUtc = (u) => {
    if (u == null) return "—";
    if (typeof u === "string") return u;
    if (u.year == null) return "—";
    return u.year + "-" + pad2(u.month) + "-" + pad2(u.day) + " " + pad2(u.hour) + ":" + pad2(u.minute) + " UTC";
  };

  const timeFacts = [
    { label: "Local time", value: fmtWall(time && time.local) + (time && time.abbreviation ? " " + time.abbreviation : "") },
    { label: "UTC", value: fmtUtc(time && time.utc) },
    { label: "Time zone", value: (time && time.timeZone) || "—" },
    { label: "UTC offset", value: (time && time.offsetLabel) || "—" },
    { label: "Julian day (UT)", value: time && time.julianDayUT != null ? String(time.julianDayUT) : "—" },
    { label: "DST active", value: time && time.isDst ? "Yes" : "No" },
  ];

  const summaryFacts = [
    { label: "Planets", value: String(tropicalWheel.length) },
    { label: "Retrograde now", value: retroCount > 0 ? String(retroCount) : "None" },
    { label: "Sign changes soon", value: changeCount > 0 ? String(changeCount) : "None" },
    { label: "Upcoming transits", value: String(upcomingCount) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <HeroBadge
        icon="🪐"
        label="Live Transit Positions"
        value={tropicalWheel.length + " planets"}
        sub={summary}
      />

      <div className="flex flex-col items-center gap-3">
        <TransitWheel
          wheel={tropicalWheel}
          retrogradeCount={retroCount}
          signChangeCount={changeCount}
        />
        <p className="text-center text-[11px] text-purple-300/50 max-w-md leading-relaxed">
          Tropical zodiac wheel showing where each planet sits right now for your
          selected moment, place and time zone. Larger circles = retrograde (Rx).
          {changeCount > 0 && (
            <span className="block text-amber-300/80 mt-1">
              ⚠ {changeCount} planet{changeCount > 1 ? "s are" : " is"} due to
              change sign soon — see below for timing.
            </span>
          )}
        </p>
      </div>

      <FactGrid facts={summaryFacts} />

      <ResultSection title="Current Planetary Positions">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-purple-100/80">
            <thead>
              <tr className="border-b border-purple-500/30">
                <th className="text-left py-2 text-purple-300">Planet</th>
                <th className="text-center py-2 text-purple-300">Sign</th>
                <th className="text-center py-2 text-purple-300">Deg in Sign</th>
                <th className="text-center py-2 text-purple-300">Longitude</th>
                <th className="text-center py-2 text-purple-300">Motion</th>
              </tr>
            </thead>
            <tbody>
              {tropicalWheel.map((p) => (
                <tr key={p.body} className="border-b border-purple-500/10">
                  <td className="py-1.5 font-semibold">
                    {p.symbol || planetSymbols[p.label] || p.body} {p.label}
                  </td>
                  <td className="text-center py-1.5">
                    {p.sign ? p.sign.symbol + " " + p.sign.name : "—"}
                  </td>
                  <td className="text-center py-1.5 font-mono">
                    {formatDeg(p.degreesInSign)}
                  </td>
                  <td className="text-center py-1.5 font-mono">
                    {p.longitude.toFixed(2)}°
                  </td>
                  <td className="text-center py-1.5">
                    {p.isRetrograde ? (
                      <span className="text-rose-300 font-bold">Retrograde</span>
                    ) : (
                      <span className="text-emerald-300">Direct</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultSection>

      {retroCount > 0 && (
        <ResultSection title="Retrograde Planets">
          <CosmicList
            items={retrogradeBodies.map((p) =>
              (p.symbol || planetSymbols[p.label] || "") + " " + p.label +
              " in " + (p.sign ? p.sign.name : "?") +
              " — moving backwards, urging review and inner work."
            )}
            marker="◐"
          />
        </ResultSection>
      )}

      {changeCount > 0 ? (
        <ResultSection title="Upcoming Sign Changes">
          <div className="space-y-2">
            {signChanges.map((sc, idx) => (
              <div
                key={sc.body + "-" + idx}
                className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-3 py-2"
              >
                <p className="text-sm font-semibold text-amber-200/90">
                  {sc.symbol || planetSymbols[sc.label] || ""} {sc.label} —{" "}
                  {sc.direction === "entering" ? "entering" : "leaving"} {sc.toSign} {sc.toSymbol}
                  {sc.dayOffset === 0
                    ? " today"
                    : sc.dayOffset > 0
                      ? " in " + sc.dayOffset + (sc.dayOffset > 1 ? "s" : "")
                      : " was " + Math.abs(sc.dayOffset) + " day" + (Math.abs(sc.dayOffset) > 1 ? "s" : "")}
                </p>
                <p className="text-[11px] text-purple-300/70 mt-0.5">
                  {sc.direction === "entering"
                    ? "From " + sc.fromSign + sc.fromSymbol + " into " + sc.toSign + sc.toSymbol
                    : "From " + sc.toSign + sc.toSymbol + " into " + sc.fromSign + sc.fromSymbol}
                </p>
              </div>
            ))}
          </div>
        </ResultSection>
      ) : (
        <ResultSection title="Upcoming Sign Changes">
          <p className="text-sm text-purple-200/70">
            No major sign changes expected in the near future.
          </p>
        </ResultSection>
      )}

      {upcomingCount > 0 ? (
        <ResultSection title="Upcoming Transits (Next 30 Days)">
          <div className="space-y-2.5">
            {upcomingTransits.map((t, idx) => (
              <div
                key={"transit-" + idx}
                className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/10 px-4 py-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-fuchsia-200">
                      {t.transitSymbol || planetSymbols[t.transitLabel] || ""} {t.transitLabel} {t.aspect} {t.natalLabel} {t.natalSymbol || ""}
                    </p>
                    <p className="text-[11px] text-purple-300/70 mt-0.5">
                      {t.transitSign
                        ? t.transitSign.symbol + " " + t.transitSign.name + " " + formatDeg((t.transitLongitude % 30 + 30) % 30)
                        : ""}
                      {" → "}
                      {t.natalSign
                        ? t.natalSign.symbol + " " + t.natalSign.name + " " + formatDeg((t.natalLongitude % 30 + 30) % 30)
                        : ""}
                    </p>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="inline-block rounded-full border border-fuchsia-500/30 bg-fuchsia-900/30 px-2 py-0.5 text-xs font-bold text-fuchsia-200">
                      {t.withinNextDays === 0 ? "Exact!" : "~" + t.withinNextDays + "d"}
                    </span>
                    <p className="text-purple-300/50 mt-0.5">orb: {t.orb.toFixed(2)}°</p>
                  </div>
                </div>
                {t.interpretation && (
                  <p className="text-xs text-purple-100/70 mt-1 leading-relaxed">
                    {t.interpretation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ResultSection>
      ) : (
        <ResultSection title="Upcoming Transits (Next 30 Days)">
          <p className="text-sm text-purple-200/70">
            No major transits to your natal planets occur in the next 30 days.
          </p>
        </ResultSection>
      )}

      <ResultSection title="Time & Location Details">
        <FactGrid facts={timeFacts} />
      </ResultSection>

      <ResultSection title="Your Birth Details">
        <BirthMeta input={input} />
      </ResultSection>

      {meta && (
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <p className="text-[10px] text-purple-300/40 leading-relaxed">
            Computed by the Swiss Ephemeris engine on the PlutoAstro server at{" "}
            {new Date(meta.generatedAt).toLocaleString()}.{" "}
            {meta.engine && typeof meta.engine === "string"
              ? meta.engine
              : meta.engine && meta.engine.name
                ? meta.engine.name + " v" + (meta.engine.version || "?")
                : ""}
            . Nothing you entered is stored.
          </p>
        </div>
      )}
    </div>
  );
};

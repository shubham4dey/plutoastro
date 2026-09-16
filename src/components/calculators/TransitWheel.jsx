import React from "react";

const ZODIAC = [
  { index: 0, name: "Aries", symbol: "♈", color: "#ef4444" },
  { index: 1, name: "Taurus", symbol: "♉", color: "#f59e0b" },
  { index: 2, name: "Gemini", symbol: "♊", color: "#eab308" },
  { index: 3, name: "Cancer", symbol: "♋", color: "#3b82f6" },
  { index: 4, name: "Leo", symbol: "♌", color: "#f97316" },
  { index: 5, name: "Virgo", symbol: "♍", color: "#a3e635" },
  { index: 6, name: "Libra", symbol: "♎", color: "#ec4899" },
  { index: 7, name: "Scorpio", symbol: "♏", color: "#8b5cf6" },
  { index: 8, name: "Sagittarius", symbol: "♐", color: "#10b981" },
  { index: 9, name: "Capricorn", symbol: "♑", color: "#6b7280" },
  { index: 10, name: "Aquarius", symbol: "♒", color: "#06b6d4" },
  { index: 11, name: "Pisces", symbol: "♓", color: "#a855f7" },
];

const PLANET_COLORS = {
  sun: "#fbbf24", moon: "#cbd5e1", mercury: "#94a3b8", venus: "#f472b6",
  mars: "#f87171", jupiter: "#fbbf24", saturn: "#a8a29e", uranus: "#38bdf8",
  neptune: "#6366f1", pluto: "#dc2626", truenode: "#f59e0b", ketu: "#94a3b8",
};
const TransitWheel = ({ wheel, retrogradeCount, signChangeCount }) => {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const R_OUTER = 130;
  const R_INNER = 78;
  const R_PLANET = 102;

  const signArcs = ZODIAC.map((s) => {
    const startAngle = s.index * 30 - 90;
    const endAngle = startAngle + 30;
    return { ...s, startAngle, endAngle };
  });

  const arcPath = (startDeg, endDeg) => {
    const r = R_OUTER;
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const planetAngle = (longitude) => {
    const lon = ((longitude % 360) + 360) % 360;
    return lon - 90;
  };

  const planetPos = (longitude) => {
    const angle = planetAngle(longitude);
    const rad = (angle * Math.PI) / 180;
    const x = cx + R_PLANET * Math.cos(rad);
    const y = cy + R_PLANET * Math.sin(rad);
    return { x, y };
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      <div className="flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[420px] drop-shadow-[0_0_30px_rgba(126,34,206,0.4)]" role="img" aria-label="Planetary transit wheel">
          <defs>
            <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
            <filter id="planetGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx={cx} cy={cy} r={172} fill="url(#wheelGlow)" />
          <circle cx={cx} cy={cy} r={R_OUTER} fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={R_INNER} fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="1.5" />
          {signArcs.map((s) => (<path key={s.index} d={arcPath(s.startAngle, s.endAngle)} fill="none" stroke={s.color} strokeOpacity={0.55} strokeWidth={10} strokeLinecap="round" />))}
          {signArcs.map((s) => (<path key={`t-${s.index}`} d={arcPath(s.startAngle + 1.5, s.endAngle - 1.5)} fill="none" stroke={s.color} strokeOpacity={0.22} strokeWidth={1} />))}
          {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
            const rad = (deg - 90) * Math.PI / 180;
            const x1 = cx + (R_INNER + 4) * Math.cos(rad), y1 = cy + (R_INNER + 4) * Math.sin(rad);
            const x2 = cx + (R_OUTER - 4) * Math.cos(rad), y2 = cy + (R_OUTER - 4) * Math.sin(rad);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(168,85,247,0.3)" strokeWidth={deg % 30 === 0 ? 1.5 : 0.75} />;
          })}
          {signArcs.map((s) => {
            const rad = (s.startAngle + 15) * Math.PI / 180;
            const lr = R_OUTER + 13;
            return <text key={s.index} x={cx + lr * Math.cos(rad)} y={cy + lr * Math.sin(rad)} textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="700" fill={s.color} opacity="0.95">{s.symbol}</text>;
          })}
          {signArcs.map((s) => {
            const rad = (s.startAngle + 15) * Math.PI / 180;
            const gr = R_INNER - 13;
            return <text key={`g-${s.index}`} x={cx + gr * Math.cos(rad)} y={cy + gr * Math.sin(rad)} textAnchor="middle" dominantBaseline="central" fontSize="7.5" fontWeight="700" letterSpacing="0.08em" className="fill-purple-200/60">{s.name.slice(0, 3).toUpperCase()}</text>;
          })}
          {wheel.map((p) => {
            const { x, y } = planetPos(p.longitude);
            const color = PLANET_COLORS[p.body] || "#c084fc";
            const isRx = p.isRetrograde;
            return (<g key={p.body} filter="url(#planetGlow)">
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeOpacity={0.25} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={x} cy={y} r={isRx ? 8 : 6} fill={color} stroke="#0b0416" strokeWidth="2" opacity={0.95} />
              <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] font-bold" fill={color} style={{ textShadow: "0 0 8px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.8)" }}>{p.symbol}</text>
              {isRx && <text x={x} y={y + 14} textAnchor="middle" className="text-[9px] font-bold fill-rose-300" style={{ textShadow: "0 0 6px rgba(0,0,0,0.9)" }}>Rx</text>}
            </g>);
          })}
          <circle cx={cx} cy={cy} r={14} fill="rgba(126,34,206,0.35)" stroke="#a855f7" strokeWidth="1.5" />
          <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="central" className="text-[11px] font-bold fill-purple-100">Transits</text>
          <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" className="text-[8px] fill-purple-300/60">{wheel.length} planets</text>
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-purple-200/70">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded-full bg-amber-300/60"/>Sign boundary</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded-full bg-purple-400/40" style={{ background: "repeating-linear-gradient(90deg,#a855f7 0,#a855f7 3px,transparent 3px,transparent 6px)" }}/>Degrees (10° ticks)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full border-2 border-purple-300/30"/>Planet position</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full border-2 border-rose-400/60 bg-rose-500/30"/>Retrograde (Rx)</span>
        {signChangeCount > 0 && <span className="inline-flex items-center gap-1.5 text-amber-300/70">⟳ {signChangeCount} sign change{signChangeCount > 1 ? "s" : ""}</span>}
        {retrogradeCount > 0 && <span className="inline-flex items-center gap-1.5 text-rose-300/70">◐ {retrogradeCount} retrograde{retrogradeCount > 1 ? "s" : ""}</span>}
      </div>
    </div>
  );
};

export default TransitWheel;

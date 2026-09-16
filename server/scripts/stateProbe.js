// Quick state probe for calculator backend services
const path = require('path');

function tryReq(rel) {
  try {
    const mod = require(path.join(__dirname, '..', rel));
    return { ok: true, keys: Object.keys(mod).slice(0, 20) };
  } catch (e) {
    return { ok: false, err: e.message.split('\n')[0] };
  }
}

console.log('=== modules ===');
const mods = [
  'services/astrology/constants.js',
  'services/astrology/nakshatras.js',
  'services/astrology/utils.js',
  'services/astrology/engine.js',
  'services/astrology/timezoneService.js',
  'services/astrology/chartService.js',
  'services/astrology/validation.js',
  'services/astrology/numerologyService.js',
  'services/astrology/kutaService.js',
  'services/astrology/synastry.js',
  'services/astrology/interpretationService.js',
  'services/astrology/calculatorService.js',
  'controllers/calculatorController.js',
  'routes/calculatorRoutes.js',
];
for (const m of mods) console.log(m, JSON.stringify(tryReq(m)));

console.log('=== chart test ===');
try {
  const { calculateChart } = require(path.join(__dirname, '..', 'services/astrology/chartService.js'));
  const r = calculateChart({
    date: '1995-06-15', time: '14:30',
    location: { lat: 28.6139, lon: 77.209, name: 'New Delhi', country: 'India' },
    tzOffsetMinutes: 330,
  });
  console.log(JSON.stringify({
    sun: r.sun.sign.name, sunDeg: r.sun.sign.degree,
    moon: r.moon.sign.name, moonDeg: r.moon.sign.degree,
    asc: r.ascendant.sign.name, ascDeg: r.ascendant.sign.degree,
    nak: r.moon.nakshatra.name, pada: r.moon.nakshatra.pada,
    ayanamsa: Number(r.ayanamsa.value.toFixed(4)),
    jdUT: Number(r.julianDay.ut.toFixed(6)),
  }));
} catch (e) {
  console.log('CHART FAIL:', e.message.split('\n')[0]);
}

console.log('=== numerology test ===');
try {
  const { calculateNumerology } = require(path.join(__dirname, '..', 'services/astrology/numerologyService.js'));
  const n = calculateNumerology({ firstName: 'John', lastName: 'Doe', date: '1990-08-24' });
  console.log(JSON.stringify({ lifePath: n.lifePath.number, expression: n.expression && n.expression.number, soulUrge: n.soulUrge && n.soulUrge.number }));
} catch (e) {
  console.log('NUMEROLOGY FAIL:', e.message.split('\n')[0]);
}

const CC = require('./server/controllers/calculatorController.js');

async function run(input, label) {
  const req = { body: input, query: {} };
  let st = null, j = null;
  const res = {
    status: (c) => { st = c; return res; },
    json: (b) => { j = b; return res; },
  };
  try { await CC.transitChart(req, res); }
  catch (e) { j = { success: false, error: String(e), errors: [{ field: 'error', message: String(e) }] }; }
  const t = j && j.success && j.data ? j.data.time : null;
  console.log(JSON.stringify({
    label,
    ok: j && j.success ? 'YES' : 'NO',
    status: st,
    wheel: j && j.success && j.data ? j.data.tropicalWheel.length : 'NA',
    inputDate: input.date, inputTime: input.time,
    hasTzIn: !!(input.timeZone),
    resolvedTz: t ? t.timeZone : ((j && j.errors || []).find(e => e.field === 'place') || {}).message || 'none',
    offsetLabel: t ? t.offsetLabel : 'NA',
    isDst: t ? t.isDst : 'NA',
    echoedLocal: t ? t.local : 'NA',
    echoedUtc: t ? t.utc : 'NA',
    errors: j && j.success ? null : (j && j.errors || []).map(e => (e.field || '?') + ': ' + (e.message || e)).join(' | '),
  }));
}

(async () => {
  await run({ name: 'Ash', sex: 'male', date: '1990-01-01', time: '12:00', place: 'London' }, 'BASIC ONLY - London (Jan, offset 0)');
  await run({ name: 'Ash', sex: 'male', date: '1990-01-01', time: '12:00', place: 'London', latitude: 51.5072, longitude: -0.1276, timeZone: 'Europe/London', utcOffsetMinutes: 0 }, 'FULL DATA - London (control)');
  await run({ name: 'Ash', sex: 'female', date: '2024-07-01', time: '12:00', place: 'New York' }, 'BASIC ONLY - New York (Jul, DST, offset -4)');
  await run({ name: 'Ash', sex: 'female', date: '2024-07-01', time: '12:00', place: 'New York', latitude: 40.7128, longitude: -74.0060, timeZone: 'America/New_York', utcOffsetMinutes: -240 }, 'FULL DATA - New York (control)');
})();

const CC = require('./server/controllers/calculatorController.js');

const places = [
  { name: 'Ash-London', sex: 'male', date: '1990-01-01', time: '12:00', place: 'London' },
  { name: 'Ash-Mumbai', sex: 'male', date: '2001-02-02', time: '05:30', place: 'Mumbai' },
  { name: 'Ash-Paris', sex: 'male', date: '1980-12-25', time: '12:00', place: 'Paris' },
];

async function run() {
  for (const p of places) {
    const req = { body: p, query: {} };
    let s, j;
    const res = {
      status(code) { s = code; return res; },
      json(body) { j = body; return res; },
    };
    try {
      await CC.transitChart(req, res);
    } catch (e) {
      j = { success: false, error: String(e) };
      if (!j.errors) j.errors = [{ field: 'error', message: String(e) }];
    }
    const d = j && j.success ? j.data : null;
    const inputZone = d && d.input ? d.input.timeZone : null;
    const timeZone = d && d.time ? d.time.timeZone : null;
    const offsetLabel = d && d.time ? d.time.offsetLabel : null;
    const isDst = d && d.time ? d.time.isDst : null;
    const wheel = d && d.tropicalWheel ? d.tropicalWheel.length : 'NA';
    const retro = d && d.retrogradeBodies ? d.retrogradeBodies.length : 'NA';
    const signChanges = d && d.signChanges ? d.signChanges.length : 'NA';
    const upcoming = d && d.upcomingTransits ? d.upcomingTransits.length : 'NA';
    console.log(JSON.stringify({
      place: p.place,
      status: s,
      ok: (j && j.success) ? 'YES' : 'NO',
      wheel,
      retro,
      signChanges,
      upcoming,
      inputZone,
      timeZone,
      offsetLabel,
      isDst,
      errors: (j && j.success) ? null : ((j && j.errors || []).map(e => e.field + ':' + e.message).join(' | ') || 'none'),
    }));
    await new Promise(r => setTimeout(r, 1200));
  }
}

run().catch(e => { console.error('FATAL', e); process.exit(1); });




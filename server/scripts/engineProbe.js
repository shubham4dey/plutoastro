/* Temporary probe v3: validate sweph usage synchronously (CJS) + accuracy anchors. */
const fs = require("fs");
const path = require("path");
const out = [];
const log = (k, v) =>
  out.push(k + " => " + (typeof v === "string" ? v : JSON.stringify(v)).slice(0, 900));

try {
  const se = require("sweph");
  const C = se.constants;
  log("sync require ok", typeof se.calc_ut);
  log("node", process.version);

  const epheDir = path.join(__dirname, "..", "ephe");
  log("epheDir exists", fs.existsSync(epheDir));
  if (!fs.existsSync(epheDir)) fs.mkdirSync(epheDir, { recursive: true });
  const p = se.set_ephe_path(epheDir);
  log("set_ephe_path", p === undefined ? "ok" : p);

  const jd = se.julday(2000, 1, 1, 12.0, C.SE_GREG_CAL);
  log("jd J2000", jd);
  log("jd 1990-01-01 00UT", se.julday(1990, 1, 1, 0.0, C.SE_GREG_CAL));

  const swi = C.SEFLG_SWIEPH | C.SEFLG_SPEED;
  const mos = C.SEFLG_MOSEPH | C.SEFLG_SPEED;
  try {
    log("SWIEPH sun", se.calc_ut(jd, C.SE_SUN, swi));
  } catch (e) {
    log("SWIEPH sun ERROR", e.message);
  }
  log("MOSEPH sun", se.calc_ut(jd, C.SE_SUN, mos));
  try {
    log("SWIEPH moon", se.calc_ut(jd, C.SE_MOON, swi));
  } catch (e) {
    log("SWIEPH moon ERROR", e.message);
  }
  log("MOSEPH moon", se.calc_ut(jd, C.SE_MOON, mos));

  // Ayanamsa sweep at J2000 (published Lahiri ~23.85 deg)
  const systems = [
    ["LAHIRI", C.SE_SIDM_LAHIRI],
    ["RAMAN", C.SE_SIDM_RAMAN],
    ["KP", C.SE_SIDM_KRISHNAMURTI],
    ["FAGAN_BRADLEY", C.SE_SIDM_FAGAN_BRADLEY],
    ["YUKTESHWAR", C.SE_SIDM_YUKTESHWAR],
    ["TRUE_CITRA", C.SE_SIDM_TRUE_CITRA],
    ["LAHIRI_ICRC", C.SE_SIDM_LAHIRI_ICRC],
  ];
  for (const [name, id] of systems) {
    if (id === undefined) {
      log("sidm " + name, "undefined");
      continue;
    }
    se.set_sid_mode(id, 0, 0);
    const jd2025 = se.julday(2025, 1, 1, 0.0, C.SE_GREG_CAL);
    log(
      "ayanamsa " + name,
      "J2000=" +
        se.get_ayanamsa_ex_ut(jd, mos).ayanamsa +
        " 2025=" +
        se.get_ayanamsa_ex_ut(jd2025, mos).ayanamsa
    );
  }

  // Houses / Ascendant (Delhi)
  se.set_sid_mode(C.SE_SIDM_LAHIRI, 0, 0);
  const jdBirth = se.julday(1990, 4, 15, 6.5, C.SE_GREG_CAL); // 06:30 UT
  const hTrop = se.houses_ex(jdBirth, 0, 28.6139, 77.209, "P");
  log("houses tropical (Delhi)", hTrop.ascmc ? hTrop.ascmc.slice(0, 4) : hTrop);
  const hSid = se.houses_ex(jdBirth, C.SEFLG_SIDEREAL, 28.6139, 77.209, "P");
  log("houses sidereal (Delhi)", hSid.ascmc ? hSid.ascmc.slice(0, 4) : hSid);

  // Equator invariant: at lat=0 ascendant = ARMC + 90 (tropical)
  const hEq = se.houses_ex(jdBirth, 0, 0, 0, "P");
  log(
    "equator asc vs armc",
    hEq.ascmc.slice(0, 3) + " diff=" + ((hEq.ascmc[0] - hEq.ascmc[2] - 90 + 540) % 360 - 180)
  );

  // Sidereal moon at a known birth (Delhi 1990-04-15 12:00 IST)
  const jdIst = se.julday(1990, 4, 15, 6.5, C.SE_GREG_CAL);
  log("moon sidereal Lahiri", se.calc_ut(jdIst, C.SE_MOON, mos | C.SEFLG_SIDEREAL));
  log("moon tropical", se.calc_ut(jdIst, C.SE_MOON, mos));
} catch (e) {
  out.push("FATAL: " + (e && e.stack ? e.stack : e));
}
fs.writeFileSync(path.join(__dirname, "engineProbe.out.txt"), out.join("\n"), "utf8");
console.log(out.join("\n"));
(async () => {
  const out = [];
  const log = (k, v) => out.push(k + " => " + (typeof v === "string" ? v : JSON.stringify(v)).slice(0, 700));
  try {
    const mod = await import("sweph");
    const api = mod.default && mod.default.calc_ut ? mod.default : mod;
    log("node", process.version);
    log("typeof set_ephe_path", typeof api.set_ephe_path);
    log("constants keys", Object.keys(api.constants || {}).filter((k) => /SIDM|SEFLG|SE_SUN|SE_MOON|GREG/.test(k)).slice(0, 30));
    log("SIDM_LAHIRI", api.constants.SE_SIDM_LAHIRI);
    log("SEFLG_SIDEREAL", api.constants.SEFLG_SIDEREAL);
    log("SE_SUN", api.constants.SE_SUN);
    log("SE_MOON", api.constants.SE_MOON);
    log("GREG", api.constants.SE_GREG_CAL);

    const setPath = await api.set_ephe_path();
    log("set_ephe_path()", setPath === undefined ? "ok(undefined)" : setPath);
    const jd = await api.julday(2000, 1, 1, 12.0, api.constants.SE_GREG_CAL);
    log("jd(2000-01-01 12 UT)", jd);
    const flag = api.constants.SEFLG_SWIEPH | api.constants.SEFLG_SPEED;
    log("sun", await api.calc_ut(jd, api.constants.SE_SUN, flag));
    log("moon", await api.calc_ut(jd, api.constants.SE_MOON, flag));
    const sid = await api.set_sid_mode(api.constants.SE_SIDM_LAHIRI, 0, 0);
    log("set_sid_mode", sid === undefined ? "ok" : sid);
    log("ayanamsa_ut", await api.get_ayanamsa_ut(jd));
    log("ayanamsa_ex_ut", await api.get_ayanamsa_ex_ut(jd, flag));
    log("moon sidereal", await api.calc_ut(jd, api.constants.SE_MOON, flag | api.constants.SEFLG_SIDEREAL));
    log("houses_ex tropical", await api.houses_ex(jd, 0, 28.6139, 77.209, "P"));
    log("houses_ex sidereal", await api.houses_ex(jd, api.constants.SEFLG_SIDEREAL, 28.6139, 77.209, "P"));
  } catch (e) {
    out.push("ERROR: " + (e && e.stack ? e.stack : e));
  }
  require("fs").writeFileSync(require("path").join(__dirname, "engineProbe.out.txt"), out.join("\n"), "utf8");
})();


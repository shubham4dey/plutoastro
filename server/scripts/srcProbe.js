/* Temporary: inspect sweph package (prebuilds + C source ayanamsa table) to plan engine choice. */
const fs = require("fs");
const path = require("path");
const out = [];
const root = path.join(__dirname, "..", "node_modules", "sweph");

function walk(dir, depth = 0) {
  if (depth > 3 || !fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push("[D] " + path.relative(root, full));
      walk(full, depth + 1);
    } else {
      out.push("    " + path.relative(root, full) + "  " + (fs.statSync(full).size / 1024).toFixed(0) + "KB");
    }
  }
}
walk(path.join(root, "prebuilds"));

// Ayanamsa definition table lives in swisseph sources
const srcDir = path.join(root, "swisseph");
const files = fs.existsSync(srcDir) ? fs.readdirSync(srcDir) : [];
out.push("--- swisseph files: " + files.join(", "));

const targets = ["sweph.c", "swephlib.c", "sweph.h", "swephlib.h"];
for (const f of targets) {
  const p = path.join(srcDir, f);
  if (!fs.existsSync(p)) continue;
  const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
  lines.forEach((l, i) => {
    if (/ayan_t0|T0\s*=|2415020|Lahiri|lahiri|ayanamsa\[\]|SE_SIDM_/i.test(l) && l.length < 200) {
      out.push(f + ":" + (i + 1) + ": " + l.trim());
    }
  });
}

// ayanamsa return shape
try {
  const se = require("sweph");
  const C = se.constants;
  const jd = se.julday(2000, 1, 1, 12, C.SE_GREG_CAL);
  se.set_ephe_path(path.join(__dirname, "..", "ephe"));
  se.set_sid_mode(C.SE_SIDM_LAHIRI, 0, 0);
  out.push("--- get_ayanamsa_ut => " + JSON.stringify(se.get_ayanamsa_ut(jd)));
  out.push("--- get_ayanamsa_ex_ut => " + JSON.stringify(se.get_ayanamsa_ex_ut(jd, C.SEFLG_MOSEPH)));
  out.push("--- get_ayanamsa => " + JSON.stringify(se.get_ayanamsa(jd)));
  out.push("--- ayanamsa_name => " + se.get_ayanamsa_name(C.SE_SIDM_LAHIRI));
  out.push("--- julday 1900-01-01 12UT => " + se.julday(1900, 1, 1, 12, C.SE_GREG_CAL));
} catch (e) {
  out.push("ERR " + e.message);
}

fs.writeFileSync(path.join(__dirname, "srcProbe.out.txt"), out.join("\n"), "utf8");
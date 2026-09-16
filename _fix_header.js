const fs = require("fs");
const f = "src/components/Header.jsx";
let s = fs.readFileSync(f, "utf8");

// --- 1. Fix the BROKEN desktop CALCULATORS block (opening <Link> was swallowed) ---
// The broken text: <ZODIAC></Link>\n<blank>\n[38sp]CALCULATORS\n...</Link>\n<Link to="/planetary-changes"...>
const brokenDesktop = /([^\n]*\n)[^\S\n]*CALCULATORS\n\n[ ]+<\/Link>\n\n[ ]+<Link to="\/planetary-changes" className=\{\s*liCSS\s*\}>/;
if (!brokenDesktop.test(s)) {
  console.error("DESKTOP_PATTERN_NOT_FOUND");
  process.exit(1);
}
s = s.replace(brokenDesktop, (m) => {
  // Reconstruct: restore the CALCULATORS opening tag with 12-space indentation.
  const head = "            <Link to=\"/calculators\" className={liCSS}>\n";
  const label = "\n              CALCULATORS\n\n            </Link>\n";
  return head + label + "            <Link to=\"/planetary-changes\" className={liCSS}>";
});

// --- 2. Add PLANETARY CHANGES to the MOBILE menu (after CALCULATORS) ---
const mobileBlock =
  '              CALCULATORS\n\n            </Link>\n\n            <Link to="/about" onClick={() => setMobileMenu(false)}>';
const mobileNew =
  '              CALCULATORS\n\n            </Link>\n\n            <Link to="/planetary-changes" onClick={() => setMobileMenu(false)}>\n\n              PLANETARY CHANGES\n\n            </Link>\n\n            <Link to="/about" onClick={() => setMobileMenu(false)}>';
if (!s.includes(mobileBlock)) {
  console.error("MOBILE_PATTERN_NOT_FOUND");
  process.exit(1);
}
s = s.replace(mobileBlock, mobileNew);

fs.writeFileSync(f, s);
console.log("HEADER_FIXED");
console.log("desktop planetary present:", s.includes('to="/planetary-changes" className={liCSS}'));
console.log("mobile planetary present:", s.includes('to="/planetary-changes" onClick'));

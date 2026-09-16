/* quick probe of numerology output shape */
const svc = require("../services/astrology/calculatorService");
const r = svc.numerology({ fullName: "Rohan Sharma", dateOfBirth: "1990-08-15" });
console.log("TOP KEYS:", Object.keys(r).join(", "));
console.log(JSON.stringify(r, null, 1).slice(0, 1600));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*/*.{js,jsx,ts,tsx}",
    /* PlutoAstro — Calculators live one directory deeper than the
       rest of the app, so they must be scanned explicitly or their
       Tailwind utilities get purged from the production CSS. */
    "./src/pages/calculators/**/*.{js,jsx}",
    "./src/components/calculators/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
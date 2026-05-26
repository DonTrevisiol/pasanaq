/* ./pasanaq/tailwind.config.js: */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petroleum: "#123C69",
        fintech: "#1D4ED8",
        savings: "#16A34A",
        gold: "#D4A017",
        silver: "#C0C0C0",
        dark: "#1F2937",
        light: "#F8FAFC",
      },
    },
  },
  plugins: [],
}

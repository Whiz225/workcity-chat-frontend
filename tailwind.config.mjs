// tailwind.config.mjs
import { join } from "path";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "./src/**/*.{js,jsx,ts,tsx}"),
    join(__dirname, "./app/**/*.{js,ts,jsx,tsx,mdx}"),
  ],
  darkMode: "class", // or 'media' for OS-level dark mode
  theme: {
    extend: {
      },
  },
  plugins: [],
};

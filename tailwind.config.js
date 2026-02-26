/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        burtons: "burtons",
        inter: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      colors: {
        "os-accent": "#0078d4",
        "os-accent-hover": "#106ebe",
        "os-dark": "#0a0a14",
        "os-title": "#161625",
        "os-window": "#f3f3f3",
      },
      boxShadow: {
        window: "0 20px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
        taskbar: "0 -2px 20px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

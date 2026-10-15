/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0b0e14",
        surface: "#141923",
        surfaceHover: "#1b2230",
        borderSubtle: "rgba(255, 255, 255, 0.08)",
        pinkAccent: "#f472b6",
        pinkMuted: "rgba(244, 114, 182, 0.12)",
        blueAccent: "#38bdf8",
        blueMuted: "rgba(56, 189, 248, 0.12)",
        neutralAccent: "#a78bfa",
      }
    },
  },
  plugins: [],
}

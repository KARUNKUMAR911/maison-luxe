/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: "#C9A84C", light: "#D4B86A", dark: "#A8872E" },
        dark: { DEFAULT: "#0d0c0a", 100: "#111009", 200: "#1a1710", 300: "#241f10" },
        cream: { DEFAULT: "#e8e0d0", muted: "#b0a898", faint: "#6b6355" },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans:  ["Montserrat", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease both",
        "fade-in":   "fadeIn 0.4s ease both",
        "slide-in":  "slideIn 0.3s ease both",
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "none" } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          200: "#e2e8f0",
          100: "#f1f5f9"
        },
        brand: {
          900: "#0c4a6e",
          700: "#0e7490",
          500: "#0ea5e9",
          300: "#7dd3fc",
          100: "#e0f2fe"
        },
        mint: {
          600: "#059669",
          100: "#dcfce7"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        card: "0 12px 32px rgba(15, 23, 42, 0.12)"
      },
      borderRadius: {
        xl: "1.25rem"
      }
    }
  },
  plugins: []
};

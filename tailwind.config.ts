import type { Config } from "tailwindcss";

const config: Config = {
  // Scan dua kemungkinan struktur folder (root vs src)
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ✅ System font stack (stabil di iPhone/Android/PC)
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },

      colors: {
        bg: "#FDFBF7",
        surface: "#FFF8F0",
        main: "#171717",
        accent: "#FFD23F",
        "accent-2": "#A0E7E5",
        danger: "#FF4D4D",
      },

      boxShadow: {
        brut: "4px 4px 0px 0px #171717",
        "brut-sm": "2px 2px 0px 0px #171717",
        "brut-lg": "8px 8px 0px 0px #171717",
      },

      borderRadius: {
        brut: "0px",
      },

      borderWidth: {
        brut: "3px",
      },

      // Utility p-safe-bottom kalau butuh
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },

  plugins: [],
};

export default config;

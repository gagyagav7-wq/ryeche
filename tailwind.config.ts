import type { Config } from "tailwindcss";

const config: Config = {
  // FIX 1: Scan SEMUA kemungkinan folder (root ataupun src) biar class ga ilang pas build
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FDFBF7",      // Creamy Background
        surface: "#FFF8F0", // Milk/Warm White
        main: "#171717",    // Brutal Black
        accent: "#FFD23F",  // Pop Yellow
        "accent-2": "#A0E7E5", // Cyan Pastel
        danger: "#FF4D4D",  // Real Danger Red
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
      // FIX 2: Pake 'spacing' bukan 'padding' buat dynamic value
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
export default config;

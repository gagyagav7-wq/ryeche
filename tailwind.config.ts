import type { Config } from "tailwindcss";

const config: Config = {
  // FIX CRITICAL: Cover dua kemungkinan struktur folder (Root vs Src)
  // Biar lu ga pusing mindahin folder, dua-duanya kita scan.
  content: [
    // Kalau struktur lu di root (ryeche/app)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Kalau struktur lu pake src (ryeche/src/app) - Jaga-jaga aja
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      // Kita tetep simpen ini buat utility class p-safe-bottom kalau butuh manual
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
export default config;

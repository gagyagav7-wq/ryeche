import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FDFBF7",      // Cream background (tulang)
        surface: "#FFF8F0", // Milk/Warm White (buat card biar ga putih polos)
        main: "#171717",    // Hitam pekat (bukan #000, biar ga sakit mata)
        accent: "#FFD23F",  // Kuning pop
        "accent-2": "#A0E7E5", // Cyan pastel (ganti pink biar variatif)
        danger: "#FF4D4D",  // Merah beneran buat danger
      },
      boxShadow: {
        brut: "4px 4px 0px 0px #171717",
        "brut-sm": "2px 2px 0px 0px #171717",
        "brut-lg": "8px 8px 0px 0px #171717",
      },
      borderRadius: {
        brut: "0px", // Tetap tajam
      },
      borderWidth: {
        brut: "3px", // Konsisten 3px
      },
      // Tambahan untuk mobile safe area (kalau butuh spacing custom)
      padding: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
};
export default config;

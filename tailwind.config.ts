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
        bg: "#FDFBF7", // Creamy white background
        main: "#171717", // Brutal black
        accent: "#FFD23F", // Pop yellow
        "accent-2": "#FFB8C6", // Soft pink
        surface: "#FFFFFF",
      },
      boxShadow: {
        brut: "4px 4px 0px 0px #171717", // Hard shadow
        "brut-sm": "2px 2px 0px 0px #171717",
        "brut-lg": "8px 8px 0px 0px #171717",
      },
      borderRadius: {
        brut: "0px", // Sharp edges (opsional, bisa 12px kalau mau lebih modern)
      },
      borderWidth: {
        brut: "3px",
      },
    },
  },
  plugins: [],
};
export default config;

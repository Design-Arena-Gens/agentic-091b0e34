import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5faff",
          100: "#e0f0ff",
          200: "#b3dcff",
          300: "#80c3ff",
          400: "#4daafc",
          500: "#218df5",
          600: "#106fde",
          700: "#0b57b0",
          800: "#0e468a",
          900: "#113c71"
        }
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

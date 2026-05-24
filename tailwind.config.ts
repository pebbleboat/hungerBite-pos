import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          600: "#2563eb",
          solid: "#1d4ed8",
        },
      },

      keyframes: {
        bottom: {
          "0%": { opacity: "0", bottom: "-100px" },
          "100%": { opacity: "1", bottom: "0" },
        },
        "tab-panel-slide": {
          "0%": { opacity: "0", transform: "translateX(14px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        bottom: "bottom 0.5s",
        "tab-panel-slide": "tab-panel-slide 0.35s ease-out both",
      },
      backgroundImage: {},
    },
  },
  plugins: [],
};

export default config;

export const tw: any = config.theme?.extend;

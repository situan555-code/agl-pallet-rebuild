import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#002920",
        "brand-green": "#162619",
        surface: "#ECFBF6",
        "surface-alt": "#F4F5F4",
        "eyebrow-ink": "#423A2F",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-anton)", "sans-serif"],
      },
      fontSize: {
        "display-1": ["clamp(40px, 37px + 0.76vw, 48px)", { lineHeight: "1.2" }],
        "display-2": ["clamp(35px, 32px + 0.62vw, 41px)", { lineHeight: "1.2" }],
        "display-3": ["20px", { lineHeight: "20px" }],
        "display-4": ["14px", { lineHeight: "14px" }],
        "step-sm": ["16px", { lineHeight: "20.8px" }],
        "step-lg": ["25px", { lineHeight: "25px" }],
        body: ["14px", { lineHeight: "23.8px" }],
        eyebrow: ["11px", { lineHeight: "23.8px", letterSpacing: "1px" }],
        link: ["14px", { lineHeight: "23px" }],
        "nav-link": ["14px", { lineHeight: "14px" }],
        button: ["14px", { lineHeight: "23.8px" }],
      },
      borderRadius: {
        input: "4px",
      },
      screens: {
        nav: "980px",
      },
    },
  },
  plugins: [],
};

export default config;

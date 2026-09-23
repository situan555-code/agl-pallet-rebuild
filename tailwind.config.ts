import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    // Installed-but-unimported files (demo Shadcnblocks, unused ui
    // primitives, retired AGL sections). Scanning them only ships dead CSS
    // on the render-blocking stylesheet. Remove a line when a file is wired
    // into a route. See out/BLOCK-MAP.md.
    "!./components/{navbar1,navbar5,faq1,team1,team2,service1,service2,case-study1,banner1,banner2,hero7,gallery6,timeline3}.tsx",
    "!./components/kibo-ui/**",
    "!./components/shadcnblocks/**",
    "!./components/ui/{alert,avatar,badge,breadcrumb,card,context-menu,field,input,label,separator,textarea}.tsx",
    "!./components/{Hero,PageHero,CTABand,TrioGrid,CapabilityTrio,ProseBlock,ListBlock,TimelineSection,ContactInfoStrip,TextWithSideImage,IndustryCardGrid,ProcessStepGrid,ProductBlock,EmbeddedVideo,FadeIn}.tsx",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Direction 03 — Sophisticated Natural
        ink: "#3B342E", // dark cocoa
        "brand-green": "#1F2A1F", // AGL green
        paper: "#F2EBDD", // parchment
        mint: "#C4CCC0", // fog green (legacy token name kept for class compat)
        clay: "#B9A78F",
        cream: "#FFFDF7",
        "fog-green": "#C4CCC0",
        "dark-cocoa": "#3B342E",
        surface: "#C4CCC0", // fog green soft fill
        "surface-alt": "#FFFDF7", // cream elevated
        "eyebrow-ink": "#3B342E",
        hairline: "rgba(31, 42, 31, 0.18)",
        // shadcn semantic tokens (RGB channels → AGL paper/green in globals.css)
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "rgb(var(--sidebar) / <alpha-value>)",
          foreground: "rgb(var(--sidebar-foreground) / <alpha-value>)",
          primary: "rgb(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "rgb(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "rgb(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "rgb(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "rgb(var(--sidebar-border) / <alpha-value>)",
          ring: "rgb(var(--sidebar-ring) / <alpha-value>)",
        },
      },
      borderRadius: {
        input: "4px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "display-kicker": ["22px", { lineHeight: "1.1", letterSpacing: "0.08em" }],
        "display-row": ["28px", { lineHeight: "1.15" }],
        "display-numeral": ["40px", { lineHeight: "1" }],
        "step-sm": ["16px", { lineHeight: "20.8px" }],
        "step-lg": ["25px", { lineHeight: "25px" }],
        body: ["14px", { lineHeight: "23.8px" }],
        eyebrow: ["11px", { lineHeight: "23.8px", letterSpacing: "1px" }],
        link: ["14px", { lineHeight: "23px" }],
        "nav-link": ["14px", { lineHeight: "14px" }],
        button: ["14px", { lineHeight: "23.8px" }],
      },
      screens: {
        nav: "980px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;

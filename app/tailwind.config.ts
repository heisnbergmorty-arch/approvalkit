import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Default brand palette — fully overridable per agency at runtime via CSS vars
        brand: {
          50: "var(--brand-50, #eef2ff)",
          100: "var(--brand-100, #e0e7ff)",
          500: "var(--brand-500, #6366f1)",
          600: "var(--brand-600, #4f46e5)",
          700: "var(--brand-700, #4338ca)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans, system-ui)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

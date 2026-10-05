import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070a0f",
        panel: "#0e131f",
        panelLight: "#141c2e",
        line: "#1f2937",
        up: "#10b981",    // Emerald 500
        dn: "#f43f5e",    // Rose 500
        ai: "#06b6d4",    // Cyan 500
        cyanAcc: "#22d3ee",
        ind: "#6366f1",   // Indigo 500
        indLight: "#818cf8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glowUp: "0 0 20px -5px rgba(16, 185, 129, 0.3)",
        glowDn: "0 0 20px -5px rgba(244, 63, 94, 0.3)",
        glowAi: "0 0 20px -5px rgba(6, 182, 212, 0.3)",
      }
    },
  },
  plugins: [],
} satisfies Config;

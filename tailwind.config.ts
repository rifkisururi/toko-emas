import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        emerald: "#10B981",
        ink: "#0f172a",
        sand: "#f8f5ef"
      },
      boxShadow: {
        soft: "0 10px 30px -20px rgba(15, 23, 42, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10212b",
        mist: "#eef4f2",
        clay: "#f4ece3",
        accent: "#d46b28",
        pine: "#1f6b57",
      },
      boxShadow: {
        card: "0 10px 30px rgba(16, 33, 43, 0.08)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(16, 33, 43, 0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;

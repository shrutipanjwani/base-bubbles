import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
    },
    extend: {
      screens: {
        "max-350": { max: "350px" },
      },
      fontFamily: {
        polysans: ["PolySans Neutral"],
        cg: ["CabinetGrotesk Variable"],
        "cg-regular": ["CabinetGrotesk Regular"],
        "cg-light": ["CabinetGrotesk Light"],
        "cg-thin": ["CabinetGrotesk Thin"],
        "cg-medium": ["CabinetGrotesk Medium"],
        "cg-black": ["CabinetGrotesk Black"],
        "cg-bold": ["CabinetGrotesk Bold"],
        "cg-extrabold": ["CabinetGrotesk ExtraBold"],
      },
      colors: {
        black: "#0e1016",
        white: "#fff",
        grey: "#1a1a1a",
        primary: "#0055FF",
        secondary: "#90B5FF",
      },
    },
  },
  plugins: [],
};
export default config;

import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F3F5FF",
          100: "#D7E0FF",
          200: "#9FB0FF",
          300: "#7C8DFF",
          400: "#5E68FD",
          500: "#5152FB",
          600: "#2F2F9C",
          700: "#24257E",
          800: "#1A1A61",
          900: "#101146",
          DEFAULT: "#5152FB",
        },
        secondary: {
          light: "#fde047",
          DEFAULT: "#facc15",
          dark: "#eab308",
        },
        neutral: {
          100: "#FDFDFE",
          200: "#F3F5F7",
          300: "#EBEEF2",
          400: "#CDCFD2",
          500: "#919396",
          600: "#757779",
          700: "#5B5C5E",
          800: "#414243",
          900: "#131414",
          DEFAULT: "#919396",
        },
        success: "#10b981",
        warning: "#f59e0b", 
        danger: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        heading: ["Poppins", ...fontFamily.sans],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
        128: "32rem",
      },
      boxShadow: {
        "soft-xl":
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "hard-xl":
          "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.neutral.dark"),
            a: {
              color: theme("colors.primary.DEFAULT"),
              textDecoration: "none",
              "&:hover": {
                color: theme("colors.primary.dark"),
                textDecoration: "underline",
              },
            },
          },
        },
      }),
    },
    screens: {
      xs: "375px",
      ...require("tailwindcss/defaultTheme").screens,
    },
  },
  plugins: [require("tailwindcss-animate")],
};

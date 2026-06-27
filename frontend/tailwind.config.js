/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        secondary: "var(--secondary)",
        dark: "var(--dark)",
        light: "var(--light)",
        gray: "var(--gray)",
        white: "var(--white)",
        danger: "var(--danger)",
        success: "var(--success)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

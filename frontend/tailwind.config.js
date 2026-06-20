/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006ce1",
          hover: "#0056b3",
        },
        secondary: "#ec4899",
        dark: "#1e293b",
        light: "#f8fafc",
        gray: "#64748b",
        white: "#ffffff",
        danger: "#ef4444",
        success: "#22c55e",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

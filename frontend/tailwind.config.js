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
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        secondary: "#EA580C",
        dark: "#111827",
        "dark-2": "#374151",
        gray: "#6B7280",
        light: "#F9FAFB",
        "light-blue": "#EFF6FF",
        "light-green": "#F0FDF4",
        "light-red": "#FEF2F2",
        white: "#FFFFFF",
        border: "#D1D5DB",
        danger: "#DC2626",
        success: "#16A34A",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['14px', { lineHeight: '20px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
        modal: '0 10px 15px rgba(0,0,0,0.15)',
        toast: '0 4px 12px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2a85ff',
          deep: '#0069f6',
          mild: '#4996ff',
          subtle: '#2a85ff1a',
        },
        danger: '#ff6a55',
        success: '#10b981',
      },
    },
  },
  plugins: [],
};
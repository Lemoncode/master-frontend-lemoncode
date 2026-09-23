/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#1a1a1a",
          card: "#252525",
          hover: "#2f2f2f",
          border: "#3a3a3a",
        },
      },
    },
  },
  plugins: [],
};

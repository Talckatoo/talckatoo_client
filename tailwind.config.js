/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.6rem'
      }, 
      screens: {
        sm: "640px",    // Small screens (mobile)
        md: "768px",    // Medium screens (tablets)
        lg: "1024px",   // Large screens (laptops/desktops)
      },
    },
  },
  plugins: [],
}

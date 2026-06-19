export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans'", 'sans-serif'] },
      colors: {
        brand: { 50:'#EBF5FF', 100:'#DBEAFE', 400:'#60A5FA', 500:'#2563EB', 600:'#1D4ED8' }
      }
    }
  },
  plugins: []
}

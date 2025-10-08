// ------------------------------
// FILE: frontend/tailwind.config.cjs
// ------------------------------
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'glass-bg': 'rgba(255, 255, 255, 0.1)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}

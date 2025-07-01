// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {}, // Changed from '@tailwindcss/postcss' to 'tailwindcss' for v3 compatibility
    autoprefixer: {},
  },
};

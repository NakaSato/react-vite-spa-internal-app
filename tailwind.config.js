/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: "#root", // This ensures Tailwind has higher specificity than MUI
  theme: {
    extend: {
      // Extend Tailwind to work well with MUI
      colors: {
        // You can add custom colors that complement your MUI theme here
        primary: {
          50: "#e3f2fd",
          100: "#bbdefb",
          200: "#90caf9",
          300: "#64b5f6",
          400: "#42a5f5",
          500: "#2196f3",
          600: "#1e88e5",
          700: "#1976d2",
          800: "#1565c0",
          900: "#0d47a1",
        },
      },
      fontFamily: {
        // Match MUI's font family
        sans: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      spacing: {
        // Add MUI-like spacing values
        18: "4.5rem",
        70: "17.5rem",
        88: "22rem",
      },
      zIndex: {
        // Match MUI z-index values
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
      },
    },
  },
  plugins: [],
  // Disable Tailwind's CSS reset to avoid conflicts with MUI
  corePlugins: {
    preflight: false,
  },
};

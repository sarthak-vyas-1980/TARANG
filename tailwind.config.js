/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488', // Deep teal
        secondary: '#fb923c', // Coral
        accent: '#0d9488',
        white: '#ffffff',
        black: '#111827',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'md': '0 4px 12px 0 rgba(16, 24, 40, 0.08)',
      },
      borderRadius: {
        md: '0.375rem',
        lg: '0.5rem',
      },
      backgroundImage: {
        'subtle-texture': "url('/src/assets/otherbg.jpg')",
      },
      opacity: {
        7: '0.07',
        10: '0.10',
        15: '0.15',
      },
    },
  },
  plugins: [],
}
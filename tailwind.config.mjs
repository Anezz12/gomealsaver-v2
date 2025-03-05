/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fontFamily: {
          sans: [
            'Poppins',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
          ],
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#000000',
        },
        foreground: {
          DEFAULT: '#000000',
          dark: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};

export default config;

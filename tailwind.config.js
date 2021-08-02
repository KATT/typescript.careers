module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],

  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: [
        'Source Sans Pro',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
        'sans-serif',
      ],
    },
    extend: {
      colors: {
        primary: {
          100: '#e8f0f9',
          200: '#bbd3ee',
          300: '#8db6e3',
          400: '#337ccc',
          500: '#3178c6',
          600: '#27609f',
          700: '#1c4572',
          800: '#112944',
          900: '#060e17',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    //
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

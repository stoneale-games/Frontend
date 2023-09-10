/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/*.tsx", "./src/**/*.tsx", "./src/**/**/*.tsx"],
  theme: {
    extend: {},
    colors: {
      "primary-100": "#949494",
      "primary-300": "#717171",
      "primary-600": "#4E4E4E",
      "primary-900": "#2A2A2A",
      "primary-950": "#292929",
      "primary-blue": "#303440",
      "secondary-100": "#F6EAD6",
      "secondary-300": "#F4E3C9",
      "secondary-600": "#F1DCBB",
      "secondary-950": "#EED5AE",
      "white-100": "#717171",
      "white-300": "#FDFAFB",
      "white-600": "#FEFBFC",
      "white-950": "#FEFCFC",
      "accent-100": "#D9808D",
      "accent-300": "#CC5567",
      "accent-600": "#C02B41",
      "accent-950": "#B3001B",
    },
    gradientColorStops: {
      "red-950": "#B31B00",
      "black-950": "#2A2A2A",
    },
  },
  plugins: [],
};

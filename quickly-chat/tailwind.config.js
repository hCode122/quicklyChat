/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "userPic1":"url('/images/user.svg')",
        "login":"url('/images/login-bg.png')"
      },
      backgroundColor: {
        "black-2": "#212121",
        "black-3": "#282828"
      },
      color: {
        "black-2": "#212121"
      }
    },
  },
  plugins: [],
};

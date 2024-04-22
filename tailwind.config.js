/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        sidebar_back: "black",
        sidebar_setting_back: "#202123",
        sidebar_hover: "#333",
        chat_back: "#171717",
      },
    },
  },
};

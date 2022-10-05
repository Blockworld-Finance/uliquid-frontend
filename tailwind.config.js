/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				blue: "#32C1CC",
				grey: "#8E8E93",
				navy: "#1F2832",
				primary: "#0C0B0E",
				darkGrey: "#605D5D",
			},
		},
	},
	plugins: [],
};

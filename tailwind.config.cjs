/** @type {import('tailwindcss').Config} */
module.exports = {
    important: "#__carbonvoyage",
    content: [
        "./components/**/*.{js,ts,jsx,tsx}",
        "./content-script/**/*.{js,ts,jsx,tsx}",
        "./onboarding/**/*.{js,ts,jsx,tsx}",
        "./options/**/*.{js,ts,jsx,tsx}",
        "./popup/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            display: ["bookman-jf-pro", "serif"],
            body: ["apolline", "serif"],
        },
        extend: {
            colors: {
                "carbon-bronze": "#7D671F",
                "carbon-gold": "#FFF0AD",
                "carbon-light": "#e5d391",
                "carbon-white": "#FFF7D2",
            },
            backgroundImage: {
                hero: "url('/hero-banner.png')",
            },
            height: {
                "screen-1/2": "50vh",
                "screen-1/3": "33vh",
                "screen-3/4": "75vh",
                hero: "calc(100vh - 104px)",
                120: "30rem",
                18: "4.5rem",
            },
            inset: {
                58: "14.5rem",
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms")({
            strategy: "class",
        }),
    ],
};

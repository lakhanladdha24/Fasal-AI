/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'fasal-green': '#2E7D32',
                'fasal-light': '#E8F5E9',
                'fasal-dark': '#1B5E20',
                'earth-brown': '#795548',
            }
        },
    },
    plugins: [],
}

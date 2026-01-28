/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#DC143C', // Deep Red
                secondary: '#0D0D0D', // Jet Black
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
                mono: ['var(--font-mono)'],
            },
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
// module.exports = require('../../config/tailwind.config.cjs');
// export { default } from '../../config/tailwind.config.cjs';

export default {
    content: [
        './src/**/*.{ts,tsx,html}',
    ],
    theme: {
        colors: {
            bgaa: {
                100: '#F7F7F7',
                200: '#E0E0E0',
                300: '#C9C9C9',
                400: '#9E9E9E',
                500: '#737373',
                600: '#686868',
                700: '#464646',
                800: '#363636',
                900: '#242424',
            },
            yellow: {
                100: '#FFF9E6',
                200: '#FFE699',
                300: '#FFD64D',
                400: '#FFC300',
                500: '#E6A300',
                600: '#997000',
                700: '#735200',
                800: '#4D3A00',
                900: '#332600',
            },
            green: {
                100: '#E6FFF9',
                200: '#99FFD6',
                300: '#4DFFAD',
                400: '#00FF85',
                500: '#00E673',
                600: '#00994D',
                700: '#007352',
                800: '#004D36',
                900: '#003326',
            },
            black: {
                100: '#F2F2F2',
                200: '#E6E6E6',
                300: '#D9D9D9',
                400: '#BFBFBF',
                500: '#A6A6A6',
                600: '#8C8C8C',
                700: '#737373',
                800: '#595959',
                900: '#404040',
            },
        }
    },
};

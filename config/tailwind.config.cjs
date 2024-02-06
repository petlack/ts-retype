import { colors } from './colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{ts,tsx,html}',
        // '../apps/vis/**/*.{ts,tsx,html}',
        // '../apps/doc/**/*.{ts,tsx,html}',
        // '../packages/uikit/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            textColor: {
                'default': 'var(--clr-fg-text)',
                'code': 'var(--clr-fg-code)',
                'sx-keyword': 'var(--clr-sx-keyword)',
                'sx-token': 'var(--clr-sx-token)',
                'sx-constant': 'var(--clr-sx-constant)',
                'sx-operator': 'var(--clr-sx-operator)',
                'sx-punctuation': 'var(--clr-sx-punctuation)',
                'cp-teal': 'var(--clr-cp-teal)',
            },
            backgroundColor: {
                'default': 'var(--clr-bg-main)',
                'code': 'var(--clr-bg-code)',
                'snippet-highlighted': 'var(--clr-bg-snippet-highlighted)',
            },
            colors: {
                'cp-base': 'var(--clr-cp-base)',
                'cp-crust': 'var(--clr-cp-crust)',
                'cp-mantle': 'var(--clr-cp-mantle)',
                ...colors,
            },
        }
    },
};

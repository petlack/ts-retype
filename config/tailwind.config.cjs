import { colors } from './colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{ts,tsx,html}',
        '../apps/vis/**/*.{ts,tsx,html}',
        '../apps/doc/**/*.{ts,tsx,html}',
        '../packages/uikit/**/*.{ts,tsx}',
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
                'code-comment': 'var(--clr-fg-code-comment)',
                'window-header': 'var(--clr-fg-window-header)',
            },
            backgroundColor: {
                'code': 'var(--clr-bg-code)',
                'default': 'var(--clr-bg-main)',
                'landing': 'var(--clr-bg-landing)',
                'snippet-highlighted': 'var(--clr-bg-snippet-highlighted)',
                'topbar': 'var(--clr-bg-topbar)',
            },
            colors: {
                'border': 'var(--clr-border)',
                'landing-code': 'var(--clr-bg-landing-code)',
                'window-header': 'var(--clr-bg-window-header)',
                ...colors,
            },
            gridTemplateColumns: {
                options: 'max-content 1fr',
                'min-1fr': 'min-content 1fr',
                'lines-numbers': '3ch 1fr',
                'lines-char': '1ch 1fr',
            },
        }
    },
};

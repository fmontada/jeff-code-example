/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/no-var-requires
const OmazeUI = require('@omaze/omaze-ui').tailwind;

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
Object.keys(OmazeUI.theme.colors).forEach((color) => {
    if (OmazeUI.theme.colors[color]['default']) {
        OmazeUI.theme.colors[color]['DEFAULT'] =
            OmazeUI.theme.colors[color]['default'];

        delete OmazeUI.theme.colors[color]['default'];
    }
});

/**
 * TODO: update in the Omaze UI library
 * https://omazing.atlassian.net/browse/GS-125
 */
OmazeUI.theme.extend.inset['0.5'] = OmazeUI.theme.extend.inset['1/2'];
delete OmazeUI.theme.extend.inset['1/2'];

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        'node_modules/@omaze/**/*.{js,jsx,ts,tsx}',
    ],
    safelist: [
        {
            pattern: /./,
        },
    ],
    darkMode: 'class',
    theme: {
        ...OmazeUI.theme,
        screens: {
            ...OmazeUI.theme.screens,
            xl: '1646px',
        },
        fontFamily: {
            ...OmazeUI.theme.fontFamily,
            body: ['Gellix', 'Roboto', 'sans-serif'],
            showtime: ['Showtime', 'Gellix', 'Roboto', 'sans-serif'],
        },
        extend: {
            ...OmazeUI.theme.extend,
            lineHeight: {
                ...OmazeUI.theme.lineHeight,
                9: '150%',
            },
            boxShadow: {
                ...OmazeUI.theme.boxShadow,
                card: '0px 1px 8px rgba(9, 15, 21, 0.08)',
                donationCard: '0px 2px 6px rgba(25, 16, 21, 0.04)',
            },
            animation: {
                ...OmazeUI.theme.animation,
                'fill-slow': 'dash 15s linear forwards',
            },
            keyframes: {
                ...OmazeUI.theme.keyframes,
                dash: {
                    '0%': {
                        strokeDasharray: 1000,
                        strokeDashoffset: 1000,
                    },
                    '100%': { strokeDashoffset: 0 },
                },
            },
            letterSpacing: {
                ...OmazeUI.theme.letterSpacing,
                wide: '0.015em',
            },
            opacity: {
                ...OmazeUI.theme.opacity,
                25: '.25',
            },
        },
        colors: {
            ...OmazeUI.theme.colors,
            'transparent-black': 'rgba(0, 0, 0, 0)',
        },
    },
    variants: {
        ...OmazeUI.variants,
        extends: {
            ...(OmazeUI.variants?.extends || {}),
            margin: [...(OmazeUI.variants?.extends?.margin || []), 'first'],
        },
    },
    plugins: [...OmazeUI.plugins],
};

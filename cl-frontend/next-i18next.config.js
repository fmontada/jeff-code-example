// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function getVariationOfAOrAn(value, capitalize) {
    if (!value) {
        return '';
    }

    const letters = ['a', 'e', 'i', 'o', 'u', 'h'];
    const firstLetter = value.substring(0, 1)?.toLowerCase();
    const startsWithVowelOrH = letters.includes(firstLetter);
    let correctWordForm = '';
    if (startsWithVowelOrH) {
        correctWordForm = capitalize ? 'An' : 'an';
    } else {
        correctWordForm = capitalize ? 'A' : 'a';
    }

    return correctWordForm;
}

function formatWithPluralHandler(value, format, lng) {
    const isEnglish = lng === 'en';
    const handlingAnOrA = format.startsWith('en-handle-an');

    if (handlingAnOrA && isEnglish) {
        const isCapitalized = format === 'en-handle-an-capitalized';
        return getVariationOfAOrAn(value, isCapitalized);
    }

    return value;
}

module.exports = {
    i18n: {
        defaultLocale: process.env.DEFAULT_LOCALE || 'en',
        locales: process.env.LOCALES?.split(',') || ['en'],
        interpolation: {
            format: formatWithPluralHandler,
        },
    },
    serializeConfig: false,
    localePath: path.resolve('./public/locales'),
};

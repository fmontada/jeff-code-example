import { default as i18n } from 'i18next';

import common from '@/locales/en/common.json';

function getVariationOfAOrAn(value: string, capitalize: boolean) {
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

    return `${correctWordForm} ${value}`;
}

function formatWithPluralHandler(
    value: string,
    format: string | undefined,
    lng: string,
) {
    const isEnglish = lng === 'en';
    const handlingAnOrA = format.startsWith('en-handle-an');

    if (handlingAnOrA && isEnglish) {
        const isCapitalized = format === 'en-handle-an-capitalized';
        return getVariationOfAOrAn(value, isCapitalized);
    }

    return value;
}

i18n.init({
    resources: {
        en: {
            common,
        },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: true,
        format: formatWithPluralHandler,
    },
});

export default i18n;

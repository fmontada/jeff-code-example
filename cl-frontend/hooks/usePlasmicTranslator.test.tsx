/* eslint-disable camelcase */
import { ENGLISH_US_LOCALE } from '@/constants/translations';

import { usePlasmicTranslator } from './usePlasmicTranslator';

jest.mock('next-i18next', () => {
    return {
        useTranslation: () => {
            return {
                t: (str: string) => {
                    return `${str} - ${ENGLISH_US_LOCALE}`;
                },
                i18n: {
                    changeLanguage: () => {
                        return new Promise(() => {
                            return null;
                        });
                    },
                },
            };
        },
    };
});

describe('usePlasmicTranslator', (): void => {
    it('translates a key', (): void => {
        const plasmicTranslator = usePlasmicTranslator();

        const translatedText = plasmicTranslator('testing_key');

        expect(translatedText).toBe(`testing_key - ${ENGLISH_US_LOCALE}`);
    });
});

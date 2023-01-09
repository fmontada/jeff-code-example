import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import nextI18NextConfig from '../next-i18next.config.js';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

export function getServerSideTranslations(locale: string) {
    return serverSideTranslations(
        locale,
        [COMMON_TRANSLATIONS],
        nextI18NextConfig,
    );
}

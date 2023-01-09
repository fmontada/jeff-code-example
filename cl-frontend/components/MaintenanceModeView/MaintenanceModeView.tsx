import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { Layout } from '@/components/Layout';
import { COMMON_TRANSLATIONS } from '@/constants/translations';

export function MaintenanceModeView() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    const explanationMessage =
        process.env.NEXT_PUBLIC_MAINTENACE_MESSAGE ||
        t('error.maintenance.explanation');

    return (
        <Layout>
            <Head>
                <meta name="robots" content="noindex" />
                <title>{t('error.maintenance.title')} - Omaze</title>
            </Head>
            <div className="flex flex-col items-center mt-4 mx-3 md:container justify-center">
                <h2 className="mb-4 text-5xl md:text-11xl uppercase text-blue-500 font-showtime whitespace-normal text-center">
                    {t('error.maintenance.title')}
                </h2>
                <p className="text-gray-900 font-normal tracking-wide text-lg md:text-xl text-center">
                    {explanationMessage}
                </p>
            </div>
        </Layout>
    );
}

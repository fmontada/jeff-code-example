import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';

import { Layout } from '@/components/Layout';
import { COMMON_TRANSLATIONS } from '@/constants/translations';

export { getStaticProps } from '@/utils/serverSideProps';

export default function Page500() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    return (
        <Layout>
            <Head>
                <title>{t('error.500.seoTitle')} - Omaze</title>
            </Head>
            <div className="flex flex-col items-center mt-4 mx-3 md:container">
                <h2 className="mb-4 text-11xl uppercase text-blue-500 font-showtime">
                    {t('error.500.title')}
                </h2>
                <h3 className="text-gray-900 font-bold tracking-wide mb-1">
                    {t('error.500.subtitle')}
                </h3>
                <p className="text-gray-900 font-normal tracking-wide mb-4">
                    {t('error.500.explanation')}
                </p>
                <Link href={'/'} passHref>
                    <a>
                        <OzButton
                            size={BUTTON_SIZE.LARGE}
                            style={BUTTON_STYLE.PRIMARY}
                        >
                            {t('error.500.backToHome')}
                        </OzButton>
                    </a>
                </Link>
            </div>
        </Layout>
    );
}

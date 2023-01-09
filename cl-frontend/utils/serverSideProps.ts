import { getSweepstakesQuery } from '@/queries/getSweepstakesQuery';
import { IGetTranslationProps } from '@/types/general';

import { getServerSideTranslations } from './getServerSideTranslations';

async function getSsrProps({ locale }: IGetTranslationProps) {
    const [sweepstakes, translations] = await Promise.all([
        getSweepstakesQuery(),
        getServerSideTranslations(locale),
    ]);

    return {
        props: {
            sweepstakes,
            ...translations,
        },
    };
}

export async function getStaticProps(props: IGetTranslationProps) {
    return getSsrProps(props);
}

export async function getServerSideProps(props: IGetTranslationProps) {
    return getSsrProps(props);
}

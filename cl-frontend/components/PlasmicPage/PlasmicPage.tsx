import {
    ComponentRenderData,
    PlasmicComponent,
    PlasmicRootProvider,
} from '@plasmicapp/loader-nextjs';
import { useTranslation } from 'next-i18next';
import Error from 'next/error';
import Head from 'next/head';

import { PLASMIC } from '../../plasmic-init';

import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { usePlasmicTranslator } from '@/hooks/usePlasmicTranslator';
import {
    getOmazeCredentialsProviderProps,
    getStrapiCmsCredentialsProviderProps,
} from '@/utils/catchAll';

interface ISweepstakePageProps {
    filter: string;
    isSweepstakesIndex: boolean;
    plasmicData: ComponentRenderData;
    queryCache?: Record<string, any>;
}

export enum CatchallPageTestIds {
    CATCH_ALL_PAGE_CONTAINER = 'CatchAllPage__container',
}

export enum SweepstakeIndexPageTestIds {
    SWEEPSTAKE_INDEX_PAGE_CONTAINER = 'SweepstakeIndexPage__container',
    SWEEPSTAKE_INDEX_PAGE_PLASMIC_PROVIDER = 'SweepstakeIndexPage__plasmic-provider',
}

export function PlasmicPage(props: ISweepstakePageProps) {
    const { filter, isSweepstakesIndex, plasmicData, queryCache } = props;

    const translator = usePlasmicTranslator();
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
        return <Error statusCode={404} />;
    }

    const pageMeta = plasmicData.entryCompMetas[0];

    const containerTestId = isSweepstakesIndex
        ? SweepstakeIndexPageTestIds.SWEEPSTAKE_INDEX_PAGE_CONTAINER
        : CatchallPageTestIds.CATCH_ALL_PAGE_CONTAINER;

    return (
        <div data-testid={containerTestId}>
            <Head>
                {isSweepstakesIndex ? (
                    <title>{`Omaze ${t('sweepstakes.seoTitle')}`}</title>
                ) : null}
            </Head>
            <PlasmicRootProvider
                loader={PLASMIC}
                prefetchedData={plasmicData}
                prefetchedQueryData={queryCache}
                translator={translator}
                globalContextsProps={{
                    strapiCredentialsProviderProps:
                        getStrapiCmsCredentialsProviderProps(),
                    ozCredentialsProviderProps:
                        getOmazeCredentialsProviderProps(),
                }}
                data-testid={
                    isSweepstakesIndex
                        ? SweepstakeIndexPageTestIds.SWEEPSTAKE_INDEX_PAGE_PLASMIC_PROVIDER
                        : undefined
                }
            >
                {
                    // plasmicData.entryCompMetas[0].name contains the name
                    // of the component you fetched.
                }
                <PlasmicComponent
                    component={pageMeta.name}
                    componentProps={{
                        strapi: filter ? { filter } : undefined,
                    }}
                />
            </PlasmicRootProvider>
        </div>
    );
}

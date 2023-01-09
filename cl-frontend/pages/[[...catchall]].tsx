import { ComponentRenderData } from '@plasmicapp/loader-nextjs';
import * as React from 'react';

import { PLASMIC } from '../plasmic-init';

import { Sweepstakes } from '@/api/sweepstakes';
import { PlasmicPage } from '@/components/PlasmicPage';
import { SweepstakePage } from '@/components/SweepstakePage';
import { PLASMIC_SWEEPSTAKE_SLUG_ROUTE } from '@/constants/plasmic';
import { getSweepstakeRoute } from '@/constants/routes';
import { getSweepstakesQuery } from '@/queries/getSweepstakesQuery';
import { IGetTranslationProps } from '@/types/general';
import { IStrapiSweepstake } from '@/types/strapi';
import { getSweepstakesApi } from '@/utils/api';
import { getPropsByPage } from '@/utils/catchAll';
import { getServerSideTranslations } from '@/utils/getServerSideTranslations';

/**
 * Use fetchPages() to fetch list of pages that have been created in Plasmic
 */
export async function getStaticPaths() {
    const sweepsApi = getSweepstakesApi();

    const [
        pages,
        {
            data: { sweepstakes },
        },
    ] = await Promise.all([PLASMIC.fetchPages(), sweepsApi.getSweepstakes()]);

    const plasmicPagesToIgnore =
        process.env.PLASMIC_PAGES_TO_IGNORE?.split(',') || [];

    const filteredPlasmicPages = pages.filter(
        (page) => !plasmicPagesToIgnore.includes(page.path),
    );

    const plasmicPaths = filteredPlasmicPages.map((page) => {
        return {
            params: { catchall: page.path.substring(1).split('/') },
        };
    });

    const sweepstakesPagesToIgnore =
        process.env.SWEEPS_PAGES_TO_IGNORE?.split(',') || [];

    const sweepstakesPaths = sweepstakes
        .filter(
            (sweepstake) => !sweepstakesPagesToIgnore.includes(sweepstake.slug),
        )
        .map((sweepstake) => {
            return {
                params: {
                    catchall: getSweepstakeRoute(sweepstake.slug)
                        .substring(1)
                        .split('/'),
                },
            };
        });

    return {
        paths: [...plasmicPaths, ...sweepstakesPaths],
        fallback: false,
    };
}

export interface ICatchAllStaticProps extends IGetTranslationProps {
    params: {
        catchall: string[] | string;
    };
}

export async function getStaticProps(context: ICatchAllStaticProps) {
    const { catchall } = context.params ?? {};

    // Convert the catchall param into a path string
    const plasmicPath =
        typeof catchall === 'string'
            ? catchall
            : Array.isArray(catchall)
            ? `/${catchall.join('/')}`
            : '/';

    const isSweepstakesIndex = plasmicPath === '/sweepstakes';
    const isSweepstakeDetail =
        plasmicPath.startsWith('/sweepstakes/') &&
        plasmicPath.split('/').length === 3;
    const plasmicComponentsPath = isSweepstakeDetail
        ? PLASMIC_SWEEPSTAKE_SLUG_ROUTE
        : plasmicPath;

    const [plasmicData, sweepstakes, translations] = await Promise.all([
        PLASMIC.maybeFetchComponentData(plasmicComponentsPath),
        getSweepstakesQuery(),
        getServerSideTranslations(context.locale),
    ]);

    const { filter, queryCache, strapiData, sweepstakeSlug, sweepstakeData } =
        await getPropsByPage({
            isSweepstakeDetail,
            isSweepstakesIndex,
            plasmicData,
            plasmicPath,
        });

    const props: ICatchAllPageProps = {
        filter,
        isSweepstakeDetail,
        isSweepstakesIndex,
        plasmicData,
        queryCache,
        strapiData: strapiData || null,
        sweepstakes,
        sweepstakeData: sweepstakeData || null,
        sweepstakeSlug: sweepstakeSlug || null,
        ...translations,
    };

    // This is a path that Plasmic knows about; pass the data in as props
    if (plasmicData && !isSweepstakeDetail && !isSweepstakesIndex) {
        return {
            props,
            revalidate: 300,
        };
    } else {
        return {
            props,
        };
    }
}

interface ICatchAllPageProps {
    filter?: string;
    isSweepstakeDetail: boolean;
    isSweepstakesIndex: boolean;
    plasmicData?: ComponentRenderData;
    queryCache?: Record<string, any>;
    strapiData?: IStrapiSweepstake;
    sweepstakes: Sweepstakes[];
    sweepstakeData?: Sweepstakes;
    sweepstakeSlug?: string;
}

export default function CatchallPage(props: ICatchAllPageProps) {
    const {
        filter,
        isSweepstakeDetail,
        isSweepstakesIndex,
        plasmicData,
        queryCache,
        strapiData,
        sweepstakeData,
        sweepstakeSlug,
    } = props;

    if (isSweepstakeDetail) {
        return (
            <SweepstakePage
                plasmicData={plasmicData}
                queryCache={queryCache}
                slug={sweepstakeSlug}
                strapiData={strapiData}
                sweepstakeData={sweepstakeData}
            />
        );
    }

    return (
        <PlasmicPage
            filter={filter}
            isSweepstakesIndex={isSweepstakesIndex}
            plasmicData={plasmicData}
            queryCache={queryCache}
        />
    );
}

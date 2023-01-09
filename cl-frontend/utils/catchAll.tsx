import {
    ComponentRenderData,
    PlasmicComponent,
    PlasmicRootProvider,
    extractPlasmicQueryData,
} from '@plasmicapp/loader-nextjs';

import { PLASMIC } from '../plasmic-init';

import { SweepsStatus, Sweepstakes } from '@/api/sweepstakes';
import { IOzCredentialsProviderProps } from '@/components/OzCredentialProvider';
import { StrapiCredentialsProviderProps } from '@/components/Strapi';
import { QUERY_FILTER } from '@/constants/strapi';
import { getStrapiSweepstakeBySlugQuery } from '@/queries/getStrapiSweepstakeBySlugQuery';
import { getSweepstakeBySlug } from '@/queries/getSweepstakeBySlug';
import { getSweepstakesQuery } from '@/queries/getSweepstakesQuery';

export function getStrapiCmsCredentialsProviderProps(): StrapiCredentialsProviderProps {
    const host = process.env.NEXT_PUBLIC_STRAPI_HOST;
    const token = process.env.NEXT_PUBLIC_STRAPI_PUBLIC_TOKEN;

    if (!host) {
        throw 'NEXT_PUBLIC_STRAPI_HOST env var must be set';
    }
    if (!token) {
        throw 'NEXT_PUBLIC_STRAPI_PUBLIC_TOKEN env var must be set';
    }

    return {
        host,
        token,
    };
}

export function getOmazeCredentialsProviderProps(): IOzCredentialsProviderProps {
    const host = process.env.NEXT_PUBLIC_API_ENDPOINT;

    if (!host) {
        throw 'NEXT_PUBLIC_API_ENDPOINT env var must be set';
    }
    return {
        host,
    };
}

export async function getQueryCache(
    plasmicData: ComponentRenderData,
    plasmicPath: string,
    filter: string,
    ozfetcher?: { slug: string; sweepstakeData: Record<string, any> },
) {
    const response = await extractPlasmicQueryData(
        <PlasmicRootProvider
            loader={PLASMIC}
            prefetchedData={plasmicData}
            globalContextsProps={{
                strapiCredentialsProviderProps:
                    getStrapiCmsCredentialsProviderProps(),
                ozCredentialsProviderProps: getOmazeCredentialsProviderProps(),
            }}
        >
            <PlasmicComponent
                component={plasmicPath}
                componentProps={{
                    ozfetcher,
                    strapi: {
                        filter,
                    },
                }}
            />
        </PlasmicRootProvider>,
    );

    return response;
}

export function getStrapiFilter(slug: string) {
    return `filters[slug]=${slug}&populate[0]=${QUERY_FILTER}`;
}

export async function getPropsByPage(params: {
    isSweepstakeDetail: boolean;
    isSweepstakesIndex: boolean;
    plasmicData: ComponentRenderData;
    plasmicPath: string;
}) {
    const { isSweepstakeDetail, isSweepstakesIndex, plasmicData, plasmicPath } =
        params;

    let filter = null;
    let queryCache = null;
    let strapiData = null;
    let sweepstakeSlug = null;
    let sweepstakeData = null;

    if (isSweepstakesIndex) {
        filter = 'populate[0]=heroImage,heroImageMobile,details,charityInfo';
        const sweepstakes = await getSweepstakesQuery();
        if (sweepstakes !== null) {
            (
                sweepstakes.filter(
                    (sweepstake) => sweepstake.status === SweepsStatus.Open,
                ) || []
            ).forEach((sweep: Sweepstakes) => {
                filter = `${filter}&filters[slug]=${sweep.slug}`;
            });
        }

        queryCache = await getQueryCache(plasmicData, plasmicPath, filter);
    }

    if (isSweepstakeDetail) {
        sweepstakeSlug = plasmicPath.split('/')[2];
        sweepstakeData = await getSweepstakeBySlug(sweepstakeSlug);
        queryCache = await getQueryCache(
            plasmicData,
            plasmicPath,
            getStrapiFilter(sweepstakeSlug),
            {
                slug: sweepstakeSlug,
                sweepstakeData,
            },
        );
        strapiData = await getStrapiSweepstakeBySlugQuery({
            queryKey: [, sweepstakeSlug],
        });
    }

    return {
        filter,
        queryCache,
        strapiData,
        sweepstakeSlug,
        sweepstakeData,
    };
}

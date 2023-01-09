import {
    ComponentRenderData,
    PlasmicComponent,
    PlasmicRootProvider,
} from '@plasmicapp/loader-nextjs';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { PLASMIC } from '../../plasmic-init';

import { Sweepstakes } from '@/api/sweepstakes';
import { PLASMIC_SWEEPSTAKE_SLUG_ROUTE } from '@/constants/plasmic';
import { IStrapiSweepstake } from '@/types/strapi';
import {
    getOmazeCredentialsProviderProps,
    getStrapiCmsCredentialsProviderProps,
} from '@/utils/catchAll';
import { addDataLayer, convertToGtmLineItems } from '@/utils/gtm/main';
import { getStrapiFilter } from '@/utils/plasmic';

interface ISweepstakePageProps {
    plasmicData?: ComponentRenderData;
    queryCache?: Record<string, any>;
    slug: string;
    strapiData: IStrapiSweepstake;
    sweepstakeData: Sweepstakes;
}

export enum SweepstakePageTestIds {
    SWEEPSTAKE_PAGE_PLASMIC_PROVIDER = 'SweepstakePage__plasmic-provider',
}

export function SweepstakePage({
    plasmicData,
    queryCache,
    slug,
    strapiData,
    sweepstakeData,
}: ISweepstakePageProps) {
    const [trackingDone, setTrackingDone] = useState(false);

    useEffect(() => {
        if (trackingDone) {
            return;
        }

        const firstPrice = sweepstakeData?.prices?.[0];

        if (!firstPrice) {
            return;
        }

        addDataLayer({
            dataLayer: {
                ecommerce: null,
            },
        });

        addDataLayer({
            dataLayer: {
                event: 'view_item',
                ecommerce: {
                    items: convertToGtmLineItems([
                        {
                            sweepstake: sweepstakeData,
                            external_id: firstPrice.external_id,
                            amount: firstPrice.price,
                            quantity: 1,
                        },
                    ]),
                },
            },
        });

        setTrackingDone(true);
    }, [sweepstakeData, trackingDone]);

    if (!sweepstakeData) {
        return null;
    }

    const tags = [
        sweepstakeData?.primary_tag,
        sweepstakeData?.secondary_tag,
    ].filter((tag) => Boolean(tag));

    const pageTitle =
        strapiData?.attributes?.details?.detailsTitle || sweepstakeData?.title;

    return (
        <PlasmicRootProvider
            loader={PLASMIC}
            prefetchedData={plasmicData}
            prefetchedQueryData={queryCache}
            globalContextsProps={{
                strapiCredentialsProviderProps:
                    getStrapiCmsCredentialsProviderProps(),
                ozCredentialsProviderProps: getOmazeCredentialsProviderProps(),
            }}
            data-testid={SweepstakePageTestIds.SWEEPSTAKE_PAGE_PLASMIC_PROVIDER}
        >
            <Head>
                <title>{pageTitle}</title>
                <meta property="og:site_name" content="Omaze" />
                {process.env.NEXT_PUBLIC_DOMAIN ? (
                    <meta
                        property="og:url"
                        content={`${process.env.NEXT_PUBLIC_DOMAIN}/sweepstakes/${slug}`}
                    />
                ) : null}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:type" content="product" />
                <meta property="og:price:amount" content="0.00" />
                <meta property="og:price:currency" content="USD" />

                <meta name="twitter:site" content="@" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />

                <meta name="sailthru.title" content={pageTitle} />
                <meta
                    name="sailthru.description"
                    content={strapiData?.attributes?.details?.detailsSupport}
                />
                <meta
                    name="sailthru.image.full"
                    content={
                        strapiData?.attributes?.heroImage?.data?.[0]?.attributes
                            ?.url
                    }
                />
                <meta
                    name="sailthru.image.thumb"
                    content={
                        strapiData?.attributes?.heroImage?.data?.[0]?.attributes
                            ?.previewUrl
                    }
                />
                {tags.length > 0 ? (
                    <meta name="sailthru.tags" content={tags.join(',')} />
                ) : null}
                {sweepstakeData?.grand_prize?.open_date ? (
                    <meta
                        name="sailthru.date"
                        content={sweepstakeData.grand_prize.open_date.toString()}
                    />
                ) : null}
                {sweepstakeData?.grand_prize?.close_date ? (
                    <meta
                        name="sailthru.expire_date"
                        content={sweepstakeData.grand_prize.close_date.toString()}
                    />
                ) : null}
            </Head>
            <PlasmicComponent
                component={PLASMIC_SWEEPSTAKE_SLUG_ROUTE}
                componentProps={{
                    ozfetcher: {
                        slug,
                        sweepstakeData,
                    },
                    strapi: {
                        filter: getStrapiFilter(slug),
                    },
                }}
            />
        </PlasmicRootProvider>
    );
}

import axios from 'axios';

import { QUERY_FILTER } from '@/constants/strapi';
import { IStrapiSweepstake } from '@/types/strapi';

export async function getStrapiSweepstakeBySlugQuery({
    queryKey,
}): Promise<IStrapiSweepstake> {
    const [, slug] = queryKey;

    if (!slug) {
        return null;
    }

    try {
        const {
            data: { data: sweepstakeDataArray },
        } = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/sweepstakes/?populate[0]=${QUERY_FILTER}&filters[slug][$eq]=${slug}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_PUBLIC_TOKEN}`,
                },
            },
        );
        return sweepstakeDataArray?.[0];
    } catch (error) {
        console.error(`Failed to fetch strapi sweepstake by slug for ${slug}`);
        return null;
    }
}

import { useQuery } from 'react-query';

import { getStrapiSweepstakeBySlugQuery } from '@/queries/getStrapiSweepstakeBySlugQuery';

export function useStrapiSweepstakeBySlug(
    sweepstakeSlug: string,
    isEnabled: boolean,
) {
    return useQuery(
        ['strapiSweepstakeBySlug', sweepstakeSlug],
        getStrapiSweepstakeBySlugQuery,
        {
            enabled: isEnabled,
        },
    );
}

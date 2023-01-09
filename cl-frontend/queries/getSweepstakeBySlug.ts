import { Sweepstakes } from '@/api/sweepstakes';
import { getSweepstakesApi } from '@/utils/api';

export async function getSweepstakeBySlug(slug: string): Promise<Sweepstakes> {
    if (!slug) {
        return null;
    }
    try {
        const sweepsApi = getSweepstakesApi();
        const { data } = await sweepsApi.getSweepstakes(undefined, slug);
        return data.sweepstakes?.[0];
    } catch (error) {
        console.error(`Failed to fetch sweepstake by slug for ${slug}`);
        return null;
    }
}

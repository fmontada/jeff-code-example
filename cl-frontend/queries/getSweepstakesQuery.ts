import { Sweepstakes } from '@/api/sweepstakes';
import { getSweepstakesApi } from '@/utils/api';

export async function getSweepstakesQuery(): Promise<Sweepstakes[] | null> {
    try {
        const sweepstakesApi = getSweepstakesApi();
        const {
            data: { sweepstakes },
        } = await sweepstakesApi.getSweepstakes();
        return sweepstakes;
    } catch (error) {
        console.error(`Failed to fetch sweepstakes: ${error}`);
        return null;
    }
}

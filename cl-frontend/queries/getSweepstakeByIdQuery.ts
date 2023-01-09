import { Sweepstakes } from '@/api/sweepstakes';
import { getSweepstakesApi } from '@/utils/api';

export async function getSweepstakeByIdQuery({
    queryKey,
}): Promise<Sweepstakes | null> {
    const [, sweepstakeId] = queryKey;

    if (!sweepstakeId) {
        return null;
    }

    try {
        const sweepstakesApi = getSweepstakesApi();
        const { data: sweepstake } = await sweepstakesApi.getSweepstakesByID(
            sweepstakeId,
        );
        return sweepstake;
    } catch (error) {
        console.error(`Failed to fetch sweepstake by ID for ${sweepstakeId}`);
        return null;
    }
}

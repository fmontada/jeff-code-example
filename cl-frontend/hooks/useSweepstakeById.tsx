import { useQuery } from 'react-query';

import { getSweepstakeByIdQuery } from '@/queries/getSweepstakeByIdQuery';

export function useSweepstakeById(sweepstakeId: string) {
    return useQuery(['sweepstakeById', sweepstakeId], getSweepstakeByIdQuery);
}

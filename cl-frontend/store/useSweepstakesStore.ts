import { Sweepstakes } from '@/api/sweepstakes';

import { createStore } from './createStore';

export interface ISweepstakesStore {
    sweepstakes: Sweepstakes[];
}

export const useSweepstakesStore = createStore<ISweepstakesStore>({
    sweepstakes: [],
});

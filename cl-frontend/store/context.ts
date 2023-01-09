import { createContext } from 'react';

import { Sweepstakes } from '@/api/sweepstakes';

export interface ISweepstakeContext {
    sweepstakeData: Sweepstakes;
}

export const SweepstakeContext = createContext<ISweepstakeContext>({
    sweepstakeData: undefined,
});

export interface IStrapiContext {
    filter: string;
}

export const StrapiContext = createContext<IStrapiContext>({
    filter: '',
});

import { createStore } from './createStore';

export interface ISweepstakeStore {
    donationVariantsRef: HTMLDivElement;
    prizeDetailsRef: HTMLDivElement;
    heroImageRef: HTMLDivElement;
    sweepstakeRulesRef: HTMLDivElement;
    charityDetailsRef: HTMLDivElement;
}

export const useSweepstakeStore = createStore<ISweepstakeStore>({
    donationVariantsRef: undefined,
    prizeDetailsRef: undefined,
    heroImageRef: undefined,
    sweepstakeRulesRef: undefined,
    charityDetailsRef: undefined,
});

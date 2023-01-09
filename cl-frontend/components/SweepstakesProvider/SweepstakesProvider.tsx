import { PropsWithChildren, useEffect } from 'react';

import { Sweepstakes } from '@/api/sweepstakes';
import { useSweepstakesStore } from '@/store/useSweepstakesStore';

type ISweepstakesProviderProps = PropsWithChildren<
    Record<string, unknown> & { sweepstakes: Sweepstakes[] }
>;

export function SweepstakesProvider(
    props: ISweepstakesProviderProps,
): JSX.Element {
    const { children, sweepstakes } = props;
    const setSweepstakesStore = useSweepstakesStore((store) => store.set);

    useEffect(() => {
        setSweepstakesStore((store) => {
            store.sweepstakes = sweepstakes;
        });
    }, [setSweepstakesStore, sweepstakes]);

    return children as JSX.Element;
}

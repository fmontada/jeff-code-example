import { IParentProps } from '@omaze/omaze-ui/dist/shared/types/IParentProps';
import { IStyleableProps } from '@omaze/omaze-ui/dist/shared/types/IStyleableProps';
import camelCase from 'lodash.camelcase';
import {
    Children,
    ReactElement,
    cloneElement,
    useContext,
    useEffect,
    useRef,
} from 'react';

import { WinWin } from '../WinWin';

import { SweepsStatus } from '@/api/sweepstakes';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';

export function CharityDetails(props: IParentProps & IStyleableProps) {
    const { sweepstakeData } = useContext(SweepstakeContext);
    const { status: sweepstakeStatus } = sweepstakeData || {};

    const { children, className }: any = props;
    const child: ReactElement = Children.only(children);

    const charityDetailsRef = useRef<HTMLDivElement>(null);
    const setSweepstakeStore = useSweepstakeStore((store) => store.set);

    useEffect(() => {
        if (!charityDetailsRef?.current) {
            return;
        }

        setSweepstakeStore((store) => {
            store.charityDetailsRef = charityDetailsRef?.current;
        });
    }, [charityDetailsRef]);

    if (sweepstakeData.status === SweepsStatus.WinnerAnnounced) {
        return <WinWin />;
    }

    return (
        <div className={`relative ${className}`}>
            <div
                className="absolute -top-8 md:-top-10 left-0"
                ref={charityDetailsRef}
            />
            {cloneElement(child, {
                ...child.props,
                state: camelCase(sweepstakeStatus),
            })}
        </div>
    );
}

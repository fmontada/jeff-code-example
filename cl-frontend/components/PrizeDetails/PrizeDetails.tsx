import React, { useContext, useEffect, useRef } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';

import { IPrizeDetailsCard, PrizeDetailsCard } from './PrizeDetailsCard';
import { PrizeDetailsTestIds } from './PrizeDetailsTestIds';

const PrizeDetailsContainerId = 'prize-details';

export interface IPrizeDetailsProps {
    cards: IPrizeDetailsCard[];
    title: string;
}

export function PrizeDetails({ cards, title }: IPrizeDetailsProps) {
    const { sweepstakeData } = useContext(SweepstakeContext);

    const prizeDetailsRef = useRef<HTMLDivElement>(null);
    const setSweepstakeStore = useSweepstakeStore((store) => store.set);

    useEffect(() => {
        if (!prizeDetailsRef?.current) {
            return;
        }

        setSweepstakeStore((store) => {
            store.prizeDetailsRef = prizeDetailsRef?.current;
        });
    }, [prizeDetailsRef]);

    if (sweepstakeData?.status !== SweepsStatus.Open) {
        return null;
    }

    return (
        <div
            className="flex flex-col px-3 pt-4 md:pt-9 pb-6 relative"
            data-testid={PrizeDetailsTestIds.PRIZE_DETAILS_CONTAINER}
            id={PrizeDetailsContainerId}
        >
            <div className="absolute -top-12 left-0" ref={prizeDetailsRef} />
            <h3
                className="text-gray-900 font-bold text-xl md:text-3xl text-center leading-9 md:leading-9 mb-3 md:mb-9"
                data-testid={PrizeDetailsTestIds.PRIZE_DETAILS_TITLE}
            >
                {title}
            </h3>
            <div className="flex flex-col">
                {/* Find a better key without JSON.strinsify */}
                {cards.map((prizeDetailsCard, index) => {
                    return (
                        <PrizeDetailsCard
                            key={`card_in_carousel_${index}`}
                            {...prizeDetailsCard}
                        />
                    );
                })}
            </div>
        </div>
    );
}

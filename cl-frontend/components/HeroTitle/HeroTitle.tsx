import { useSelector } from '@plasmicapp/host';
import { useContext } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { SweepstakeContext } from '@/store/context';
import { IStrapiSweepstake } from '@/types/strapi';

import { HeroTitleTestIds } from './HeroTitleTestIds';

export function HeroTitle() {
    const item: IStrapiSweepstake = useSelector('strapiItem');

    const { sweepstakeData } = useContext(SweepstakeContext);
    if (!sweepstakeData) {
        return null;
    }

    const { status: sweepstakeStatus } = sweepstakeData;

    if (sweepstakeStatus === SweepsStatus.Open) {
        return null;
    }

    const title =
        sweepstakeStatus === SweepsStatus.WinnerPending
            ? item.attributes?.winnerPendingTitle
            : item.attributes?.winnerAnnounceTitle;

    return (
        <div
            className="flex flex-col py-4 px-3 md:px-0 text-gray-900 font-gellix md:w-2/3 md:text-3xl"
            data-testid={HeroTitleTestIds.HERO_TITLE_CONTAINER}
        >
            <p className="text-xl font-bold leading-relaxed my-1">{title}</p>
        </div>
    );
}

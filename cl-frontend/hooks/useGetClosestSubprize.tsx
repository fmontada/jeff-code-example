import { useSelector } from '@plasmicapp/loader-nextjs';
import { useContext } from 'react';

import { Prize } from '@/api/sweepstakes';
import { SweepstakeContext } from '@/store/context';
import { IUseGetClosestSubprizeResponse } from '@/types/components';
import { IStrapiSweepstake } from '@/types/strapi';

function getOrderedSubPrizes(subprizes: Prize[]): Prize[] {
    return subprizes
        ? subprizes.sort(
              (subPrizeA, subPrizeB) =>
                  new Date(subPrizeA.close_date).getTime() -
                  new Date(subPrizeB.close_date).getTime(),
          )
        : [];
}

export function useGetClosestSubprize(): IUseGetClosestSubprizeResponse | null {
    const { sweepstakeData } = useContext(SweepstakeContext);
    const item: IStrapiSweepstake = useSelector('strapiItem');

    if (!sweepstakeData || !item) {
        return null;
    }

    const orderedSubPrizes = getOrderedSubPrizes(sweepstakeData.subprizes);
    const openSubPrize = orderedSubPrizes.find(
        (subPrize) => new Date(subPrize.close_date) > new Date(),
    );
    const subPrizeDataInCMS = item.attributes?.subprizes?.find(
        (subPrize) => subPrize.apiId === openSubPrize?.id,
    );

    if (!openSubPrize || !subPrizeDataInCMS) {
        return null;
    }

    return {
        ...openSubPrize,
        ...subPrizeDataInCMS,
        id: openSubPrize.id,
    };
}

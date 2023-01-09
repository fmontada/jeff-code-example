import {
    COLLAPSE_SIZES,
    COLLAPSE_STYLES,
    OzCollapse,
    OzDivider,
} from '@omaze/omaze-ui';
import { useSelector } from '@plasmicapp/loader-nextjs';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { SweepstakeContext } from '@/store/context';
import { IUseGetClosestSubprizeResponse } from '@/types/components';
import { IStrapiSweepstake } from '@/types/strapi';
import { sortSubprizesByCloseDateAscNoPushBack } from '@/utils/subprizes';

import { SubprizeWinnersTestIds } from './SubprizeWinnersTestIds';

export interface ISubprizeWinnersProps {
    isOpenedByDefault?: boolean;
    showDivider?: boolean;
}

export function SubprizeWinners({
    isOpenedByDefault = false,
    showDivider = false,
}: ISubprizeWinnersProps) {
    const [isWinnersOpened, setIsWinnersOpened] = useState<boolean>(
        () => isOpenedByDefault,
    );
    const { sweepstakeData } = useContext(SweepstakeContext);
    const item: IStrapiSweepstake = useSelector('strapiItem');
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    if (!sweepstakeData || !item) {
        return null;
    }

    const isOpened = sweepstakeData.status === SweepsStatus.Open;
    if (isOpened) {
        return null;
    }

    const compoundSubprizes: IUseGetClosestSubprizeResponse[] =
        sweepstakeData.subprizes
            ?.sort(sortSubprizesByCloseDateAscNoPushBack)
            ?.map((subprize) => {
                const subprizeCmsData = item.attributes.subprizes?.find(
                    (subprizeApi) => subprizeApi.apiId === subprize.id,
                );

                if (!subprizeCmsData) {
                    return null;
                }

                return {
                    ...subprize,
                    ...subprizeCmsData,
                    id: subprize.id,
                };
            })
            .filter((subprize) => !!subprize) || [];

    const collapseButtonClassName = classNames({
        'w-full justify-between': true,
        'mb-1': isWinnersOpened,
    });

    // No component if no subprizes winners to show
    if (compoundSubprizes.length === 0) {
        return null;
    }

    return (
        <>
            {showDivider ? <OzDivider /> : null}
            <OzCollapse
                buttonClassName={collapseButtonClassName}
                style={COLLAPSE_STYLES.TEXT}
                size={COLLAPSE_SIZES.SMALL}
                expanded={isWinnersOpened}
            >
                <OzCollapse.Title>
                    <div className="flex justify-between">
                        <div
                            data-testid={
                                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_BUTTON
                            }
                            className="self-center"
                            onClick={() => setIsWinnersOpened(!isWinnersOpened)}
                        >
                            <h4 className="font-bold text-base leading-9 tracking-wide text-gray-900 md:text-med md:leading-9">
                                {t('subprizes.earlyBirdsWinners')}
                            </h4>
                        </div>
                    </div>
                </OzCollapse.Title>
                <OzCollapse.Content>
                    <ul
                        data-testid={
                            SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST
                        }
                    >
                        {compoundSubprizes.map((subprize) => {
                            const hasWinner =
                                !!subprize.winnerName &&
                                !!subprize.winnerLocation;
                            const translationKey = hasWinner
                                ? 'subprizes.winnerOf'
                                : 'subprizes.winnerPending';

                            return (
                                <li
                                    className="mt-1 first:mt-0 text-navy-900 text-sm md:text-base leading-9"
                                    key={`subprize_winner_${subprize.apiId}`}
                                    data-testid={
                                        SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST_ENTRY
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: t(translationKey, {
                                            winnerName: `<span class="font-bold">${subprize.winnerName}.</span>`,
                                            winnerLocation:
                                                subprize.winnerLocation,
                                            subprizeTitle: `<span class="font-bold">${subprize.title}</span>`,
                                        }),
                                    }}
                                />
                            );
                        })}
                    </ul>
                </OzCollapse.Content>
            </OzCollapse>
        </>
    );
}

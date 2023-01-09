import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { SubprizeWinners } from '@/components/SubprizeWinners';
import { WinnerPendingTestIds } from '@/components/WinnerPending/WinnerPendingTestIds';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { SweepstakeContext } from '@/store/context';
import { IWithClassName, IWithDataTestId } from '@/types/components';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';

export function WinnerPending(props: IWithClassName & IWithDataTestId) {
    const { 'data-testid': dataTestId } = props;
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const { sweepstakeData } = useContext(SweepstakeContext);

    if (!sweepstakeData) {
        return null;
    }

    const { status: sweepstakeStatus, winner_announce_date } = sweepstakeData;

    const isNotPending = sweepstakeStatus !== SweepsStatus.WinnerPending;

    if (isNotPending) {
        return null;
    }

    const formattedAnnouncedDate =
        formatDateToLocalString(winner_announce_date);

    return (
        <div className="flex flex-col bg-navy-50 w-full md:w-2/3 py-4 px-3 md:px-4 font-gellix">
            <div
                className="flex flex-col text-gray-900 font-gellix md:text-3xl"
                data-testid={dataTestId}
            >
                <div
                    className="text-2xl font-bold text-navy-900"
                    data-testid={WinnerPendingTestIds.WINNER_PENDING_TITLE}
                >
                    {t('sweepstake.winnerPendingLabel')}
                </div>
                <div className="text-sm leading-relaxed my-0 pt-2 italic">
                    <p
                        data-testid={
                            WinnerPendingTestIds.WINNER_PENDING_CONTENT
                        }
                        className="italic md:text-med"
                    >
                        {t('sweepstake.bodyCopyEmphasis')}
                        <time
                            className="italic inline ml-1"
                            dateTime={winner_announce_date}
                            data-testid={
                                WinnerPendingTestIds.WINNER_PENDING_FORMATTED_TIME
                            }
                        >
                            {formattedAnnouncedDate}
                        </time>
                    </p>
                </div>
            </div>
            <SubprizeWinners showDivider />
        </div>
    );
}

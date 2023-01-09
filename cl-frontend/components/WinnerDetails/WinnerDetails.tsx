import { OzHighlight } from '@omaze/omaze-ui';
import { useSelector } from '@plasmicapp/host';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useContext } from 'react';

import { YoutubeEmbed } from '../YoutubeEmbed';

import { SweepsStatus } from '@/api/sweepstakes';
import { SubprizeWinners } from '@/components/SubprizeWinners';
import { WinnerDetailsTestIds } from '@/components/WinnerDetails/WinnerDetailsTestIds';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { SweepstakeContext } from '@/store/context';
import { IWithClassName, IWithDataTestId } from '@/types/components';
import { IStrapiSweepstake } from '@/types/strapi';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';

export function WinnerDetails(props: IWithClassName & IWithDataTestId) {
    const { className = '', 'data-testid': dataTestId } = props;
    const item: IStrapiSweepstake = useSelector('strapiItem');

    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const { sweepstakeData } = useContext(SweepstakeContext);

    if (!sweepstakeData) {
        return null;
    }

    const {
        status: sweepstakeStatus,
        winner_announce_date: winnerAnnounceDate,
    } = sweepstakeData;

    const isNotAnnounced = sweepstakeStatus !== SweepsStatus.WinnerAnnounced;
    if (isNotAnnounced) {
        return null;
    }

    const formattedWinnerAnnouncedDate =
        formatDateToLocalString(winnerAnnounceDate);

    const winnerYoutubeVideo = item.attributes?.winnerInfo
        ?.winnerYoutubeLink ? (
        <YoutubeEmbed
            captionTitle={item.attributes.winnerInfo.winnerName}
            youtubeVideoUrl={item.attributes.winnerInfo.winnerYoutubeLink}
        />
    ) : null;

    const hasWinnerQuote = !!item.attributes?.winnerInfo?.winnerQuote;

    return (
        <div
            className={`flex flex-col w-full py-5 px-3 md:px-4 text-gray-900 font-gellix bg-navy-50 md:rounded-lg md:w-full md:text-3xl ${className}`}
            data-testid={dataTestId}
        >
            <div
                className={`flex justify-between ${
                    hasWinnerQuote ? '' : 'mb-4'
                }`}
            >
                <div className="flex flex-col">
                    <OzHighlight>
                        <h2
                            className="text-[32px] font-bold"
                            data-testid={
                                WinnerDetailsTestIds.WINNER_DETAILS_TITLE
                            }
                        >
                            {t('sweepstake.winnerDetailsTitle')}
                        </h2>
                    </OzHighlight>

                    <h3
                        className="text-base md:text-lg font-bold leading-relaxed my-0 pt-1 pb-[4px]"
                        data-testid={WinnerDetailsTestIds.WINNER_DETAILS_NAME}
                    >
                        {item.attributes?.winnerInfo?.winnerName}
                    </h3>
                    <address
                        className="text-sm leading-relaxed my-0 font-normal md:font-medium md:text-med md:leading-9"
                        data-testid={
                            WinnerDetailsTestIds.WINNER_DETAILS_LOCATION
                        }
                    >
                        {t('sweepstake.winnerFrom', {
                            winnerLocation:
                                item.attributes?.winnerInfo?.winnerLocation,
                        })}
                    </address>
                    <time
                        className="italic text-sm md:text-med"
                        dateTime={winnerAnnounceDate}
                        data-testid={
                            WinnerDetailsTestIds.WINNER_DETAILS_FORMATTED_TIME
                        }
                    >
                        {t('sweepstake.announcedLabel')}{' '}
                        {formattedWinnerAnnouncedDate}
                    </time>
                    {hasWinnerQuote ? (
                        <div className="mt-2 flex items-center">
                            <div className="mb-4 relative w-[50px] md:w-[32px] h-[40px]">
                                <Image
                                    className="w-[50px] md:w-[32px] h-[40px]"
                                    layout="fill"
                                    src="/assets/images/quote.svg"
                                    alt=""
                                />
                            </div>
                            <p className="text-gray-900 leading-9 text-base md:text-lg md:leading-9 tracking-wide ml-1 font-medium md:font">
                                {item.attributes?.winnerInfo?.winnerQuote}
                            </p>
                        </div>
                    ) : null}
                </div>
                {item.attributes?.winnerInfo?.winnerImage?.data?.attributes
                    ?.url ? (
                    <Image
                        src={
                            item.attributes.winnerInfo.winnerImage.data
                                .attributes.url
                        }
                        width={96}
                        height={106}
                        className="rounded-full"
                        alt={
                            item.attributes.winnerInfo.winnerImageAlt ||
                            t('sweepstake.winnerAlt')
                        }
                        layout="fixed"
                        priority
                    />
                ) : null}
            </div>
            {!!winnerYoutubeVideo ? (
                <div className="mt-4 mb-4 flex flex-col">
                    <h3 className="text-med leading-9 font-bold tracking-wide mb-2 md:leading-9 md:text-xl">
                        {t('sweepstake.seeTheirReaction')}
                    </h3>
                    {winnerYoutubeVideo}
                </div>
            ) : null}
            <SubprizeWinners />
        </div>
    );
}

import { OzLoadingSpinner } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useContext } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useStrapiSweepstakeBySlug } from '@/hooks/useStrapiSweepstakeBySlug';
import { SweepstakeContext } from '@/store/context';
import { formatWithCurrency } from '@/utils/formatNumbers';

import { WinWinTestIds } from './WinWinTestIds';

export function WinWin() {
    const { sweepstakeData } = useContext(SweepstakeContext);
    const { data: strapiData, isLoading } = useStrapiSweepstakeBySlug(
        sweepstakeData.slug,
        true,
    );
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    if (sweepstakeData.status !== SweepsStatus.WinnerAnnounced) {
        return null;
    }

    if (isLoading) {
        return <OzLoadingSpinner data-testid={WinWinTestIds.WINWIN_LOADING} />;
    }

    return (
        <div
            className="w-full flex flex-col mt-4 items-center"
            data-testid={WinWinTestIds.WINWIN_CONTAINER}
        >
            <h3
                className="font-gellix font-bold text-xl md:text-3xl leading-9 text-center tracking-wide text-gray-900"
                data-testid={WinWinTestIds.WINWIN_TITLE}
            >
                {t('sweepstake.winWin')}
            </h3>
            <div className="relative px-1 mt-4">
                <Image
                    src={'/assets/images/yellow-oval.svg'}
                    alt=""
                    width={342}
                    height={187}
                />
                <div className="absolute top-3 flex flex-col justify-center items-center">
                    <h4
                        data-testid={WinWinTestIds.WINWIN_PRICE}
                        className="text-gray-900 text-3xl font-showtime md:text-5xl"
                    >
                        {formatWithCurrency(
                            Number(
                                strapiData?.attributes?.impact
                                    ?.totalAmountRaised,
                            ),
                        )}
                    </h4>
                    <p
                        className="mt-1 text-base text-gray-900 font-gellix text-center leading-[140%] max-w-[340px]"
                        dangerouslySetInnerHTML={{
                            __html: t('sweepstake.winWinCaf', {
                                charityDetailsTitle: `<span class="font-bold">${strapiData.attributes.charityInfo.charityDetailsTitle}</span>`,
                            }),
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:w-full px-3 md:mt-6">
                <div className="flex flex-col items-center md:w-2/4 md:p-6">
                    <div className="w-[200px]">
                        <Image
                            src={
                                strapiData?.attributes?.charityInfo
                                    ?.charityDetailsCharityLogo?.data
                                    ?.attributes?.url
                            }
                            alt={
                                strapiData?.attributes?.charityInfo
                                    ?.charityDetailsCharityLogo?.data
                                    ?.attributes?.alternativeText
                            }
                            height={
                                strapiData?.attributes?.charityInfo
                                    ?.charityDetailsCharityLogo?.data
                                    ?.attributes?.height
                            }
                            width={
                                strapiData?.attributes?.charityInfo
                                    ?.charityDetailsCharityLogo?.data
                                    ?.attributes?.width
                            }
                        />
                    </div>
                    <p className="text-gray-900 leading-9 tracking-wide text-lg font-medium pt-2 md:pt-0 text-center">
                        {
                            strapiData?.attributes?.charityInfo
                                ?.charityDetailsBody
                        }
                    </p>
                </div>
                <div className="flex flex-col items-center mt-7 md:mt-0 rounded-lg bg-navy-50 justify-center md:w-2/4 p-3">
                    <p className="font-bold text-med leading-9 md:text-lg md:leading-9 tracking-wide text-navy-600">
                        {t('sweepstake.omazeExperienceCan')}
                    </p>
                    <p className="text-gray-900 leading-9 tracking-wide text-lg md:text-xl md:leading-9 font-medium pt-2 text-center">
                        {strapiData?.attributes?.impact?.winDetails}
                    </p>
                </div>
            </div>
        </div>
    );
}

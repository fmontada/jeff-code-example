import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { LoadingModal } from '@/components/LoadingModal';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { usePricingButtonCallback } from '@/hooks/usePricingButtonCallback';
import { useStrapiSweepstakeBySlug } from '@/hooks/useStrapiSweepstakeBySlug';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakesStore } from '@/store/useSweepstakesStore';
import { formatCentsWithCurrency, formatNumber } from '@/utils/formatNumbers';
import { getOrderedPrices } from '@/utils/prices';

import { MoreToWinTestIds } from './MoreToWinTestIds';

export function MoreToWin() {
    const { sweepstakeData } = useContext(SweepstakeContext);
    const sweepstakes = useSweepstakesStore((store) => store.sweepstakes);
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const closestSweepstake = useMemo(() => {
        if (!sweepstakes || !Array.isArray(sweepstakes)) {
            return null;
        }

        const openedSweepstakes = sweepstakes
            .filter((sweepstake) => sweepstake.status === SweepsStatus.Open)
            .sort((a, b) => {
                return new Date(a.grand_prize.close_date) >
                    new Date(b.grand_prize.close_date)
                    ? -1
                    : 1;
            });

        return openedSweepstakes?.[0];
    }, [sweepstakes]);

    const { data: strapiData } = useStrapiSweepstakeBySlug(
        closestSweepstake?.slug,
        !!closestSweepstake,
    );

    const lowestPrice = closestSweepstake?.prices
        ? getOrderedPrices(closestSweepstake?.prices)?.[0]
        : undefined;
    const pricingButtonCallback = usePricingButtonCallback(lowestPrice);

    async function pricingCardCallback() {
        try {
            setIsLoading(true);
            await pricingButtonCallback();
            router.push('/cart');
        } catch (e) {
            setIsLoading(false);
            router.push(`/sweepstakes/${closestSweepstake?.slug}`);
        }
    }

    if (
        sweepstakeData.status === SweepsStatus.Open ||
        !closestSweepstake ||
        !strapiData
    ) {
        return null;
    }

    return (
        <>
            {isLoading ? <LoadingModal /> : null}
            <div
                className="flex flex-col mt-4 md:mt-10 mx-3 font-gellix md:w-full"
                data-testid={MoreToWinTestIds.MORE_TO_WIN_CONTAINER}
            >
                <h3
                    className="font-bold text-xl leading-9 text-center tracking-wide text-gray-900 md:text-3xl md:leading-9"
                    data-testid={MoreToWinTestIds.MORE_TO_WIN_TITLE}
                >
                    {t('sweepstake.moreToWin.title')}
                </h3>
                <div className="border-[1px] rounded-lg border-gray-200 mt-3 pb-3 md:pb-0 flex flex-col md:flex-row md:mx-6 md:mt-6">
                    <div className="w-full md:w-2/4 h-[184px] relative md:h-[370px]">
                        {strapiData.attributes?.heroImage ? (
                            <Image
                                src={
                                    strapiData.attributes.heroImage.data[0]
                                        .attributes.url
                                }
                                alt={
                                    strapiData.attributes.heroImage.data[0]
                                        .attributes.alternativeText
                                }
                                layout="fill"
                                className="rounded-t-lg md:rounded-l-lg md:rounded-r-none"
                            />
                        ) : null}
                    </div>
                    <div className="flex flex-col md:w-2/4 md:justify-center">
                        <div className="flex flex-col px-3 md:px-4">
                            <p className="text-gray-900 text-base leading-9 md:text-med md:leading-9 font-medium mt-2">
                                {lowestPrice
                                    ? t('sweepstake.moreToWin.donateTitle', {
                                          price: formatCentsWithCurrency(
                                              lowestPrice.price,
                                              lowestPrice.currency_code.toUpperCase(),
                                          ),
                                          numEntries: formatNumber(
                                              lowestPrice.entries,
                                          ),
                                      })
                                    : null}
                            </p>
                            <h3 className="text-gray-900 leading-9 text-med md:text-lg md:leading-9 font-bold mt-[4px]">
                                {strapiData.attributes.prizeDetailsTitle}
                            </h3>
                            <h4 className="text-navy-600 leading-9 text-base tracking-wide font-bold mt-2 md:text-med md:leading-9">
                                {t('cartOrder.supporting', {
                                    charityName:
                                        strapiData.attributes.charityInfo
                                            .charityDetailsTitle,
                                })}
                            </h4>
                            <div className="relative md:w-[150px]">
                                <Image
                                    src={
                                        strapiData.attributes.charityInfo
                                            .charityDetailsCharityLogo.data
                                            .attributes.url
                                    }
                                    alt={
                                        strapiData.attributes.charityInfo
                                            .charityDetailsTitle
                                    }
                                    height={
                                        strapiData.attributes.charityInfo
                                            .charityDetailsCharityLogo.data
                                            .attributes.height
                                    }
                                    width={
                                        strapiData.attributes.charityInfo
                                            .charityDetailsCharityLogo.data
                                            .attributes.width
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex items-baseline px-3 md:mt-4 w-full justify-between md:justify-start">
                            {lowestPrice ? (
                                <OzButton
                                    style={BUTTON_STYLE.PRIMARY}
                                    size={BUTTON_SIZE.MEDIUM}
                                    className="leading-9 whitespace-pre w-[117px] md:w-auto more-to-win-pricing-btn md:text-med md:leading-9"
                                    onClick={pricingCardCallback}
                                >
                                    {t('donationVariant.donate', {
                                        price: formatCentsWithCurrency(
                                            lowestPrice.price,
                                            lowestPrice.currency_code.toUpperCase(),
                                        ),
                                    })}
                                </OzButton>
                            ) : null}
                            <Link
                                href={`/sweepstakes/${closestSweepstake.slug}#donation`}
                                passHref
                            >
                                <a className="md:ml-4">
                                    <OzButton
                                        style={BUTTON_STYLE.LINK}
                                        size={BUTTON_SIZE.MEDIUM}
                                        className="!text-base !leading-[1.2] whitespace-pre"
                                    >
                                        {t(
                                            'sweepstake.moreToWin.moreEntryOptions',
                                        )}
                                    </OzButton>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

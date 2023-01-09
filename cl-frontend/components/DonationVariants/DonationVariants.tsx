import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import { useSelector } from '@plasmicapp/host';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useRef } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { PricingCard } from '@/components/PricingCard';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useGetClosestSubprize } from '@/hooks/useGetClosestSubprize';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';
import { IStrapiSweepstake } from '@/types/strapi';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';
import { getOrderedPrices } from '@/utils/prices';

import { DonationVariantsTestIds } from './DonationVariantsTestIds';

const DonationVariantContainerId = 'donation';

export function DonationVariants() {
    const item: IStrapiSweepstake = useSelector('strapiItem');
    const { sweepstakeData } = useContext(SweepstakeContext);
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const openSubPrize = useGetClosestSubprize();
    const donationVariantsRef = useRef<HTMLDivElement>(null);
    const setSweepstakeStore = useSweepstakeStore((store) => store.set);

    useEffect(() => {
        if (!donationVariantsRef?.current) {
            return;
        }

        setSweepstakeStore((store) => {
            store.donationVariantsRef = donationVariantsRef?.current;
        });
    }, [donationVariantsRef]);

    if (!sweepstakeData || sweepstakeData.status !== SweepsStatus.Open) {
        return null;
    }

    const orderedPrices = getOrderedPrices(sweepstakeData.prices);

    return (
        <div
            id={DonationVariantContainerId}
            className="w-full flex flex-col p-3 items-center justify-center font-gellix bg-navy-50 relative"
            data-testid={DonationVariantsTestIds.DONATION_VARIANT_CONTAINER}
        >
            <div className="absolute -top-9 left-0" ref={donationVariantsRef} />
            <h1 className="text-gray-900 leading-9 tracking-wide text-xl md:text-3xl font-bold mb-2 text-center">
                {item.attributes?.details?.detailsTitle}
            </h1>
            <h3
                className="text-navy-600 font-bold text-med md:text-lg leading-9 md:leading-9 text-center mb-2 w-full md:w-2/3 lg:w-2/4"
                data-testid={DonationVariantsTestIds.DONATION_VARIANT_TITLE}
            >
                {item.attributes?.donationVariantsTitle}
            </h3>
            {!!openSubPrize ? (
                <div
                    className="p-2 font-bold text-med text-gray-900 rounded bg-pink-500 mb-5"
                    data-testid={
                        DonationVariantsTestIds.DONATION_VARIANT_SUBPRIZE
                    }
                    data-test-subprize={openSubPrize.id}
                >
                    {t('donationVariant.subprize', {
                        endDate: formatDateToLocalString(
                            openSubPrize.close_date,
                            {
                                year: undefined,
                            },
                        ),
                        prize: openSubPrize.title,
                    })}
                </div>
            ) : null}
            <div
                className="flex flex-wrap flex-col items-center w-full md:w-3/5 lg:w-2/6"
                data-testid={DonationVariantsTestIds.DONATION_VARIANT_CARDS}
            >
                {orderedPrices.map((priceObject, index) => {
                    return (
                        <PricingCard
                            priceObject={priceObject}
                            key={`donation_pricing_card_${index}`}
                        />
                    );
                })}
                <OzButton
                    className="cursor-pointer border-0 whitespace-pre w-11/12 md:w-2/3 text-med md:text-lg my-1"
                    data-testid={
                        DonationVariantsTestIds.DONATION_VARIANT_WITHOUT_CONTRIBUTING_BTN
                    }
                    size={BUTTON_SIZE.MEDIUM}
                    style={BUTTON_STYLE.PRIMARY}
                >
                    {t('donationVariant.enterWithoutContributing')}
                </OzButton>
            </div>
        </div>
    );
}

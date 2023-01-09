import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Price } from '@/api/sweepstakes';
import { Banner, BannerTypes } from '@/components/Banner';
import { Card } from '@/components/Card';
import { LoadingModal } from '@/components/LoadingModal';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { usePricingButtonCallback } from '@/hooks/usePricingButtonCallback';
import { formatCentsWithCurrency, formatNumber } from '@/utils/formatNumbers';

import { PricingCardTestIds } from './PricingCardTestIds';

export interface IPricingCardProps {
    priceObject: Price;
}

export function PricingCard({ priceObject }: IPricingCardProps) {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const pricingButtonCallback = usePricingButtonCallback(priceObject);

    async function ctaCallback() {
        setIsLoading(true);

        try {
            await pricingButtonCallback();
            router.push('/cart');
        } catch (error) {
            console.error(error);
            setErrorMessage(t('checkout.error'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Card
                className="w-full mb-2 flex justify-between items-center p-2 text-gray-900 border-[1px] border-navy-200 shadow-donationCard"
                data-testid={PricingCardTestIds.PRICING_CARD_CONTAINER}
                ignoreShadowClass
            >
                <h4
                    data-testid={PricingCardTestIds.PRICING_CARD_TITLE}
                    className="text-gray-900 text-lg md:text-xl font-bold leading-9 tracking-wide"
                >
                    {t('general.entries', {
                        numEntries: formatNumber(priceObject.entries),
                    })}
                </h4>
                <OzButton
                    className="cursor-pointer border-0 whitespace-pre w-2/4 text-med md:text-lg md:w-[182px]"
                    data-testid={PricingCardTestIds.PRICING_CARD_CTA}
                    onClick={ctaCallback}
                    size={BUTTON_SIZE.MEDIUM}
                    style={BUTTON_STYLE.PRIMARY}
                >
                    {t('donationVariant.donate', {
                        price: formatCentsWithCurrency(
                            priceObject.price,
                            priceObject.currency_code.toUpperCase(),
                        ),
                    })}
                </OzButton>
            </Card>
            {isLoading ? <LoadingModal /> : null}
            {errorMessage ? (
                <Banner delayTime={0} type={BannerTypes.ERROR}>
                    {errorMessage}
                </Banner>
            ) : null}
        </>
    );
}

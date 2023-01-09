import { IPricingCardProps } from '@/components/PricingCard';

export const MOCK_PRICING_CARD: IPricingCardProps = {
    priceObject: {
        currency_code: 'USD',
        entries: 20,
        external_id: 'external-id',
        payment_link_url: 'https://www.stripe.com/external-id',
        price: 100,
    },
};

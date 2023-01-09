import { getSweepstakeRoute } from '@/constants/routes';
import { ICartStore } from '@/types/api';

export function convertCartToSailthruItems(cart: ICartStore) {
    const isLocalhost = window.location.hostname === 'localhost';
    const windowOrigin = isLocalhost
        ? 'https://dogfood.omaze.com'
        : window.location.origin;

    if (!cart?.line_items) {
        return [];
    }

    const convertedLineItems = cart.line_items?.map((item) => {
        const url = `${windowOrigin}${getSweepstakeRoute(
            item.sweepstake.slug,
        )}`;

        return {
            url,
            qty: item.quantity,
            title: item.strapiData?.attributes?.prizeDetailsTitle,
            images: {
                full: item.strapiData?.attributes?.heroImage?.data?.[0]
                    ?.attributes?.url,
            },
            price: item.amount,
        };
    });

    return convertedLineItems;
}

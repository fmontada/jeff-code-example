import { ICartStoreLineItem } from '@/types/api';
import { addDataLayer, convertToGtmLineItems } from '@/utils/gtm/main';

export function gtmAddDataLayerWithCartItems(
    lineItems: ICartStoreLineItem[],
    event,
) {
    addDataLayer({
        dataLayer: {
            ecommerce: null,
        },
    });

    addDataLayer({
        dataLayer: {
            event,
            ecommerce: {
                items: convertToGtmLineItems(lineItems),
            },
        },
    });
}

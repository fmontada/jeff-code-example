import { SAILTHRU_ACTIONS } from '@/constants/sailthru';
import { ISailthru } from '@/store/useAppStore';
import { ICartStore } from '@/types/api';

import { convertCartToSailthruItems } from './convertCartToSailthruItems';

export function purchaseEvent(
    sailthru: ISailthru,
    email: string,
    cart: ICartStore,
) {
    if (!email || !sailthru) {
        return;
    }

    sailthru.integration(SAILTHRU_ACTIONS.PURCHASE, {
        email,
        items: convertCartToSailthruItems(cart),
    });
}

import { SAILTHRU_ACTIONS } from '@/constants/sailthru';
import { useAppStore } from '@/store/useAppStore';
import { ICartStore } from '@/types/api';

import { convertCartToSailthruItems } from './convertCartToSailthruItems';

export function sailthruAddToCartEvent(email: string, cart: ICartStore) {
    const sailthru = useAppStore.getState().sailthru;

    if (!email || !sailthru) {
        return;
    }

    sailthru.integration(SAILTHRU_ACTIONS.ADD_TO_CART, {
        email,
        items: convertCartToSailthruItems(cart),
    });
}

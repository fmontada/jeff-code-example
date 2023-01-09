import { CART_STORE_VERSION } from '@/constants/stores';
import { ICartStore } from '@/types/api';

import { createPersistanceStore } from './createPersistanceStore';

export interface ICartPersistedStore {
    cart: ICartStore | null;
    email: string | null;
}

export const useCartStore = createPersistanceStore<ICartPersistedStore>(
    {
        cart: null,
        email: null,
    },
    'omazeCart',
    CART_STORE_VERSION,
);

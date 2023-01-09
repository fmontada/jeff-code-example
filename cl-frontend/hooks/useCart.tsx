import { useEffect, useState } from 'react';

import { Cart } from '@/api/orders';
import { useCartStore } from '@/store/useCartStore';
import { ICartStore } from '@/types/api';
import { getCartApi } from '@/utils/api';
import { appendStripeDataToCart } from '@/utils/formatter';

export interface IUseCartResponse {
    cart: ICartStore | null;
    isLoading: boolean;
}

export function useCart(): IUseCartResponse {
    const cartData = useCartStore((store) => store.cart);
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!cartData) {
            setCart(null);
            setIsLoading(false);
            return;
        }

        async function fetchCart() {
            try {
                const cartApi = getCartApi();
                const { data: cartResponse } = await cartApi.getV1CartById(
                    cartData.id,
                );
                const newCart = await appendStripeDataToCart(cartResponse);

                setCart(newCart);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCart();
    }, [cartData]);

    return {
        isLoading,
        cart,
    };
}

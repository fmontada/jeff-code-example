import { useQuery } from 'react-query';

import { CartItem } from '@/api/orders';
import { Price } from '@/api/sweepstakes';
import { getUserQuery } from '@/queries/getUserQuery';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { ICartPostMiddleware, ICartStore } from '@/types/api';
import { getCartApi } from '@/utils/api';
import { appendStripeDataToCart } from '@/utils/formatter';
import { trackChangeOfCartEvent } from '@/utils/tracking/trackChangeOfCartEvent';

function createUpdatedLineItems(
    cart: ICartStore,
    priceObject: Price,
    cartBody: ICartPostMiddleware,
) {
    let priceInCart = false;
    const cartItems: CartItem[] = [];

    if (cart.line_items) {
        for (const cartLineItem of cart.line_items) {
            const newCartLineItem = { ...cartLineItem };

            if (priceObject.external_id === newCartLineItem.external_id) {
                priceInCart = true;
                newCartLineItem.quantity = newCartLineItem.quantity + 1;
            }

            cartItems.push({
                ...newCartLineItem,
                external_id: newCartLineItem.external_id,
            });
        }
    }

    if (!priceInCart) {
        cartItems.push(cartBody);
    }

    return cartItems;
}

export function usePricingButtonCallback(priceObject: Price) {
    const authorizationToken = useUserStore(
        (store) => store.authorizationToken,
    );

    const [cart, setCartStore] = useCartStore((store) => [
        store.cart,
        store.set,
    ]);

    const { data: user } = useQuery('userData', getUserQuery, {
        enabled: !!authorizationToken,
        retry: false,
    });

    if (!priceObject) {
        return null;
    }

    const cartBody: ICartPostMiddleware = {
        external_id: priceObject?.external_id,
        quantity: 1,
    };

    async function createCart() {
        const cartApi = getCartApi();
        const { data: cart } = await cartApi.postV1Cart([cartBody]);
        const newCart = await appendStripeDataToCart(cart);

        setCartStore((store) => {
            store.cart = newCart;
        });

        trackChangeOfCartEvent(user?.email, newCart);
    }

    async function updateCart() {
        const cartItems = createUpdatedLineItems(cart, priceObject, cartBody);
        const cartApi = getCartApi();
        const { data: cartResponse } = await cartApi.putV1CartById(
            cart.id,
            cartItems,
        );
        const newCart = await appendStripeDataToCart(cartResponse);

        setCartStore((store) => {
            store.cart = newCart;
        });

        trackChangeOfCartEvent(user?.email, newCart);
    }

    return cart?.id ? updateCart : createCart;
}

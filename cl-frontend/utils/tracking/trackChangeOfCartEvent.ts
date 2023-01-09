import { ICartStore } from '@/types/api';
import { gtmAddDataLayerWithCartItems } from '@/utils/gtm/gtmAddDataLayerWithCartItems';
import { sailthruAddToCartEvent } from '@/utils/sailthru/sailthruAddToCartEvent';

export function trackChangeOfCartEvent(
    email: string,
    cart: ICartStore | undefined,
) {
    sailthruAddToCartEvent(email, cart);
    gtmAddDataLayerWithCartItems(cart?.line_items, 'add_to_cart');
}

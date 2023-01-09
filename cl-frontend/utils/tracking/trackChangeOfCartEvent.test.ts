/* eslint-disable @typescript-eslint/no-var-requires */
import { MOCK_EMPTY_CART } from '@/mocks/cart';

import { trackChangeOfCartEvent } from './trackChangeOfCartEvent';

const sailthruAddToCartEvent = jest.spyOn(
    require('@/utils/sailthru/sailthruAddToCartEvent'),
    'sailthruAddToCartEvent',
);
const gtmAddDataLayerWithCartItems = jest.spyOn(
    require('@/utils/gtm/gtmAddDataLayerWithCartItems'),
    'gtmAddDataLayerWithCartItems',
);

describe('trackChangeOfCartEvent', (): void => {
    it('calls sailthru and gtm', (): void => {
        trackChangeOfCartEvent('test@msn.com', MOCK_EMPTY_CART);

        expect(sailthruAddToCartEvent).toBeCalled();
        expect(gtmAddDataLayerWithCartItems).toBeCalled();
    });
});

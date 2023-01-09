/* eslint-disable @typescript-eslint/no-var-requires */
import {
    MOCK_CART_WITH_MULTIPLE_LINE_ITEMS,
    MOCK_EMPTY_CART,
} from '@/mocks/cart';

import { gtmAddDataLayerWithCartItems } from './gtmAddDataLayerWithCartItems';

const addDataLayer = jest.spyOn(require('@/utils/gtm/main'), 'addDataLayer');

describe('gtmAddDataLayerWithCartItems', (): void => {
    beforeEach(() => {
        addDataLayer.mockClear();
    });

    it('calls dataLayer with no items in cart', (): void => {
        gtmAddDataLayerWithCartItems(MOCK_EMPTY_CART.line_items, 'add_to_cart');

        expect(addDataLayer).toHaveBeenCalledWith({
            dataLayer: {
                ecommerce: null,
            },
        });

        expect(addDataLayer).toHaveBeenCalledWith({
            dataLayer: {
                event: 'add_to_cart',
                ecommerce: {
                    items: [],
                },
            },
        });
    });

    it('calls dataLayer with the proper items in cart', (): void => {
        gtmAddDataLayerWithCartItems(
            MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items,
            'add_to_cart',
        );
        expect(addDataLayer).toHaveBeenCalledWith({
            dataLayer: {
                ecommerce: null,
            },
        });
        expect(addDataLayer).toHaveBeenCalledWith({
            dataLayer: {
                event: 'add_to_cart',
                ecommerce: {
                    items: [
                        {
                            item_id:
                                MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[0]
                                    .sweepstake.id,
                            item_name:
                                MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[0]
                                    .sweepstake.title,
                            currency: 'USD',
                            discount: 0,
                            item_brand: 'Omaze',
                            item_category: 'Sweepstake',
                            item_variant:
                                MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[0]
                                    .external_id,
                            price: '1.25',
                            quantity: 2,
                        },
                        {
                            item_id:
                                MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[1]
                                    .sweepstake.id,
                            item_name:
                                MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[1]
                                    .sweepstake.title,
                            currency: 'USD',
                            discount: 0,
                            item_brand: 'Omaze',
                            item_category: 'Sweepstake',
                            item_variant:
                                MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[1]
                                    .external_id,
                            price: '1.00',
                            quantity: 1,
                        },
                    ],
                },
            },
        });
    });
});

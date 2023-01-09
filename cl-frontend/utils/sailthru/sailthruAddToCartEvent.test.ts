import { act, renderHook } from '@testing-library/react';

import {
    MOCK_CART_WITH_MULTIPLE_LINE_ITEMS,
    MOCK_EMPTY_CART,
} from '@/mocks/cart';
import { ISailthru, useAppStore } from '@/store/useAppStore';

import { sailthruAddToCartEvent } from './sailthruAddToCartEvent';

const testEmail = 'test@mail.com';

describe('sailthruAddToCartEvent', (): void => {
    const jestMock = jest.fn();

    beforeEach(() => {
        const sailthruMock: ISailthru = {
            integration: jestMock,
        };

        const { result } = renderHook(() => useAppStore());
        act(() => {
            result.current.set((store) => {
                store.sailthru = sailthruMock;
            });
        });
    });

    it('does nothing if email is invalid', (): void => {
        sailthruAddToCartEvent(undefined, MOCK_EMPTY_CART);

        expect(jestMock).not.toHaveBeenCalled();
    });

    it('calls integration with no items in cart', (): void => {
        sailthruAddToCartEvent(testEmail, MOCK_EMPTY_CART);

        expect(jestMock).toHaveBeenCalledWith('addToCart', {
            email: testEmail,
            items: [],
        });
    });

    it('calls integration with the proper items in cart', (): void => {
        sailthruAddToCartEvent(testEmail, MOCK_CART_WITH_MULTIPLE_LINE_ITEMS);

        expect(jestMock).toHaveBeenCalledWith('addToCart', {
            email: testEmail,
            items: [
                {
                    qty: 2,
                    url: 'https://dogfood.omaze.com/sweepstakes/qa-sprinter-van-2022',
                    images: {
                        full: MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[0]
                            .strapiData.attributes.heroImage.data[0].attributes
                            .url,
                    },
                    price: MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[0]
                        .amount,
                    title: MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[0]
                        .strapiData.attributes.prizeDetailsTitle,
                },
                {
                    qty: 1,
                    url: 'https://dogfood.omaze.com/sweepstakes/qa-sprinter-van-2022',
                    images: {
                        full: MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[1]
                            .strapiData.attributes.heroImage.data[0].attributes
                            .url,
                    },
                    price: MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[1]
                        .amount,
                    title: MOCK_CART_WITH_MULTIPLE_LINE_ITEMS.line_items[1]
                        .strapiData.attributes.prizeDetailsTitle,
                },
            ],
        });
    });
});

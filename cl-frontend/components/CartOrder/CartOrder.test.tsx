import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';

import { CartOrderTestIds } from '@/components/CartOrder/CartOrderTestIds';
import { MOCK_CART } from '@/mocks/cart';
import { useCartStore } from '@/store/useCartStore';

import { CartOrder } from '.';

const queryClient = new QueryClient();

describe('CartOrder', (): void => {
    beforeAll(() => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.set((store) => {
                store.cart = MOCK_CART;
            });
        });
    });

    beforeEach(() => {
        render(
            <QueryClientProvider client={queryClient}>
                <CartOrder />
            </QueryClientProvider>,
        );
        userEvent.click(
            screen.getByTestId(CartOrderTestIds.CART_ORDER_COLLAPSE),
        );
    });

    afterAll(() => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.set((store) => {
                store.cart = undefined;
            });
        });
    });

    it('renders the image', () => {
        const image = screen.getByAltText(
            'en-US cartOrder.cartIconAlt',
        ) as HTMLImageElement;
        expect(image).toBeVisible();
        expect(image.src).toBe(
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        );
    });

    it('renders the amount', () => {
        expect(screen.getByText('$5')).toBeVisible();
    });
});

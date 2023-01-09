import {
    act,
    render,
    renderHook,
    screen,
    waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { MOCK_CART } from '@/mocks/cart';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import { MOCK_SWEEPSTAKE_DATA } from '@/mocks/sweepstakeData';
import { useCartStore } from '@/store/useCartStore';
import { ICartStoreLineItem } from '@/types/api';

import { CartOrderItem } from './CartOrderItem';
import { CartOrderTestIds } from './CartOrderTestIds';

const queryClient = new QueryClient();

const MOCK_LINE_ITEM: ICartStoreLineItem = MOCK_CART.line_items[0];

describe('CartOrderItem', (): void => {
    describe('when it has any subprize', (): void => {
        beforeEach(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <CartOrderItem
                        lineItem={MOCK_LINE_ITEM}
                        showDivider={false}
                    />
                </QueryClientProvider>,
            );

            await waitFor(() => {
                return null;
            });
        });

        afterAll(() => {
            const { result } = renderHook(() => useCartStore());

            act(() => {
                result.current.set((store) => {
                    store.cart = undefined;
                });
            });
        });

        it('renders the description', () => {
            expect(
                screen.getByTestId(CartOrderTestIds.CART_ORDER_DESCRIPTION),
            ).toBeVisible();
        });

        it('renders the number of entries', () => {
            expect(screen.getByText('en-US cartOrder.entries')).toBeVisible();
        });

        it('renders quantity', () => {
            expect(screen.getByText('en-US cartOrder.quantity')).toBeVisible();
        });

        it('renders the subpriz(es)', () => {
            const prizeTitles = screen.getByTestId(
                CartOrderTestIds.CART_ORDER_DESCRIPTION,
            );

            expect(prizeTitles).toHaveTextContent(
                'en-US cart.lineItem.noteWithSubprizes',
            );
        });
    });

    describe('when it has no subprizes', () => {
        it('renders the grand-prize but no subprizes', () => {
            const MOCK_SWEEPSTAKE_DATA_NO_SUBPRIZE = {
                ...MOCK_SWEEPSTAKE_DATA,
                subprizes: [],
            };
            const MOCK_STRAPI_SWEEPSTAKE_NO_SUBPRIZE = {
                ...MOCK_STRAPI_SWEEPSTAKE,
                subprizes: [],
            };
            const MOCK_LINE_ITEM_NO_SUBPRIZE = {
                ...MOCK_CART.line_items[0],
                sweepstake: MOCK_SWEEPSTAKE_DATA_NO_SUBPRIZE,
                strapiData: MOCK_STRAPI_SWEEPSTAKE_NO_SUBPRIZE,
            };

            render(
                <QueryClientProvider client={queryClient}>
                    <CartOrderItem
                        lineItem={MOCK_LINE_ITEM_NO_SUBPRIZE}
                        showDivider={false}
                    />
                </QueryClientProvider>,
            );

            const prizeTitles = screen.getByTestId(
                CartOrderTestIds.CART_ORDER_DESCRIPTION,
            );

            expect(prizeTitles).toBeVisible();
            expect(prizeTitles).toHaveTextContent(
                'en-US cart.lineItem.noteWithoutSubprizes',
            );
            expect(prizeTitles).not.toHaveTextContent(
                'en-US cart.lineItem.noteWithSubprizes',
            );
        });
    });
});

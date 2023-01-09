import { useAuth0 } from '@auth0/auth0-react';
import {
    act,
    fireEvent,
    render,
    renderHook,
    screen,
} from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { OrderLineItemTestIds } from '@/components/OrderLineItem/OrderLineItemTestIds';
import { MOCK_ORDERS } from '@/mocks/orders';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import AccountDonationHistoryDetailPage, {
    AccountOrderDetailPageTestIds,
} from '@/pages/account/history/detail/[orderId]';
import { useUserStore } from '@/store/useUserStore';

const redirectFn = jest.fn();
jest.mock('next/link', () => {
    return function nextLinkMocked({ children }) {
        return <div onClick={redirectFn}>{children}</div>;
    };
});

const mockedUseQuery = jest.spyOn(require('react-query'), 'useQuery');

const mockedUseStrapiSweepstakeBySlug = jest.spyOn(
    require('@/hooks/useStrapiSweepstakeBySlug'),
    'useStrapiSweepstakeBySlug',
);

jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(() => ({
        isAuthenticated: false,
        user: { email: 'test@test.com' },
        loginWithRedirect: jest.fn(),
        logout: jest.fn(),
        onRedirectCallback: jest.fn(),
    })),
    Auth0Provider: jest.fn(({ children }) => children),
}));

describe('AccountDonationHistoryDetailPage', (): void => {
    describe('User is not authenticated', () => {
        const { result } = renderHook(() => useUserStore());
        (useAuth0 as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: { email: '' },
            error: undefined,
        });

        act(() => {
            result.current.authorizationToken = undefined;
        });

        it('renders nothing', (): void => {
            act(() => {
                const queryClient = new QueryClient();

                render(
                    <QueryClientProvider client={queryClient}>
                        <AccountDonationHistoryDetailPage />
                    </QueryClientProvider>,
                );

                expect(
                    screen.queryByTestId(
                        AccountOrderDetailPageTestIds.ORDER_DETAIL_CONTAINER,
                    ),
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('User is authenticated', () => {
        beforeAll(() => {
            const { result } = renderHook(() => useUserStore());
            (useAuth0 as jest.Mock).mockReturnValue({
                isAuthenticated: true,
                isLoading: false,
                user: { email: 'nicolas@omaze.com' },
                error: undefined,
            });

            act(() => {
                result.current.authorizationToken = 'TEST_TOKEN';
            });
        });

        beforeEach(() => {
            mockedUseQuery.mockReturnValue({
                data: MOCK_ORDERS[0],
            });

            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: MOCK_STRAPI_SWEEPSTAKE,
            });

            const queryClient = new QueryClient();

            render(
                <QueryClientProvider client={queryClient}>
                    <AccountDonationHistoryDetailPage />
                </QueryClientProvider>,
            );
        });

        it('renders a container', (): void => {
            expect(
                screen.getByTestId(
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_CONTAINER,
                ),
            ).toHaveTextContent('en-US account.donationHistory.order.title');
        });

        it('renders a container with a linkback', async (): Promise<void> => {
            act(() => {
                fireEvent.click(
                    screen.getByTestId(
                        AccountOrderDetailPageTestIds.ORDER_DETAIL_BACK_TO_EXPERIENCE,
                    ),
                );

                expect(redirectFn).toHaveBeenCalled();
            });
        });

        it('renders a title', (): void => {
            expect(
                screen.getByTestId(
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_TITLE,
                ),
            ).toHaveTextContent('en-US account.donationHistory.order.title');
        });

        it('renders the date of creation', (): void => {
            expect(
                screen.getByTestId(
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_CREATED_AT,
                ),
            ).toHaveTextContent('Jul 19, 2022');
        });

        it('renders a donation total', (): void => {
            expect(
                screen.getByTestId(
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_AMOUNT,
                ),
            ).toHaveTextContent('$2,500');
        });

        it('renders all the order items', (): void => {
            expect(
                screen.getByTestId(
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_ITEMS,
                ),
            ).toBeInTheDocument();

            expect(
                screen.getAllByTestId(
                    OrderLineItemTestIds.ORDER_LINE_ITEM_CONTAINER,
                ),
            ).toHaveLength(MOCK_ORDERS[0].line_items.size);
        });

        it('renders the order subtotal', (): void => {
            expect(
                screen.getByTestId(
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_SUBTOTAL,
                ),
            ).toHaveTextContent('$2,500');
        });

        it('renders the order total', (): void => {
            expect(
                screen.getByTestId(
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_TOTAL,
                ),
            ).toHaveTextContent('$2,500');
        });
    });
});

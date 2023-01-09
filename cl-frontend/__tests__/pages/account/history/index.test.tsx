import { useAuth0 } from '@auth0/auth0-react';
import { act, render, renderHook, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { DonationHistoryEntryTestIds } from '@/components/DonationHistoryEntry/DonationHistoryEntryTestIds';
import { MOCK_ORDERS } from '@/mocks/orders';
import AccountDonationHistoryPage, {
    DonationHistoryPageTestIds,
} from '@/pages/account/history';
import { useUserStore } from '@/store/useUserStore';

const mockedUseQuery = jest.spyOn(require('react-query'), 'useQuery');

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

describe('AccountDonationHistoryPage', (): void => {
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
                        <AccountDonationHistoryPage />
                    </QueryClientProvider>,
                );

                expect(
                    screen.queryByTestId(
                        DonationHistoryPageTestIds.DONATION_HISTORY_CONTAINER,
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

        it('renders a container with a linkback and a title', (): void => {
            mockedUseQuery.mockReturnValue({
                data: [],
            });

            const queryClient = new QueryClient();

            render(
                <QueryClientProvider client={queryClient}>
                    <AccountDonationHistoryPage />
                </QueryClientProvider>,
            );

            expect(
                screen.getByTestId(
                    DonationHistoryPageTestIds.DONATION_HISTORY_CONTAINER,
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByTestId(
                    DonationHistoryPageTestIds.DONATION_HISTORY_BACK_TO_EXPERIENCE,
                ),
            ).toBeInTheDocument();
            expect(
                screen.getByTestId(
                    DonationHistoryPageTestIds.DONATION_HISTORY_TITLE,
                ),
            ).toBeInTheDocument();
        });

        it('renders an empty state', (): void => {
            mockedUseQuery.mockReturnValue({
                data: [],
            });

            const queryClient = new QueryClient();

            render(
                <QueryClientProvider client={queryClient}>
                    <AccountDonationHistoryPage />
                </QueryClientProvider>,
            );

            expect(
                screen.getByTestId(
                    DonationHistoryPageTestIds.DONATION_HISTORY_NO_ORDERS,
                ),
            ).toBeInTheDocument();
        });

        it('renders orders', (): void => {
            mockedUseQuery.mockReturnValue({
                data: MOCK_ORDERS,
            });

            const queryClient = new QueryClient();

            render(
                <QueryClientProvider client={queryClient}>
                    <AccountDonationHistoryPage />
                </QueryClientProvider>,
            );

            expect(
                screen.getByTestId(
                    DonationHistoryPageTestIds.DONATION_HISTORY_ORDERS,
                ),
            ).toBeInTheDocument();
            expect(
                screen.getAllByTestId(
                    DonationHistoryEntryTestIds.DONATION_HISTORY_CONTAINER,
                ),
            ).toHaveLength(MOCK_ORDERS.length);
            expect(
                screen.queryByTestId(
                    DonationHistoryPageTestIds.DONATION_HISTORY_NO_ORDERS,
                ),
            ).not.toBeInTheDocument();
        });
    });
});

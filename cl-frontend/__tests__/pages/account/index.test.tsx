import { useAuth0 } from '@auth0/auth0-react';
import { act, renderHook, screen } from '@testing-library/react';
import React from 'react';

import { FIRST_TIME_LOGIN_CHECK } from '@/constants/auth0';
import { renderWithQueryClient } from '@/mocks/renderWithQueryClient';
import AccountPage, { AccountTestIds } from '@/pages/account';
import { useUserStore } from '@/store/useUserStore';

jest.mock('next/router', () => ({
    useRouter: () => {
        return {
            replace: jest.fn(),
        };
    },
}));

jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(),
    Auth0Provider: jest.fn(({ children }) => children),
}));

function mockAuth0Response(
    isAuthenticated: boolean,
    isFirstLogin: boolean,
): void {
    process.env.NEXT_PUBLIC_AUTH0_NAMESPACE = 'http://omaze-cl.com';

    const userMock = {
        email: 'test@test.com',
        name: 'test',
        picture: 'https://test.com/test.jpg',
    };

    userMock[
        `${process.env.NEXT_PUBLIC_AUTH0_NAMESPACE}/${FIRST_TIME_LOGIN_CHECK}`
    ] = isFirstLogin;

    (useAuth0 as jest.Mock).mockReturnValue({
        isAuthenticated,
        user: userMock,
    });
}

function mockAuth0LoginResponse(isAuthenticated: boolean) {
    return mockAuth0Response(isAuthenticated, false);
}

function mockAuth0SignUpResponse(isAuthenticated: boolean) {
    return mockAuth0Response(isAuthenticated, true);
}

describe('AccountPage', (): void => {
    describe('on signUp', (): void => {
        it('renders no sign up banner as there is no code in query string', (): void => {
            mockAuth0SignUpResponse(true);

            const { result } = renderHook(() => useUserStore());
            act(() => {
                result.current.set((store) => {
                    store.fromAuth = false;
                });
            });

            renderWithQueryClient(<AccountPage />);

            const bannerElement: HTMLElement = screen.queryByTestId(
                AccountTestIds.LOGIN_BANNER_CONTAINER,
            );

            expect(bannerElement).not.toBeInTheDocument();
        });

        it('renders no sign up banner if user is not authenticated', (): void => {
            mockAuth0SignUpResponse(false);

            const { result } = renderHook(() => useUserStore());
            act(() => {
                result.current.set((store) => {
                    store.fromAuth = true;
                });
            });

            renderWithQueryClient(<AccountPage />);

            const bannerElement: HTMLElement = screen.queryByTestId(
                AccountTestIds.LOGIN_BANNER_CONTAINER,
            );

            expect(bannerElement).not.toBeInTheDocument();
        });

        it('renders the sign up banner if code is in query strings and user is authenticated', (): void => {
            mockAuth0SignUpResponse(true);

            const { result } = renderHook(() => useUserStore());
            act(() => {
                result.current.set((store) => {
                    store.fromAuth = true;
                });
            });

            renderWithQueryClient(<AccountPage />);

            const bannerElement: HTMLElement = screen.getByTestId(
                AccountTestIds.SIGN_UP_BANNER_CONTAINER,
            );

            expect(bannerElement).toBeInTheDocument();
            expect(bannerElement).toHaveTextContent(
                'en-US account.signUpBanner',
            );
        });
    });

    describe('on login', (): void => {
        it('renders no login banner as there is no code in query string', (): void => {
            mockAuth0LoginResponse(true);

            const { result } = renderHook(() => useUserStore());
            act(() => {
                result.current.set((store) => {
                    store.fromAuth = false;
                });
            });

            renderWithQueryClient(<AccountPage />);

            const bannerElement: HTMLElement = screen.queryByTestId(
                AccountTestIds.LOGIN_BANNER_CONTAINER,
            );

            expect(bannerElement).not.toBeInTheDocument();
        });

        it('renders no login banner if user is not authenticated', (): void => {
            mockAuth0LoginResponse(false);

            const { result } = renderHook(() => useUserStore());
            act(() => {
                result.current.set((store) => {
                    store.fromAuth = true;
                });
            });

            renderWithQueryClient(<AccountPage />);

            const bannerElement: HTMLElement = screen.queryByTestId(
                AccountTestIds.LOGIN_BANNER_CONTAINER,
            );

            expect(bannerElement).not.toBeInTheDocument();
        });

        it('renders the login banner if code is in query strings and user is authenticated', (): void => {
            mockAuth0LoginResponse(true);

            const { result } = renderHook(() => useUserStore());
            act(() => {
                result.current.set((store) => {
                    store.fromAuth = true;
                });
            });

            renderWithQueryClient(<AccountPage />);

            const bannerElement: HTMLElement = screen.getByTestId(
                AccountTestIds.LOGIN_BANNER_CONTAINER,
            );

            expect(bannerElement).toBeInTheDocument();
            expect(bannerElement).toHaveTextContent(
                'en-US account.loginBanner',
            );
        });
    });
});

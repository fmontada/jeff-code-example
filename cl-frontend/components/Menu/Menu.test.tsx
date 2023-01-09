import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import {
    act,
    fireEvent,
    renderHook,
    screen,
    waitFor,
} from '@testing-library/react';
import React from 'react';

import { Sweepstakes } from '@/api/sweepstakes';
import { renderWithQueryClient } from '@/mocks/renderWithQueryClient';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
} from '@/mocks/sweepstakeData';
import { useSweepstakesStore } from '@/store/useSweepstakesStore';

import { Menu } from './Menu';
import { MenuTestIds } from './MenuTestIds';

const closeMenuMock = jest.fn();

const redirectFn = jest.fn();
jest.mock('next/link', () => {
    return function nextLinkMocked({ children }) {
        return <div onClick={redirectFn}>{children}</div>;
    };
});

jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(() => ({
        isAuthenticated: false,
        user: undefined,
        loginWithRedirect: jest.fn(),
        logout: jest.fn(),
        onRedirectCallback: jest.fn(),
    })),
    Auth0Provider: jest.fn(({ children }) => children),
}));

describe('Menu', (): void => {
    describe('when menu is closed', () => {
        beforeEach(() => {
            (useAuth0 as jest.Mock).mockReturnValue({
                isAuthenticated: true,
            });
        });

        it('hides the menu when it is not opened', () => {
            renderWithQueryClient(
                <Auth0Provider
                    clientId="__test_client_id__"
                    domain="__test_domain__"
                >
                    <Menu closeMenu={closeMenuMock} isOpen={false} />
                </Auth0Provider>,
            );

            expect(
                screen.getByTestId(MenuTestIds.MENU_CONTAINER),
            ).toHaveAttribute('data-test-status', 'close');
        });
    });

    describe('when menu is opened', () => {
        describe('when the user is authenticated', () => {
            const logout = jest.fn();

            beforeEach(() => {
                (useAuth0 as jest.Mock).mockReturnValue({
                    isAuthenticated: true,
                    logout,
                });

                renderWithQueryClient(
                    <Auth0Provider
                        clientId="__test_client_id__"
                        domain="__test_domain__"
                    >
                        <Menu closeMenu={closeMenuMock} isOpen />
                    </Auth0Provider>,
                );
            });

            it('logout user', async (): Promise<void> => {
                await waitFor(() => {
                    fireEvent.click(
                        screen.getByTestId(MenuTestIds.MENU_LOGOUT),
                    );

                    expect(logout).toHaveBeenCalled();
                });
            });

            it('goes to the account page', async (): Promise<void> => {
                await waitFor(() => {
                    fireEvent.click(
                        screen.getByTestId(MenuTestIds.MENU_MY_ACCOUNT),
                    );

                    expect(redirectFn).toHaveBeenCalled();
                });
            });
        });

        describe('when the user is a guest', () => {
            const loginWithRedirect = jest.fn();

            beforeEach(() => {
                (useAuth0 as jest.Mock).mockReturnValue({
                    isAuthenticated: false,
                    loginWithRedirect,
                });

                renderWithQueryClient(
                    <Auth0Provider
                        clientId="__test_client_id__"
                        domain="__test_domain__"
                    >
                        <Menu closeMenu={closeMenuMock} isOpen />
                    </Auth0Provider>,
                );
            });

            it('sign up user', async (): Promise<void> => {
                await waitFor(() => {
                    fireEvent.click(
                        screen.getByTestId(MenuTestIds.MENU_SIGN_UP_BTN),
                    );

                    expect(loginWithRedirect).toHaveBeenCalled();
                });
            });

            it('login user', async (): Promise<void> => {
                await waitFor(() => {
                    fireEvent.click(
                        screen.getByTestId(MenuTestIds.MENU_LOGIN_BTN),
                    );

                    expect(loginWithRedirect).toHaveBeenCalled();
                });
            });
        });

        describe('shows past draws', () => {
            beforeEach(() => {
                (useAuth0 as jest.Mock).mockReturnValue({
                    isAuthenticated: true,
                });

                const pastSweepstakes: Sweepstakes[] = [
                    {
                        ...MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                        id: '123',
                    },
                    {
                        ...MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
                        id: '124',
                    },
                ];

                const { result } = renderHook(() => useSweepstakesStore());
                act(() => {
                    result.current.sweepstakes = pastSweepstakes;
                });

                renderWithQueryClient(
                    <Auth0Provider
                        clientId="__test_client_id__"
                        domain="__test_domain__"
                    >
                        <Menu closeMenu={closeMenuMock} isOpen />
                    </Auth0Provider>,
                );
            });

            it('shows past draws', (): void => {
                expect(
                    screen.queryAllByTestId(
                        MenuTestIds.MENU_SWEEPSTAKES_PAST_SINGLE,
                    ),
                ).toHaveLength(2);
            });

            it('shows no active sweepstakes', (): void => {
                expect(
                    screen.queryAllByTestId(
                        MenuTestIds.MENU_SWEEPSTAKES_SINGLE,
                    ),
                ).toHaveLength(0);
            });
        });

        describe('shows active draws', () => {
            beforeEach(() => {
                (useAuth0 as jest.Mock).mockReturnValue({
                    isAuthenticated: true,
                });

                const activeSweepstakes: Sweepstakes[] = [
                    {
                        ...MOCK_SWEEPSTAKE_DATA,
                        id: '123',
                    },
                    {
                        ...MOCK_SWEEPSTAKE_DATA,
                        id: '124',
                    },
                ];

                const { result } = renderHook(() => useSweepstakesStore());
                act(() => {
                    result.current.sweepstakes = activeSweepstakes;
                });

                renderWithQueryClient(
                    <Auth0Provider
                        clientId="__test_client_id__"
                        domain="__test_domain__"
                    >
                        <Menu closeMenu={closeMenuMock} isOpen />
                    </Auth0Provider>,
                );
            });

            it('shows no past draws', (): void => {
                expect(
                    screen.queryAllByTestId(
                        MenuTestIds.MENU_SWEEPSTAKES_PAST_SINGLE,
                    ),
                ).toHaveLength(0);
            });

            it('shows active sweepstakes', (): void => {
                expect(
                    screen.queryAllByTestId(
                        MenuTestIds.MENU_SWEEPSTAKES_SINGLE,
                    ),
                ).toHaveLength(2);
            });
        });
    });
});

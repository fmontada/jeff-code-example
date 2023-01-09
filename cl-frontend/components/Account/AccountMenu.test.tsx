import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { AccountMenu } from './AccountMenu';
import { AccountMenuTestIds } from './AccountTestIds';

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

describe('AccountMenu', (): void => {
    it('renders', (): void => {
        render(<AccountMenu />);

        const accountButton: HTMLElement = screen.getByTestId(
            AccountMenuTestIds.ACCOUNT_MENU_BUTTON,
        );

        expect(accountButton).toBeInTheDocument();
    });

    describe('Login', (): void => {
        it('redirect to auth0 universal login when the user click the login button', async (): Promise<void> => {
            const loginWithRedirect = jest.fn();
            (useAuth0 as jest.Mock).mockReturnValue({
                loginWithRedirect,
            });

            render(
                <Auth0Provider
                    clientId="__test_client_id__"
                    domain="__test_domain__"
                >
                    <AccountMenu />
                </Auth0Provider>,
            );

            await waitFor(async () => {
                fireEvent.click(
                    screen.getByTestId(AccountMenuTestIds.ACCOUNT_MENU_BUTTON),
                );

                expect(loginWithRedirect).toHaveBeenCalled();
            });
        });
    });

    describe('Logout', (): void => {
        it('logout user', async (): Promise<void> => {
            const logout = jest.fn();
            (useAuth0 as jest.Mock).mockReturnValue({
                isAuthenticated: true,
                logout,
            });

            render(
                <Auth0Provider
                    clientId="__test_client_id__"
                    domain="__test_domain__"
                >
                    <AccountMenu />
                </Auth0Provider>,
            );

            await waitFor(() => {
                fireEvent.click(
                    screen.getByTestId(
                        AccountMenuTestIds.ACCOUNT_MENU_LOGOUT_BUTTON,
                    ),
                );

                expect(logout).toHaveBeenCalled();
            });
        });
    });
});

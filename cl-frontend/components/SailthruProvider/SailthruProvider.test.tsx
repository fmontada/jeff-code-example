import { useAuth0 } from '@auth0/auth0-react';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { SAILTHRU_WEB_SOURCE } from '@/constants/sailthru';

import { SailthruProvider } from './SailthruProvider';

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

describe('SailthruProvider', (): void => {
    const DUMMY_TEXT = 'test';
    const DUMMY_COMPONENT = <div>{DUMMY_TEXT}</div>;

    const integration = jest.fn();

    beforeEach(() => {
        window.Sailthru = {
            integration,
        };
    });

    it('does nothing if there is no user', async (): Promise<void> => {
        (useAuth0 as jest.Mock).mockReturnValue({
            user: null,
        });

        render(<SailthruProvider>{DUMMY_COMPONENT}</SailthruProvider>);

        const dummyText = await waitFor(() => screen.getByText(DUMMY_TEXT));

        expect(dummyText).toBeInTheDocument();
        expect(integration).not.toHaveBeenCalled();
    });

    it('tracks the user if it has an email', async (): Promise<void> => {
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

        const testEmail = 'test@msn.com';

        (useAuth0 as jest.Mock).mockReturnValue({
            user: { email: testEmail },
        });

        render(<SailthruProvider>{DUMMY_COMPONENT}</SailthruProvider>);

        const dummyText = await waitFor(() => screen.getByText(DUMMY_TEXT));

        expect(integration).toHaveBeenCalledWith('userSignUp', {
            email: testEmail,
            source: SAILTHRU_WEB_SOURCE,
        });
        expect(dummyText).toBeInTheDocument();
    });
});

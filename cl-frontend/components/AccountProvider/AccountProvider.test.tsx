import { useAuth0 } from '@auth0/auth0-react';
import { act, render, renderHook, screen } from '@testing-library/react';
import React from 'react';

import { useUserStore } from '@/store/useUserStore';

import { AccountProvider } from './AccountProvider';

jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(() => ({
        isAuthenticated: false,
        user: {
            id: '1234567',
            email: 'test@test.com',
        },
        loginWithRedirect: jest.fn(),
        logout: jest.fn(),
        onRedirectCallback: jest.fn(),
    })),
    Auth0Provider: jest.fn(({ children }) => children),
}));

const addDataLayer = jest.spyOn(require('@/utils/gtm/main'), 'addDataLayer');

describe('AccountProvider', (): void => {
    const DUMMY_TEXT = 'test';
    const DUMMY_COMPONENT = <div>{DUMMY_TEXT}</div>;

    it('calls getAccessTokenSilently from Auth0 when user is authenticated', async (): Promise<void> => {
        const { result } = renderHook(() => useUserStore());
        const getAccessTokenSilently = jest.fn();
        (useAuth0 as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: { email: '' },
            error: undefined,
            getAccessTokenSilently,
        });

        act(() => {
            result.current.authorizationToken = undefined;
        });

        render(<AccountProvider>{DUMMY_COMPONENT}</AccountProvider>);

        expect(getAccessTokenSilently).toHaveBeenCalled();
        expect(screen.getByText(DUMMY_TEXT)).toBeInTheDocument();
    });

    it('resets the authorization token when user is not authenticated', async (): Promise<void> => {
        const { result } = renderHook(() => useUserStore());
        (useAuth0 as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            user: { email: '' },
            error: undefined,
            getAccessTokenSilently: jest.fn(),
        });

        act(() => {
            result.current.set((store) => {
                store.authorizationToken = 'MOCK_TOKEN';
            });
        });

        render(<AccountProvider>{DUMMY_COMPONENT}</AccountProvider>);

        expect(result.current.authorizationToken).toBeUndefined();
        expect(screen.getByText(DUMMY_TEXT)).toBeInTheDocument();
    });

    it('adds user ID to the dataLayer', () => {
        (useAuth0 as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: {
                id: '1234567',
                email: 'test@test.com',
            },
            error: undefined,
            getAccessTokenSilently: jest.fn(),
        });

        render(<AccountProvider>{DUMMY_COMPONENT}</AccountProvider>);

        expect(addDataLayer).toHaveBeenCalledWith({
            dataLayer: { userId: '1234567' },
        });
    });
});

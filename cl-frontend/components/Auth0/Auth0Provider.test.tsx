import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { Auth0Provider } from './Auth0Provider';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(),
    Auth0Provider: jest.fn(({ children }) => children),
}));

describe('Auth0Provider', (): void => {
    it('send the user to the email verify page', async (): Promise<void> => {
        const push = jest.fn();

        useRouter.mockImplementationOnce(() => ({
            query: {
                error: 'access_denied',
                error_description: 'Please verify your email before logging in',
            },
            push,
        }));

        render(
            <Auth0Provider>
                <div>{'test'}</div>
            </Auth0Provider>,
        );

        await waitFor(() => {
            expect(push).toHaveBeenCalled();
        });
    });

    it('redirect the user to home page if email is verified', async (): Promise<void> => {
        const push = jest.fn();

        useRouter.mockImplementationOnce(() => ({
            query: {},
            push,
        }));

        const TEST_ID = 'test_id';

        render(
            <Auth0Provider>
                <div data-testid={TEST_ID}>{'test'}</div>
            </Auth0Provider>,
        );

        await waitFor(() => {
            const loginElement: HTMLButtonElement = screen.getByTestId(TEST_ID);

            expect(loginElement).toBeInTheDocument();

            expect(push).not.toHaveBeenCalled();
        });
    });
});

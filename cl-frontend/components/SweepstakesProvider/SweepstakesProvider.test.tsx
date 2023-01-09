import { act, render, renderHook, screen } from '@testing-library/react';
import React from 'react';

import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
} from '@/mocks/sweepstakeData';
import { useSweepstakesStore } from '@/store/useSweepstakesStore';

import { SweepstakesProvider } from './SweepstakesProvider';

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

describe('SweepstakesProvider', (): void => {
    const DUMMY_TEXT = 'test';
    const DUMMY_COMPONENT = <div>{DUMMY_TEXT}</div>;

    it('sets the sweepstakes store', async (): Promise<void> => {
        const { result } = renderHook(() => useSweepstakesStore());

        act(() => {
            result.current.sweepstakes = [];
        });

        render(
            <SweepstakesProvider
                sweepstakes={[
                    MOCK_SWEEPSTAKE_DATA,
                    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
                ]}
            >
                {DUMMY_COMPONENT}
            </SweepstakesProvider>,
        );

        expect(screen.getByText(DUMMY_TEXT)).toBeInTheDocument();

        act(() => {
            expect(result.current.sweepstakes).toHaveLength(3);
        });
    });
});

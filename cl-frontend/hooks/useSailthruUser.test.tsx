import { renderHook } from '@testing-library/react';
import axios from 'axios';

import { MOCK_SAILTHRU_USER } from '@/mocks/sailthru';

import { useSailthruUser } from './useSailthruUser';

jest.mock('axios');

describe('useSailthruUser', (): void => {
    describe('when no email is available', () => {
        it('returns null if no email is available', (): void => {
            const { result } = renderHook(() => useSailthruUser(null));
            expect(result.current).toBeNull();
        });
    });

    describe('when no user is registered', () => {
        (axios as unknown as jest.Mock).mockReturnValue({
            get: null,
        });

        it('returns null if no user is available', (): void => {
            const { result } = renderHook(() =>
                useSailthruUser('fake@test.msn.com'),
            );
            expect(result.current).toBeNull();
        });
    });

    describe('when user is available', () => {
        (axios as unknown as jest.Mock).mockReturnValue({
            get: () => {
                return {
                    data: MOCK_SAILTHRU_USER,
                };
            },
        });

        it('returns the user object from sailthru', (): void => {
            const { result } = renderHook(() =>
                useSailthruUser('real@test.msn.com'),
            );
            expect(result.current).toBeNull();
        });
    });
});

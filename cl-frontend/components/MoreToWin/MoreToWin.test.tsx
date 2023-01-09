import { act, renderHook, screen } from '@testing-library/react';
import React from 'react';

import { Sweepstakes } from '@/api/sweepstakes';
import { renderWithQueryClient } from '@/mocks/renderWithQueryClient';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakesStore } from '@/store/useSweepstakesStore';

import { MoreToWin } from './MoreToWin';
import { MoreToWinTestIds } from './MoreToWinTestIds';

const mockedUseStrapiSweepstakeBySlug = jest.spyOn(
    require('@/hooks/useStrapiSweepstakeBySlug'),
    'useStrapiSweepstakeBySlug',
);

describe('MoreToWin', (): void => {
    describe('sweepstake opened', () => {
        beforeEach(() => {
            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: undefined,
                isLoading: true,
            });

            const pastSweepstakes: Sweepstakes[] = [
                {
                    ...MOCK_SWEEPSTAKE_DATA,
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
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_DATA,
                    }}
                >
                    <MoreToWin />
                </SweepstakeContext.Provider>,
            );
        });

        it('includes no component', (): void => {
            const MoreToWinElement = screen.queryByTestId(
                MoreToWinTestIds.MORE_TO_WIN_CONTAINER,
            );
            expect(MoreToWinElement).not.toBeInTheDocument();
        });
    });

    describe('sweepstake not opened', () => {
        beforeEach(() => {
            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: MOCK_STRAPI_SWEEPSTAKE,
                isLoading: true,
            });

            const pastSweepstakes: Sweepstakes[] = [
                {
                    ...MOCK_SWEEPSTAKE_DATA,
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
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <MoreToWin />
                </SweepstakeContext.Provider>,
            );
        });

        it('includes the component', (): void => {
            const MoreToWinElement = screen.queryByTestId(
                MoreToWinTestIds.MORE_TO_WIN_CONTAINER,
            );
            expect(MoreToWinElement).toBeInTheDocument();
        });

        it('includes the title', (): void => {
            const MoreToWinElement = screen.queryByTestId(
                MoreToWinTestIds.MORE_TO_WIN_TITLE,
            );
            expect(MoreToWinElement).toHaveTextContent(
                'en-US sweepstake.moreToWin.title',
            );
        });
    });
});

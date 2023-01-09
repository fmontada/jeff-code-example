import { render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { WinWin } from './WinWin';
import { WinWinTestIds } from './WinWinTestIds';

const mockedUseStrapiSweepstakeBySlug = jest.spyOn(
    require('@/hooks/useStrapiSweepstakeBySlug'),
    'useStrapiSweepstakeBySlug',
);

describe('WinWin', (): void => {
    describe('data loading', () => {
        beforeEach(() => {
            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: undefined,
                isLoading: true,
            });

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <WinWin />
                </SweepstakeContext.Provider>,
            );
        });

        it('includes the spinner', (): void => {
            const WinWinElement = screen.getByTestId(
                WinWinTestIds.WINWIN_LOADING,
            );
            expect(WinWinElement).toBeInTheDocument();
        });
    });

    describe('non-winner announced', () => {
        beforeEach(() => {
            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: undefined,
                isLoading: false,
            });

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
                    }}
                >
                    <WinWin />
                </SweepstakeContext.Provider>,
            );
        });

        it('includes no spinner and no content', (): void => {
            const winWinLoading = screen.queryByTestId(
                WinWinTestIds.WINWIN_LOADING,
            );
            expect(winWinLoading).not.toBeInTheDocument();

            const winWinContainer = screen.queryByTestId(
                WinWinTestIds.WINWIN_CONTAINER,
            );
            expect(winWinContainer).not.toBeInTheDocument();
        });
    });

    describe('data loaded', () => {
        beforeEach(() => {
            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: MOCK_STRAPI_SWEEPSTAKE,
                isLoading: false,
            });

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <WinWin />
                </SweepstakeContext.Provider>,
            );
        });

        it('includes no spinner', (): void => {
            const WinWinElement = screen.queryByTestId(
                WinWinTestIds.WINWIN_LOADING,
            );
            expect(WinWinElement).not.toBeInTheDocument();
        });

        it('renders the price', (): void => {
            const price = screen.getByTestId(WinWinTestIds.WINWIN_PRICE);
            expect(price).toBeInTheDocument();
            expect(price).toHaveTextContent('$5,000');
        });

        it('renders the title', (): void => {
            const price = screen.getByTestId(WinWinTestIds.WINWIN_TITLE);
            expect(price).toBeInTheDocument();
            expect(price).toHaveTextContent('en-US sweepstake.winWin');
        });
    });
});

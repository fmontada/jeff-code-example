import { render, screen } from '@testing-library/react';
import React from 'react';

import { PrizeDetails } from '@/components/PrizeDetails';
import { mockTruthyMediaQueryMatch } from '@/mocks/matchMedia';
import { MOCK_PRIZE_DETAILS_CARDS } from '@/mocks/prizeDetails';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { PrizeDetailsTestIds } from './PrizeDetailsTestIds';

const prizeDetailTitle = 'PRIZE DETAIL TITLE';

describe('PrizeDetails', (): void => {
    beforeAll((): void => {
        mockTruthyMediaQueryMatch();
    });

    describe('when sweepstake is open', (): void => {
        beforeEach((): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_DATA,
                    }}
                >
                    <PrizeDetails
                        cards={MOCK_PRIZE_DETAILS_CARDS}
                        title={prizeDetailTitle}
                    />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders the component', (): void => {
            const container: HTMLElement = screen.getByTestId(
                PrizeDetailsTestIds.PRIZE_DETAILS_CONTAINER,
            );

            expect(container).toBeInTheDocument();
        });

        it('renders the title', (): void => {
            const container: HTMLElement = screen.getByTestId(
                PrizeDetailsTestIds.PRIZE_DETAILS_TITLE,
            );

            expect(container).toHaveTextContent(prizeDetailTitle);
        });
    });

    describe('when sweepstake is not open', (): void => {
        beforeEach((): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <PrizeDetails
                        cards={MOCK_PRIZE_DETAILS_CARDS}
                        title={prizeDetailTitle}
                    />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders no component', (): void => {
            const container: HTMLElement = screen.queryByTestId(
                PrizeDetailsTestIds.PRIZE_DETAILS_CONTAINER,
            );

            expect(container).not.toBeInTheDocument();
        });
    });
});

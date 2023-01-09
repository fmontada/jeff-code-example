import { render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { SweepstakeDetails } from './SweepstakeDetails';
import { SweepstakeDetailsTestIds } from './SweepstakeDetailsTestIds';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('SweepstakeDetails', (): void => {
    beforeAll(() => {
        useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);
    });

    describe('with an open sweepstake', (): void => {
        beforeEach(() => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeDetails
                        className="tailwind-className"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );
        });

        it('includes the data-test-id prop', (): void => {
            const sweepstakeDetailsElement = screen.getByTestId('test-id');
            expect(sweepstakeDetailsElement).toBeInTheDocument();
        });

        it('renders Details Support text', (): void => {
            expect(
                screen.getByText('Support Make A Wish and'),
            ).toBeInTheDocument();
        });

        it('renders Details Title text', (): void => {
            expect(
                screen.getByText(
                    'Win a Dream Vacation in an Overwater Villa in the Maldives',
                ),
            ).toBeInTheDocument();
        });

        it('renders Details Body text', (): void => {
            expect(
                screen.getByText(
                    'Win a 5-day vacation at The St. Regis Vommuli Resort in the Dhaalu Atoll (flights included)\\nRelax in a breathtaking overwater villa with a private deck and plunge pool overlooking coral atolls and sparkling turquoise lagoons\\nScore $5000 to spend on tailored wellness experiences, a glass-bottom kayak tour, decadent dining, and more',
                ),
            ).toBeInTheDocument();
        });

        it('renders Details Legal Text text', (): void => {
            expect(
                screen.getByText(
                    'Your safety and peace of mind are our top priority, so we’ll make sure this trip is scheduled when it’s safe. You’ll have until July 29, 2024 to book travel.',
                ),
            ).toBeInTheDocument();
        });

        it('renders Details Close Date text', (): void => {
            expect(
                screen.getByText('en-US sweepstake.closesOnLabel'),
            ).toBeInTheDocument();
        });

        it('renders Details Announced Date text', (): void => {
            expect(
                screen.getByText('en-US sweepstake.winnerAnnouncedLabel'),
            ).toBeInTheDocument();
        });

        it('renders no title', (): void => {
            expect(
                screen.queryByTestId(
                    SweepstakeDetailsTestIds.SWEEPSTAKE_DETAILS_TITLE,
                ),
            ).not.toBeInTheDocument();
        });

        it('includes the class passed by prop', (): void => {
            const sweepstakeDetailsElement = screen.getByTestId(
                SweepstakeDetailsTestIds.SWEEPSTAKE_DETAILS_CONTENT,
            );
            expect(sweepstakeDetailsElement).toHaveClass('tailwind-className');
        });
    });

    describe('without an open sweepstake', (): void => {
        beforeEach(() => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <SweepstakeDetails
                        className="tailwind-className"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders a title', (): void => {
            expect(
                screen.getByTestId(
                    SweepstakeDetailsTestIds.SWEEPSTAKE_DETAILS_TITLE,
                ),
            ).toBeInTheDocument();
        });
    });
});

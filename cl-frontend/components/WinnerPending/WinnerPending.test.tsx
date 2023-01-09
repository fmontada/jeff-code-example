import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { SubprizeWinnersTestIds } from '../SubprizeWinners/SubprizeWinnersTestIds';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import { MOCK_SWEEPSTAKE_WINNER_PENDING_DATA } from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { WinnerPending } from './WinnerPending';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('WinnerPending', (): void => {
    beforeEach(() => {
        useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);

        render(
            <SweepstakeContext.Provider
                value={{ sweepstakeData: MOCK_SWEEPSTAKE_WINNER_PENDING_DATA }}
            >
                <WinnerPending
                    className="tailwind-className"
                    data-testid="test-id"
                />
            </SweepstakeContext.Provider>,
        );
    });

    it('includes the data-test-id prop', (): void => {
        const WinnerPendingElement = screen.getByTestId('test-id');
        expect(WinnerPendingElement).toBeInTheDocument();
    });

    it('renders Winner pending title', (): void => {
        expect(
            screen.getByText('en-US sweepstake.winnerPendingLabel'),
        ).toBeInTheDocument();
    });

    it('renders Winner pending content', (): void => {
        expect(
            screen.getByText('en-US sweepstake.bodyCopyEmphasis'),
        ).toBeInTheDocument();
    });

    it('renders Announced Date text', (): void => {
        expect(screen.getByText('Dec 2, 2023')).toBeInTheDocument();
    });

    it('renders the list of subprice winners', (): void => {
        const button: HTMLElement = screen.getByTestId(
            SubprizeWinnersTestIds.SUBPRIZE_WINNERS_BUTTON,
        );

        act(() => {
            fireEvent.click(button, 'click');
        });

        expect(
            screen.getAllByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST_ENTRY,
            ),
        ).toHaveLength(MOCK_SWEEPSTAKE_WINNER_PENDING_DATA.subprizes.length);
    });
});

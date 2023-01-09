import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';
import { IStrapiSweepstake } from '@/types/strapi';

import { SubprizeWinners } from './SubprizeWinners';
import { SubprizeWinnersTestIds } from './SubprizeWinnersTestIds';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('SubprizeWinners', (): void => {
    describe('when sweepstake has winner announced and is closed', (): void => {
        beforeEach((): void => {
            useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <SubprizeWinners isOpenedByDefault={false} />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders the button with no list', (): void => {
            const button: HTMLElement = screen.getByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_BUTTON,
            );

            expect(button).toHaveTextContent(
                'en-US subprizes.earlyBirdsWinners',
            );

            const list: HTMLElement = screen.queryByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST,
            );

            expect(list).not.toBeInTheDocument();
        });

        it('renders the list after clicking the button', (): void => {
            const button: HTMLElement = screen.getByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_BUTTON,
            );

            act(() => {
                fireEvent.click(button, 'click');
            });

            const list: HTMLElement = screen.getByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST,
            );

            expect(list).toBeInTheDocument();
        });
    });

    describe('when sweepstake has winner announced and is opened', (): void => {
        beforeEach((): void => {
            useSelector.mockImplementation((): IStrapiSweepstake => {
                return {
                    ...MOCK_STRAPI_SWEEPSTAKE,
                    attributes: {
                        ...MOCK_STRAPI_SWEEPSTAKE.attributes,
                        subprizes: [
                            {
                                ...MOCK_STRAPI_SWEEPSTAKE.attributes
                                    .subprizes[0],
                                winnerName: undefined,
                                winnerLocation: undefined,
                            },
                            {
                                ...MOCK_STRAPI_SWEEPSTAKE.attributes
                                    .subprizes[1],
                                winnerName: 'John Doe',
                                winnerLocation: 'Los Angeles, CA',
                            },
                        ],
                    },
                };
            });

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <SubprizeWinners isOpenedByDefault />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders the button with a list', (): void => {
            const button: HTMLElement = screen.getByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_BUTTON,
            );

            expect(button).toHaveTextContent(
                'en-US subprizes.earlyBirdsWinners',
            );

            const list: HTMLElement = screen.getByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST,
            );

            expect(list).toBeInTheDocument();
        });

        it('renders the list of subprizes winners', (): void => {
            const entries: HTMLElement[] = screen.getAllByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST_ENTRY,
            );

            expect(entries).toHaveLength(
                MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA.subprizes.length,
            );
        });

        it('renders the different statuses of subprizes', (): void => {
            const entries: HTMLElement[] = screen.getAllByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_LIST_ENTRY,
            );

            expect(entries[0]).toHaveTextContent(
                'en-US subprizes.winnerPending',
            );
            expect(entries[1]).toHaveTextContent('en-US subprizes.winnerOf');
        });
    });

    describe('when sweepstake is open', (): void => {
        it('renders no component', (): void => {
            useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_DATA,
                    }}
                >
                    <SubprizeWinners isOpenedByDefault />
                </SweepstakeContext.Provider>,
            );

            const button: HTMLElement = screen.queryByTestId(
                SubprizeWinnersTestIds.SUBPRIZE_WINNERS_BUTTON,
            );

            expect(button).not.toBeInTheDocument();
        });
    });
});

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { SweepstakeRules } from './SweepstakeRules';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('SweepstakeRules', (): void => {
    beforeAll(() => {
        useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);
    });
    describe('with open sweepstake', (): void => {
        it('includes data-testid', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeRules data-testid="test-id" />
                </SweepstakeContext.Provider>,
            );

            const sweepstakeRules = screen.getByTestId('test-id');
            expect(sweepstakeRules).toBeInTheDocument();
        });

        it('includes className', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const sweepstakeRules = screen.getByTestId('test-id');
            expect(sweepstakeRules).toHaveClass('test-classname');
        });

        it('renders rules', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(2);

            const rule1 = screen.getByText(
                'One (1) grand prize winner (the “Winner”) and one (1) guest (“Guest”)',
            );
            expect(rule1).toBeVisible();

            const rule2 = screen.getByText(
                'Omaze, Inc. (referred to herein as “Omaze” or “Sponsor”)',
            );
            expect(rule2).toBeVisible();
        });

        it('has italics font', (): void => {
            const { container } = render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const italics = container.querySelector('.italic');
            expect(italics).toBeInTheDocument();
        });

        it('has a localized title', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const sweepstakeRulesElement = screen.getByText(
                'en-US sweepstake.rulesTitle',
            );
            expect(sweepstakeRulesElement).toBeVisible();
        });

        it('collapses when collapse button is clicked', async (): Promise<void> => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const btnCollapse = screen.getByRole('button');
            fireEvent.click(btnCollapse);

            const arrowUp = screen.queryByAltText('Arrow-Up Icon');
            expect(arrowUp).not.toBeInTheDocument();

            const arrowDown = screen.getByAltText('Arrow-Down Icon');
            expect(arrowDown).toBeVisible();
        });

        it('shows collapse button by default', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const btnCollapse = screen.getByAltText('Arrow-Up Icon');
            expect(btnCollapse).toBeVisible();
        });
    });

    describe('with closed sweepstake', (): void => {
        it('includes data-testid', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <SweepstakeRules data-testid="test-id" />
                </SweepstakeContext.Provider>,
            );

            const sweepstakeRules = screen.getByTestId('test-id');
            expect(sweepstakeRules).toBeInTheDocument();
        });

        it('expands when expands button is clicked', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const btnCollapse = screen.getByRole('button');
            fireEvent.click(btnCollapse);

            const arrowDown = screen.queryByAltText('Arrow-Down Icon');
            expect(arrowDown).not.toBeInTheDocument();

            const arrowUp = screen.getByAltText('Arrow-Up Icon');
            expect(arrowUp).toBeVisible();
        });

        it('shows expand button by default', (): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <SweepstakeRules
                        className="test-classname"
                        data-testid="test-id"
                    />
                </SweepstakeContext.Provider>,
            );

            const btnExpand = screen.getByAltText('Arrow-Down Icon');
            expect(btnExpand).toBeVisible();
        });
    });
});

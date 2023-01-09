import { render, screen } from '@testing-library/react';
import camelCase from 'lodash.camelcase';
import React from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { MOCK_SWEEPSTAKE_WINNER_PENDING_DATA } from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { CharityDetails } from './CharityDetails';

interface IMockComponentProps {
    state?: string;
}

const MOCK_DATA_TEST_ID = 'mock_data_test_id';
function MockComponent(props: IMockComponentProps) {
    return <div data-testid={MOCK_DATA_TEST_ID}> {props.state} </div>;
}

describe('CharityDetails', (): void => {
    beforeEach(() => {
        render(
            <SweepstakeContext.Provider
                value={{
                    sweepstakeData: MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
                }}
            >
                <CharityDetails>
                    <MockComponent />
                </CharityDetails>
            </SweepstakeContext.Provider>,
        );
    });

    it('renders a child component.', (): void => {
        expect(screen.queryByTestId(MOCK_DATA_TEST_ID)).toBeInTheDocument();
    });

    it('passes the state props to the the child component.', (): void => {
        expect(screen.queryByTestId(MOCK_DATA_TEST_ID)).toHaveTextContent(
            camelCase(SweepsStatus.WinnerPending),
        );
    });
});

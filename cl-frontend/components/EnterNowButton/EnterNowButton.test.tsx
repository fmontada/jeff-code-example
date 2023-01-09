import {
    act,
    fireEvent,
    render,
    renderHook,
    screen,
} from '@testing-library/react';
import React from 'react';

import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';

import { EnterNowButton } from './EnterNowButton';
import { EnterNowButtonTestIds } from './EnterNowButtonTestIds';

describe('EnterNowButton', (): void => {
    const scrollIntoViewMock = jest.fn();

    beforeEach(() => {
        const { result } = renderHook(() => useSweepstakeStore());
        const dummyRef = document.createElement('div');
        dummyRef.scrollIntoView = scrollIntoViewMock;

        act(() => {
            result.current.set((store) => {
                store.donationVariantsRef = dummyRef;
            });
        });
    });

    describe('when sweepstake is open', () => {
        beforeEach((): void => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <EnterNowButton />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders the component and its container', (): void => {
            const enterNowButtonContainer: HTMLElement = screen.getByTestId(
                EnterNowButtonTestIds.ENTER_NOW_BUTTON_CONTAINER,
            );

            expect(enterNowButtonContainer).toBeInTheDocument();

            const enterNowButton: HTMLButtonElement =
                screen.getByRole('button');

            expect(enterNowButton).toBeInTheDocument();
            expect(enterNowButton).toHaveAttribute(
                'data-testid',
                EnterNowButtonTestIds.ENTER_NOW_BUTTON,
            );
        });

        it('scrolls to the referenced element on click', async (): Promise<void> => {
            const enterNowButton: HTMLButtonElement = screen.getByTestId(
                EnterNowButtonTestIds.ENTER_NOW_BUTTON,
            );

            await act(async (): Promise<void> => {
                fireEvent.click(enterNowButton);
            });

            expect(scrollIntoViewMock).toBeCalled();
        });
    });

    describe('when sweepstake is not open', () => {
        beforeEach((): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <EnterNowButton />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders no component', (): void => {
            const enterNowButtonContainer: HTMLElement = screen.queryByTestId(
                EnterNowButtonTestIds.ENTER_NOW_BUTTON_CONTAINER,
            );

            expect(enterNowButtonContainer).not.toBeInTheDocument();

            const enterNowButton: HTMLButtonElement =
                screen.queryByRole('button');

            expect(enterNowButton).not.toBeInTheDocument();
        });
    });
});

import { act, fireEvent, renderHook, screen } from '@testing-library/react';

import { SecondaryHeaderTestIds } from '@/components/SecondaryHeader/SecondaryHeaderTestIds';
import { renderWithQueryClient } from '@/mocks/renderWithQueryClient';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';

import { SecondaryHeader } from './SecondaryHeader';

describe('SecondaryHeader', (): void => {
    const scrollIntoViewMock = jest.fn();

    beforeEach(() => {
        const { result } = renderHook(() => useSweepstakeStore());
        const dummyRef = document.createElement('div');
        dummyRef.scrollIntoView = scrollIntoViewMock;

        act(() => {
            result.current.set((store) => {
                store.donationVariantsRef = dummyRef;
                store.heroImageRef = dummyRef;
                store.sweepstakeRulesRef = dummyRef;
                store.charityDetailsRef = dummyRef;
                store.prizeDetailsRef = dummyRef;
            });
        });
    });

    it('renders the component', (): void => {
        const { container } = renderWithQueryClient(<SecondaryHeader />);

        expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('renders overview element', (): void => {
        renderWithQueryClient(<SecondaryHeader />);
        expect(
            screen.getByTestId(
                SecondaryHeaderTestIds.SECONDARY_HEADER_OVERVIEW,
            ),
        ).toBeInTheDocument();
    });

    it('scrolls to the overview element on click', async (): Promise<void> => {
        renderWithQueryClient(<SecondaryHeader />);

        const overview: HTMLButtonElement = screen.getByTestId(
            SecondaryHeaderTestIds.SECONDARY_HEADER_OVERVIEW,
        );

        await act(async (): Promise<void> => {
            fireEvent.click(overview);
        });

        expect(scrollIntoViewMock).toBeCalled();
    });

    it('renders what you will get element', (): void => {
        renderWithQueryClient(<SecondaryHeader />);
        expect(
            screen.getByTestId(
                SecondaryHeaderTestIds.SECONDARY_HEADER_WHAT_YOU_WILL_GET,
            ),
        ).toBeInTheDocument();
    });

    it('scrolls to the what you will get element on click', async (): Promise<void> => {
        renderWithQueryClient(<SecondaryHeader />);

        const whatYouWillGet: HTMLButtonElement = screen.getByTestId(
            SecondaryHeaderTestIds.SECONDARY_HEADER_WHAT_YOU_WILL_GET,
        );

        await act(async (): Promise<void> => {
            fireEvent.click(whatYouWillGet);
        });

        expect(scrollIntoViewMock).toBeCalled();
    });

    it('renders who you will help element', (): void => {
        renderWithQueryClient(<SecondaryHeader />);
        expect(
            screen.getByTestId(
                SecondaryHeaderTestIds.SECONDARY_HEADER_WHO_YOU_WILL_HELP,
            ),
        ).toBeInTheDocument();
    });

    it('scrolls to the who you will help element on click', async (): Promise<void> => {
        renderWithQueryClient(<SecondaryHeader />);

        const whoYouWillHelp: HTMLButtonElement = screen.getByTestId(
            SecondaryHeaderTestIds.SECONDARY_HEADER_WHO_YOU_WILL_HELP,
        );

        await act(async (): Promise<void> => {
            fireEvent.click(whoYouWillHelp);
        });

        expect(scrollIntoViewMock).toBeCalled();
    });

    it('renders official rules element', (): void => {
        renderWithQueryClient(<SecondaryHeader />);
        expect(
            screen.getByTestId(
                SecondaryHeaderTestIds.SECONDARY_HEADER_OFFICIAL_RULES,
            ),
        ).toBeInTheDocument();
    });

    it('scrolls to the official rules element on click', async (): Promise<void> => {
        renderWithQueryClient(<SecondaryHeader />);

        const officialRules: HTMLButtonElement = screen.getByTestId(
            SecondaryHeaderTestIds.SECONDARY_HEADER_OFFICIAL_RULES,
        );

        await act(async (): Promise<void> => {
            fireEvent.click(officialRules);
        });

        expect(scrollIntoViewMock).toBeCalled();
    });

    it('renders enter now button', (): void => {
        renderWithQueryClient(<SecondaryHeader />);
        expect(
            screen.getByTestId(
                SecondaryHeaderTestIds.SECONDARY_HEADER_ENTER_BUTTON,
            ),
        ).toBeInTheDocument();
    });

    it('scrolls to the referenced element on click', async (): Promise<void> => {
        renderWithQueryClient(<SecondaryHeader />);

        const enterNowButton: HTMLButtonElement = screen.getByTestId(
            SecondaryHeaderTestIds.SECONDARY_HEADER_ENTER_BUTTON,
        );

        await act(async (): Promise<void> => {
            fireEvent.click(enterNowButton);
        });

        expect(scrollIntoViewMock).toBeCalled();
    });
});

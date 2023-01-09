import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { SubprizeWinnersTestIds } from '../SubprizeWinners/SubprizeWinnersTestIds';
import { YoutubeEmbedTestIds } from '../YoutubeEmbed/YoutubeEmbedTestIds';

import { WinnerDetails } from '@/components/WinnerDetails';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('WinnerDetails', (): void => {
    beforeAll(() => {
        useSelector.mockImplementation(() => {
            return {
                ...MOCK_STRAPI_SWEEPSTAKE,
                attributes: {
                    ...MOCK_STRAPI_SWEEPSTAKE.attributes,
                    winnerInfo: {
                        ...MOCK_STRAPI_SWEEPSTAKE.attributes.winnerInfo,
                        winnerYoutubeLink:
                            'https://www.youtube.com/watch?v=uHmVmKcOSw4',
                    },
                },
            };
        });
    });

    beforeEach(() => {
        render(
            <SweepstakeContext.Provider
                value={{
                    sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                }}
            >
                <WinnerDetails
                    className="tailwind-className"
                    data-testid="test-id"
                />
            </SweepstakeContext.Provider>,
        );
    });

    it('includes the data-test-id prop', (): void => {
        const WinnerDetailsElement = screen.getByTestId('test-id');
        expect(WinnerDetailsElement).toBeInTheDocument();
    });

    it('renders Winner details title', (): void => {
        expect(
            screen.getByText('en-US sweepstake.winnerDetailsTitle'),
        ).toBeInTheDocument();
    });

    it('renders Winner location', (): void => {
        expect(
            screen.getByText('en-US sweepstake.winnerFrom'),
        ).toBeInTheDocument();
    });

    it('renders Announced Date text', (): void => {
        expect(
            screen.getByText('en-US sweepstake.announcedLabel Dec 2, 2023'),
        ).toBeInTheDocument();
    });

    it('renders image alt text', (): void => {
        const winnerDetailsImageElement = screen.getByTestId('test-id');
        expect(winnerDetailsImageElement).toBeInTheDocument();

        const imageElement = screen.getByAltText(
            'Winners smiling with cash',
        ) as HTMLImageElement;
        expect(imageElement.src).toMatch(
            `http://localhost/_next/image?url=${encodeURIComponent(
                MOCK_STRAPI_SWEEPSTAKE.attributes.winnerInfo.winnerImage.data
                    .attributes.url,
            )}`,
        );
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

    it('renders youtube video', (): void => {
        const youtubeVideo = screen.getByTestId(
            YoutubeEmbedTestIds.YOUTUBE_CONTAINER,
        ) as HTMLImageElement;

        expect(youtubeVideo).toBeInTheDocument();
    });
});

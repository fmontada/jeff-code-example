import { render, screen } from '@testing-library/react';
import React from 'react';

import { YoutubeEmbedTestIds } from '../YoutubeEmbed/YoutubeEmbedTestIds';

import { PrizeDetailsCard } from '@/components/PrizeDetails';
import { MOCK_PRIZE_DETAILS_CARDS } from '@/mocks/prizeDetails';

import { PrizeDetailsTestIds } from './PrizeDetailsTestIds';

describe('PrizeDetailsCard', (): void => {
    it('renders the image', (): void => {
        render(<PrizeDetailsCard {...MOCK_PRIZE_DETAILS_CARDS[0]} />);

        const imageElement: HTMLElement = screen.getByTestId(
            PrizeDetailsTestIds.PRIZE_DETAILS_CARD_IMAGE,
        );

        expect(imageElement).toBeInTheDocument();
        expect(imageElement.getAttribute('alt')).toBe(
            MOCK_PRIZE_DETAILS_CARDS[0].imageAlt,
        );
    });

    it('renders the caption', (): void => {
        render(<PrizeDetailsCard {...MOCK_PRIZE_DETAILS_CARDS[0]} />);

        const captionElement: HTMLElement = screen.getByTestId(
            PrizeDetailsTestIds.PRIZE_DETAILS_CARD_CAPTION,
        );

        expect(captionElement).toBeInTheDocument();
        expect(captionElement).toHaveTextContent(
            MOCK_PRIZE_DETAILS_CARDS[0].captionTitle,
        );
        expect(captionElement).toHaveTextContent(
            MOCK_PRIZE_DETAILS_CARDS[0].captionDescription,
        );
    });

    it('renders a youtube video and no image', (): void => {
        render(
            <PrizeDetailsCard
                {...MOCK_PRIZE_DETAILS_CARDS[0]}
                youtubeVideo="https://www.youtube.com/watch?v=uHmVmKcOSw4"
            />,
        );

        const youtubeVideo: HTMLElement = screen.getByTestId(
            YoutubeEmbedTestIds.YOUTUBE_CONTAINER,
        );

        expect(youtubeVideo).toBeInTheDocument();

        const prizeDetailsCardImage: HTMLElement = screen.queryByTestId(
            PrizeDetailsTestIds.PRIZE_DETAILS_CARD_IMAGE,
        );

        expect(prizeDetailsCardImage).not.toBeInTheDocument();
    });

    it('renders an image and no youtube video', (): void => {
        render(<PrizeDetailsCard {...MOCK_PRIZE_DETAILS_CARDS[0]} />);

        const youtubeVideo: HTMLElement = screen.queryByTestId(
            YoutubeEmbedTestIds.YOUTUBE_CONTAINER,
        );

        expect(youtubeVideo).not.toBeInTheDocument();

        const prizeDetailsCardImage: HTMLElement = screen.getByTestId(
            PrizeDetailsTestIds.PRIZE_DETAILS_CARD_IMAGE,
        );

        expect(prizeDetailsCardImage).toBeInTheDocument();
    });
});

import { render, screen } from '@testing-library/react';
import React from 'react';

import { YoutubeEmbed } from './YoutubeEmbed';
import { YoutubeEmbedTestIds } from './YoutubeEmbedTestIds';

describe('YoutubeEmbed', (): void => {
    it('renders the component with the proper embed link', (): void => {
        const youtubeVideoId = 'uHmVmKcOSw4';
        render(
            <YoutubeEmbed
                captionTitle="Test"
                youtubeVideoUrl={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
            />,
        );

        const youtubeEmbedContainer: HTMLDivElement = screen.getByTestId(
            YoutubeEmbedTestIds.YOUTUBE_CONTAINER,
        );

        expect(youtubeEmbedContainer).toBeInTheDocument();

        const youtubeEmbedEmbed: HTMLEmbedElement = screen.getByTestId(
            YoutubeEmbedTestIds.YOUTUBE_EMBED,
        );

        expect(youtubeEmbedEmbed).toBeInTheDocument();
        expect(youtubeEmbedEmbed).toHaveAttribute(
            'src',
            `https://www.youtube.com/embed/${youtubeVideoId}`,
        );
    });

    it('renders nothing if the video url is wrong', (): void => {
        const previousError = console.error;
        console.error = jest.fn();

        render(
            <YoutubeEmbed
                captionTitle="Test"
                youtubeVideoUrl="https://www.google.com"
            />,
        );

        const youtubeEmbedContainer: HTMLDivElement = screen.queryByTestId(
            YoutubeEmbedTestIds.YOUTUBE_CONTAINER,
        );

        expect(youtubeEmbedContainer).not.toBeInTheDocument();

        const youtubeEmbedEmbed: HTMLEmbedElement = screen.queryByTestId(
            YoutubeEmbedTestIds.YOUTUBE_EMBED,
        );

        expect(youtubeEmbedEmbed).not.toBeInTheDocument();

        console.error = previousError;
    });
});

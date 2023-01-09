import { render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';

import { SubprizeCarouselCard } from './SubprizeCarouselCard';
import { SubprizeCarouselCardTestIds } from './SubprizeCarouselCardTestIds';
import { SUBPRIZE_CLOSE_STATUS } from './SubprizeCarouselStatuses';

describe('SubprizeCarouselCard', (): void => {
    describe('when the subprize is closed', () => {
        beforeEach(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            render(
                <SubprizeCarouselCard
                    captionTitle={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].title
                    }
                    closeDate={yesterday}
                    imageAlt={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].imageAlt
                    }
                    imageHeight={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.height
                    }
                    imageSrc={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.url
                    }
                    imageWidth={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.width
                    }
                />,
            );
        });

        it('renders the component', (): void => {
            const cardContainer: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CONTAINER,
            );

            expect(cardContainer).toBeInTheDocument();
        });

        it('renders the banner', (): void => {
            const cardContainerBanner: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_BANNER,
            );

            expect(cardContainerBanner).toBeInTheDocument();
            expect(cardContainerBanner).toHaveAttribute(
                'data-test-close-status',
                SUBPRIZE_CLOSE_STATUS.CLOSED,
            );
            expect(cardContainerBanner).toHaveTextContent(
                'en-US subprizes.closedOn',
            );
        });

        it('renders the caption', (): void => {
            const cardContainerCaption: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CAPTION,
            );

            expect(cardContainerCaption).toHaveTextContent(
                MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].title,
            );
        });

        it('renders the image', (): void => {
            const cardContainerImage: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_IMAGE,
            );

            expect(cardContainerImage).toHaveAttribute(
                'alt',
                MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].imageAlt,
            );
        });
    });

    describe('when the subprize closes in 7 days or less the component', (): void => {
        beforeEach(() => {
            const in5Days = new Date();
            in5Days.setDate(in5Days.getDate() + 5);

            render(
                <SubprizeCarouselCard
                    captionTitle={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].title
                    }
                    closeDate={in5Days}
                    imageAlt={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].imageAlt
                    }
                    imageHeight={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.height
                    }
                    imageSrc={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.url
                    }
                    imageWidth={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.width
                    }
                />,
            );
        });

        it('renders the component', (): void => {
            const cardContainer: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CONTAINER,
            );

            expect(cardContainer).toBeInTheDocument();
        });

        it('renders the banner', (): void => {
            const cardContainerBanner: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_BANNER,
            );

            expect(cardContainerBanner).toBeInTheDocument();
            expect(cardContainerBanner).toHaveAttribute(
                'data-test-close-status',
                SUBPRIZE_CLOSE_STATUS.CLOSE_NEAR,
            );
            expect(cardContainerBanner).toHaveTextContent(
                'en-US subprizes.closesIn',
            );
        });

        it('renders the caption', (): void => {
            const cardContainerCaption: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CAPTION,
            );

            expect(cardContainerCaption).toHaveTextContent(
                MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].title,
            );
        });

        it('renders the image', (): void => {
            const cardContainerImage: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_IMAGE,
            );

            expect(cardContainerImage).toHaveAttribute(
                'alt',
                MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].imageAlt,
            );
        });
    });

    describe('when the subprize closes in more than 7', (): void => {
        beforeEach(() => {
            const in10Days = new Date();
            in10Days.setDate(in10Days.getDate() + 10);

            render(
                <SubprizeCarouselCard
                    captionTitle={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].title
                    }
                    closeDate={in10Days}
                    imageAlt={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].imageAlt
                    }
                    imageHeight={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.height
                    }
                    imageSrc={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.url
                    }
                    imageWidth={
                        MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].image
                            .data.attributes.width
                    }
                />,
            );
        });

        it('renders the component', (): void => {
            const cardContainer: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CONTAINER,
            );

            expect(cardContainer).toBeInTheDocument();
        });

        it('renders the banner', (): void => {
            const cardContainerBanner: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_BANNER,
            );

            expect(cardContainerBanner).toBeInTheDocument();
            expect(cardContainerBanner).toHaveAttribute(
                'data-test-close-status',
                SUBPRIZE_CLOSE_STATUS.CLOSE_FAR,
            );
            expect(cardContainerBanner).toHaveTextContent(
                'en-US subprizes.closesOn',
            );
        });

        it('renders the caption', (): void => {
            const cardContainerCaption: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CAPTION,
            );

            expect(cardContainerCaption).toHaveTextContent(
                MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].title,
            );
        });

        it('renders the image', (): void => {
            const cardContainerImage: HTMLElement = screen.getByTestId(
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_IMAGE,
            );

            expect(cardContainerImage).toHaveAttribute(
                'alt',
                MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0].imageAlt,
            );
        });
    });
});

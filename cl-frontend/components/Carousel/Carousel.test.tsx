import { render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_CAROUSEL_SLIDES } from '@/mocks/carousel';
import { mockTruthyMediaQueryMatch } from '@/mocks/matchMedia';

import { Carousel } from './Carousel';
import { CarouselTestIds } from './CarouselTestIds';

describe('Carousel', (): void => {
    beforeAll((): void => {
        mockTruthyMediaQueryMatch();
    });

    it('renders the component', (): void => {
        render(<Carousel slides={MOCK_CAROUSEL_SLIDES} />);

        const container: HTMLElement = screen.getByTestId(
            CarouselTestIds.CAROUSEL_CONTAINER,
        );

        expect(container).toBeInTheDocument();
    });

    it('renders all slides', (): void => {
        render(<Carousel slides={MOCK_CAROUSEL_SLIDES} />);

        expect(
            screen.getAllByTestId(CarouselTestIds.CAROUSEL_SLIDE),
        ).toHaveLength(MOCK_CAROUSEL_SLIDES.length);
    });

    it('renders the dots', (): void => {
        render(<Carousel slides={MOCK_CAROUSEL_SLIDES} />);

        const dotsContainer = screen.getAllByTestId(
            CarouselTestIds.CAROUSEL_NAVIGATION_DOT,
        );

        expect(dotsContainer).toHaveLength(MOCK_CAROUSEL_SLIDES.length);
    });

    it('renders a carousel with the passed class name', (): void => {
        render(
            <Carousel
                className="test-class-name"
                slides={MOCK_CAROUSEL_SLIDES}
            />,
        );

        const container: HTMLElement = screen.getByTestId(
            CarouselTestIds.CAROUSEL_CONTAINER,
        );

        expect(container).toBeInTheDocument();
        expect(container.classList).toContain('test-class-name');
    });

    it('renders a carousel with arrows when needed', (): void => {
        render(<Carousel showArrows slides={MOCK_CAROUSEL_SLIDES} />);

        const prevBtncontainer: HTMLElement = screen.getByTestId(
            CarouselTestIds.CAROUSEL_PREV_BUTTON,
        );
        expect(prevBtncontainer).toBeInTheDocument();

        const nextBtncontainer: HTMLElement = screen.getByTestId(
            CarouselTestIds.CAROUSEL_NEXT_BUTTON,
        );
        expect(nextBtncontainer).toBeInTheDocument();
    });
});

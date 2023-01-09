import { render, screen } from '@testing-library/react';
import React from 'react';

import { CarouselTestIds } from '../Carousel/CarouselTestIds';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';

import { HeroImage } from './HeroImage';
import { HeroImageTestIds } from './HeroImageTestIds';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('HeroImage', (): void => {
    beforeAll((): void => {
        useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);
    });

    beforeEach((): void => {
        render(<HeroImage />);
    });

    it('renders the component', (): void => {
        const container: HTMLElement = screen.getByTestId(
            HeroImageTestIds.HERO_IMAGE_CONTAINER,
        );

        expect(container).toBeInTheDocument();
    });

    it('renders the carousel', (): void => {
        const container: HTMLElement = screen.getByTestId(
            CarouselTestIds.CAROUSEL_CONTAINER,
        );

        expect(container).toBeInTheDocument();
    });
});

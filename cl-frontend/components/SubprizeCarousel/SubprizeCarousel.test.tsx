import { render, screen } from '@testing-library/react';
import React from 'react';

import { mockTruthyMediaQueryMatch } from '@/mocks/matchMedia';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { SubprizeCarousel } from './SubprizeCarousel';
import { SubprizeCarouselTestIds } from './SubprizeCarouselTestIds';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('SubprizeCarousel', (): void => {
    beforeAll((): void => {
        mockTruthyMediaQueryMatch();
        useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);
    });

    describe('when sweepstake is open', (): void => {
        beforeEach((): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_DATA,
                    }}
                >
                    <SubprizeCarousel />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders the component', (): void => {
            const container: HTMLElement = screen.getByTestId(
                SubprizeCarouselTestIds.SUBPRIZE_CAROUSEL_CONTAINER,
            );

            expect(container).toBeInTheDocument();
        });

        it('renders the title', (): void => {
            const container: HTMLElement = screen.getByTestId(
                SubprizeCarouselTestIds.SUBPRIZE_CAROUSEL_TITLE,
            );

            expect(container).toHaveTextContent('en-US subprizes.title');
        });

        it('renders the subtitle', (): void => {
            const container: HTMLElement = screen.getByTestId(
                SubprizeCarouselTestIds.SUBPRIZE_CAROUSEL_SUBTITLE,
            );

            expect(container).toHaveTextContent('en-US subprizes.subtitle');
        });
    });

    describe('when sweepstake is not open', (): void => {
        beforeEach((): void => {
            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <SubprizeCarousel />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders no component', (): void => {
            const container: HTMLElement = screen.queryByTestId(
                SubprizeCarouselTestIds.SUBPRIZE_CAROUSEL_CONTAINER,
            );

            expect(container).not.toBeInTheDocument();
        });
    });
});

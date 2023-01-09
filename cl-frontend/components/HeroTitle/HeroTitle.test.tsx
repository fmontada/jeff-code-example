import { render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { HeroTitle } from './HeroTitle';
import { HeroTitleTestIds } from './HeroTitleTestIds';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');

describe('HeroTitle', (): void => {
    beforeAll(() => {
        useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);
    });

    it('renders nothing when the sweepstake has not been announced.', (): void => {
        render(
            <SweepstakeContext.Provider
                value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
            >
                <HeroTitle />
            </SweepstakeContext.Provider>,
        );

        const heroTitleElement: HTMLElement = screen.queryByTestId(
            HeroTitleTestIds.HERO_TITLE_CONTAINER,
        );

        expect(heroTitleElement).not.toBeInTheDocument();
    });

    it('renders meet the winner label when it has been announced.', (): void => {
        render(
            <SweepstakeContext.Provider
                value={{
                    sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                }}
            >
                <HeroTitle />
            </SweepstakeContext.Provider>,
        );

        const heroTitleElement: HTMLElement = screen.getByTestId(
            HeroTitleTestIds.HERO_TITLE_CONTAINER,
        );
        expect(heroTitleElement).toBeInTheDocument();
        expect(heroTitleElement).toHaveTextContent(
            'Meet the winner of a Dream Vacation in an Overwater Villa in the Maldives',
        );
    });

    it('renders the winner pending label when it is closed but not announced.', (): void => {
        render(
            <SweepstakeContext.Provider
                value={{ sweepstakeData: MOCK_SWEEPSTAKE_WINNER_PENDING_DATA }}
            >
                <HeroTitle />
            </SweepstakeContext.Provider>,
        );

        const heroTitleElement: HTMLElement = screen.getByTestId(
            HeroTitleTestIds.HERO_TITLE_CONTAINER,
        );

        expect(heroTitleElement).toBeInTheDocument();
        expect(heroTitleElement).toHaveTextContent(
            'Thanks to everyone who entered to win a Dream Vacation in an Overwater Villa in the Maldives',
        );
    });
});

import { render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import {
    MOCK_SWEEPSTAKE_DATA,
    MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
    MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
} from '@/mocks/sweepstakeData';
import { SweepstakeContext } from '@/store/context';

import { DonationVariants } from './DonationVariants';
import { DonationVariantsTestIds } from './DonationVariantsTestIds';

const useSelector = jest.spyOn(require('@plasmicapp/host'), 'useSelector');
const mockedUseGetClosestSubprize = jest.spyOn(
    require('@/hooks/useGetClosestSubprize'),
    'useGetClosestSubprize',
);
const mockedUseQuery = jest.spyOn(require('react-query'), 'useQuery');
const mockedUseStrapiSweepstakeBySlug = jest.spyOn(
    require('@/hooks/useStrapiSweepstakeBySlug'),
    'useStrapiSweepstakeBySlug',
);

describe('DonationVariants', (): void => {
    beforeAll(() => {
        useSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);
        mockedUseQuery.mockReturnValue({
            isLoading: false,
            error: undefined,
            data: {
                email: 'testing@omaze.com',
            },
        });
    });

    describe('when the sweepstake is open', (): void => {
        beforeEach((): void => {
            render(
                <SweepstakeContext.Provider
                    value={{ sweepstakeData: MOCK_SWEEPSTAKE_DATA }}
                >
                    <DonationVariants />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders the component', (): void => {
            const donationVariantContainer: HTMLElement = screen.getByTestId(
                DonationVariantsTestIds.DONATION_VARIANT_CONTAINER,
            );

            expect(donationVariantContainer).toBeInTheDocument();
        });

        it('renders the component with the title', (): void => {
            const donationTitleElement: HTMLElement = screen.getByTestId(
                DonationVariantsTestIds.DONATION_VARIANT_TITLE,
            );

            expect(donationTitleElement).toBeInTheDocument();
            expect(donationTitleElement).toHaveTextContent(
                'Support Make A Wish today and enter for your chance to win!',
            );
        });

        it('renders the component with all the cards', (): void => {
            const donationVariantCards: HTMLElement = screen.getByTestId(
                DonationVariantsTestIds.DONATION_VARIANT_CARDS,
            );

            // PLUS ONE DUE TO THE ENTER WITHOUT CONTRIBUTING
            expect(donationVariantCards.children).toHaveLength(
                MOCK_SWEEPSTAKE_DATA.prices.length + 1,
            );
        });

        it('renders the subprize that is open', (): void => {
            const subprizeBanner: HTMLElement = screen.getByTestId(
                DonationVariantsTestIds.DONATION_VARIANT_SUBPRIZE,
            );

            expect(subprizeBanner).toHaveTextContent(
                'en-US donationVariant.subprize',
            );
        });

        it('renders the subprize that is open', (): void => {
            const withoutContributingBtn: HTMLElement = screen.getByTestId(
                DonationVariantsTestIds.DONATION_VARIANT_WITHOUT_CONTRIBUTING_BTN,
            );

            expect(withoutContributingBtn).toHaveTextContent(
                'en-US donationVariant.enterWithoutContributing',
            );
            expect(withoutContributingBtn.tagName).toBe('BUTTON');
        });
    });

    describe('when the sweepstake is in winner pending state', (): void => {
        beforeEach((): void => {
            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: MOCK_STRAPI_SWEEPSTAKE,
            });

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_PENDING_DATA,
                    }}
                >
                    <DonationVariants />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders nothing when the sweepstake does not exists', (): void => {
            expect(
                screen.queryByTestId(
                    DonationVariantsTestIds.DONATION_VARIANT_CONTAINER,
                ),
            ).not.toBeInTheDocument();
        });
    });

    describe('when the sweepstake is in winner announced state', (): void => {
        beforeEach((): void => {
            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: MOCK_STRAPI_SWEEPSTAKE,
            });

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    }}
                >
                    <DonationVariants />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders nothing when the sweepstake does not exists', (): void => {
            expect(
                screen.queryByTestId(
                    DonationVariantsTestIds.DONATION_VARIANT_CONTAINER,
                ),
            ).not.toBeInTheDocument();
        });
    });

    describe('when the sweepstake has no active subprize', (): void => {
        beforeEach((): void => {
            mockedUseGetClosestSubprize.mockReturnValue(null);

            render(
                <SweepstakeContext.Provider
                    value={{
                        sweepstakeData: MOCK_SWEEPSTAKE_DATA,
                    }}
                >
                    <DonationVariants />
                </SweepstakeContext.Provider>,
            );
        });

        it('renders nothing', (): void => {
            expect(
                screen.queryByTestId(
                    DonationVariantsTestIds.DONATION_VARIANT_SUBPRIZE,
                ),
            ).not.toBeInTheDocument();
        });
    });
});

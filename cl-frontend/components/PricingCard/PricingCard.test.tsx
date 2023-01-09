import { render, screen } from '@testing-library/react';
import React from 'react';

import { MOCK_CART } from '@/mocks/cart';
import { MOCK_PRICING_CARD } from '@/mocks/pricingCard';

import { PricingCard } from './PricingCard';
import { PricingCardTestIds } from './PricingCardTestIds';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
const getCartApi = jest.spyOn(require('@/utils/api'), 'getCartApi');
const mockedUseQuery = jest.spyOn(require('react-query'), 'useQuery');

describe('PricingCard', (): void => {
    describe('when user is logged in', () => {
        const postCart = jest.fn(() => Promise.resolve({ data: MOCK_CART }));
        const push = jest.fn();
        beforeAll((): void => {
            useRouter.mockImplementation(() => ({
                push,
            }));
            getCartApi.mockImplementation(() => ({
                postCart,
            }));
            mockedUseQuery.mockReturnValue({
                isLoading: false,
                error: undefined,
                data: {
                    email: 'testing@omaze.com',
                },
            });
        });

        beforeEach(() => {
            render(<PricingCard {...MOCK_PRICING_CARD} />);
        });

        it('renders the component', (): void => {
            const pricingCardElement: HTMLElement = screen.getByTestId(
                PricingCardTestIds.PRICING_CARD_CONTAINER,
            );

            expect(pricingCardElement).toBeInTheDocument();
        });

        it('renders the pricing information', (): void => {
            const pricingCardElement: HTMLElement = screen.getByTestId(
                PricingCardTestIds.PRICING_CARD_CONTAINER,
            );

            expect(pricingCardElement).toBeInTheDocument();
            expect(
                screen.getByTestId(PricingCardTestIds.PRICING_CARD_CTA),
            ).toBeInTheDocument();
            expect(
                screen.getByTestId(PricingCardTestIds.PRICING_CARD_TITLE),
            ).toHaveTextContent('en-US general.entries');
        });
    });

    describe('when user is not logged in', () => {
        const postCart = jest.fn(() => Promise.resolve({ data: MOCK_CART }));
        const push = jest.fn();
        beforeAll((): void => {
            useRouter.mockImplementation(() => ({
                push,
            }));
            getCartApi.mockImplementation(() => ({
                postCart,
            }));
            mockedUseQuery.mockReturnValue({
                isLoading: false,
                error: undefined,
                data: undefined,
            });
        });

        beforeEach(() => {
            render(<PricingCard {...MOCK_PRICING_CARD} />);
        });

        it('renders the component', (): void => {
            const pricingCardElement: HTMLElement = screen.getByTestId(
                PricingCardTestIds.PRICING_CARD_CONTAINER,
            );

            expect(pricingCardElement).toBeInTheDocument();
        });
    });
});

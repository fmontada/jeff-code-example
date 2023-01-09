import { act, render, renderHook, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { MOCK_CART } from '@/mocks/cart';
import ThankYouPage, { ThankYouPageTestIds } from '@/pages/checkout/thank-you';
import { useCartStore } from '@/store/useCartStore';
import { convertToGtmLineItems } from '@/utils/gtm/main';

const queryClient = new QueryClient();

const addDataLayer = jest.spyOn(require('@/utils/gtm/main'), 'addDataLayer');

describe('ThankYouPage', () => {
    afterAll(() => {
        const { result } = renderHook(() => {
            return useCartStore();
        });

        act(() => {
            result.current.set((store) => {
                store.cart = undefined;
            });
        });
    });

    it('renders the page elements', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ThankYouPage />
            </QueryClientProvider>,
        );

        const container = screen.getByTestId(
            ThankYouPageTestIds.THANK_YOU_CONTAINER,
        );
        expect(container).toBeInTheDocument();

        const title = screen.getByTestId(ThankYouPageTestIds.THANK_YOU_TITLE);
        expect(title).toHaveTextContent('en-US thankYou.title');

        const body = screen.getByTestId(ThankYouPageTestIds.THANK_YOU_BODY);
        expect(body).toHaveTextContent('en-US thankYou.body');
    });

    it('renders a link to the survey', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ThankYouPage />
            </QueryClientProvider>,
        );

        const survey = screen.getByTestId(ThankYouPageTestIds.THANK_YOU_SURVEY);
        expect(survey).toHaveTextContent('en-US Link to dogfooding survey.');
        expect(survey.children[0]).toHaveAttribute(
            'href',
            process.env.NEXT_PUBLIC_DOGFOOD_SURVEY,
        );
    });

    it('clears the persisted store data', () => {
        const { result } = renderHook(() => {
            return useCartStore();
        });

        act(() => {
            result.current.set((store) => {
                store.cart = MOCK_CART;
            });
        });

        act(() => {
            expect(result.current.cart).toBe(MOCK_CART);
        });

        render(
            <QueryClientProvider client={queryClient}>
                <ThankYouPage />
            </QueryClientProvider>,
        );

        act(() => {
            expect(result.current.cart).toBe(undefined);
        });
    });

    it('calls gtm to add a purchase event', () => {
        expect(addDataLayer).toHaveBeenCalledWith({
            dataLayer: {
                ecommerce: null,
            },
        });

        expect(addDataLayer).toHaveBeenCalledWith({
            dataLayer: {
                event: 'purchase',
                ecommerce: {
                    transaction_id: MOCK_CART.id,
                    value: MOCK_CART.total_amount,
                    currency: 'USD',
                    items: convertToGtmLineItems(MOCK_CART.line_items),
                },
            },
        });
    });
});

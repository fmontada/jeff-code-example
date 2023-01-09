import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Cart } from '@/components/Cart/Cart';
import { MOCK_EMPTY_CART } from '@/mocks/cart';

import { CartTestIds } from './CartTestIds';
import { EmptyCart } from './EmptyCart';

const queryClient = new QueryClient();

const redirectFn = jest.fn();
jest.mock('next/link', () => {
    return function nextLinkMocked({ children }) {
        return <div onClick={redirectFn}>{children}</div>;
    };
});

describe('EmptyCart', (): void => {
    beforeEach(() => {
        render(<EmptyCart />);
    });

    it('renders an empty cart', () => {
        const emptyCartContainer = screen.getByTestId(
            CartTestIds.CART_EMPTY_CONTAINER,
        );
        expect(emptyCartContainer).toBeInTheDocument();
    });

    it('renders a shop now button on empty cart', async () => {
        const shopNowButton = screen.getByTestId(CartTestIds.SHOP_NOW);
        expect(shopNowButton).toBeInTheDocument();
        await act(async (): Promise<void> => {
            fireEvent.click(shopNowButton);
        });
        expect(window.location.pathname).toEqual('/');
        expect(redirectFn).toBeCalled();
    });

    it('renders empty cart', (): void => {
        render(
            <QueryClientProvider client={queryClient}>
                <Cart cart={MOCK_EMPTY_CART} />
            </QueryClientProvider>,
        );
        expect(screen.getByText('en-US cart.emptyCart')).toBeInTheDocument();
    });
});

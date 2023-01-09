import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { MOCK_CART } from '@/mocks/cart';

import { Cart } from '.';
import { CartTestIds } from './CartTestIds';

const queryClient = new QueryClient();

describe('Cart', (): void => {
    beforeEach(() => {
        render(
            <QueryClientProvider client={queryClient}>
                <Cart cart={MOCK_CART} />
            </QueryClientProvider>,
        );
    });

    it('renders a populated cart', () => {
        const populatedCartContainer = screen.getByTestId(
            CartTestIds.CART_CONTAINER,
        );
        expect(populatedCartContainer).toBeInTheDocument();
    });
});

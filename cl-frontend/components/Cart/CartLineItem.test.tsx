import { render, screen } from '@testing-library/react';

import { MOCK_CART } from '@/mocks/cart';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import { MOCK_SWEEPSTAKE_DATA } from '@/mocks/sweepstakeData';

import { CartLineItem } from './CartLineItem';
import { CartTestIds } from './CartTestIds';

const MOCK_LINE_ITEM = MOCK_CART.line_items[0];

const mockedUseQuery = jest.spyOn(require('react-query'), 'useQuery');

describe('CartLineItem', (): void => {
    describe('line item with quantity 2', () => {
        beforeEach(() => {
            mockedUseQuery.mockReturnValue({
                isLoading: false,
                error: undefined,
                data: {
                    email: 'testing@omaze.com',
                },
            });

            render(
                <CartLineItem
                    cart={MOCK_CART}
                    lineItem={MOCK_LINE_ITEM}
                    showDivider
                />,
            );
        });

        it('renders a cart line item', () => {
            const cartLineItem = screen.getByTestId(CartTestIds.CART_LINE_ITEM);

            expect(cartLineItem).toBeInTheDocument();
        });

        it('renders the charity name', () => {
            const cartLineItemCharity = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_CHARITY,
            );

            expect(cartLineItemCharity).toBeInTheDocument();
        });

        it('renders the cart line item title', () => {
            const cartLineItemTitle = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_TITLE,
            );

            expect(cartLineItemTitle).toBeInTheDocument();
        });

        it('renders the line item amount', () => {
            const amount = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_AMOUNT,
            );

            expect(amount).toBeInTheDocument();
            expect(amount).toHaveTextContent('$2.50');
        });

        it('renders the line item quantity', () => {
            const quantity = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_QUANTITY,
            );

            expect(quantity).toBeInTheDocument();
            expect(quantity).toHaveTextContent(
                MOCK_LINE_ITEM.quantity.toString(),
            );
        });

        it('renders the decrease quantity button', async () => {
            const decreaseQuantityBtn = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_DECREASE,
            );

            expect(decreaseQuantityBtn).toBeInTheDocument();
            expect(decreaseQuantityBtn.tagName).toBe('BUTTON');
        });

        it('renders the decrease quantity button with the minus icon', async () => {
            const decreaseQuantityBtn = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_DECREASE,
            );

            expect(decreaseQuantityBtn).toBeInTheDocument();
            expect(decreaseQuantityBtn.tagName).toBe('BUTTON');

            const decreaseQuantityBtnIcon = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_ICON_MINUS,
            );

            expect(decreaseQuantityBtnIcon).toBeInTheDocument();
        });

        it('renders the increase quantity button', async () => {
            const increaseQuantityBtn = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_INCREASE,
            );

            expect(increaseQuantityBtn).toBeInTheDocument();
            expect(increaseQuantityBtn.tagName).toBe('BUTTON');

            const increaseQuantityBtnIcon = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_ICON_PLUS,
            );

            expect(increaseQuantityBtnIcon).toBeInTheDocument();
        });
    });

    describe('line item with quantity 1', () => {
        beforeEach(() => {
            render(
                <CartLineItem
                    cart={MOCK_CART}
                    lineItem={{
                        ...MOCK_LINE_ITEM,
                        quantity: 1,
                    }}
                    showDivider
                />,
            );
        });

        it('renders the decrease quantity button with the trash bin', async () => {
            const decreaseQuantityBtn = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_DECREASE,
            );

            expect(decreaseQuantityBtn).toBeInTheDocument();
            expect(decreaseQuantityBtn.tagName).toBe('BUTTON');

            const decreaseQuantityBtnIcon = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_ICON_TRASH,
            );

            expect(decreaseQuantityBtnIcon).toBeInTheDocument();
        });
    });

    describe('line item grand-prize and subprizes', () => {
        it('renders grand-prize & subprizes, if there is any subprizes', () => {
            render(
                <CartLineItem
                    cart={MOCK_CART}
                    lineItem={MOCK_LINE_ITEM}
                    showDivider
                />,
            );

            const prizeTitles = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_TITLE,
            );

            expect(prizeTitles).toHaveTextContent(
                'en-US cart.lineItem.noteWithSubprizes',
            );
        });

        it('renders grand-prize & no subprizes, if there is no subprizes', () => {
            const MOCK_SWEEPSTAKE_DATA_NO_SUBPRIZE = {
                ...MOCK_SWEEPSTAKE_DATA,
                subprizes: [],
            };
            const MOCK_STRAPI_SWEEPSTAKE_NO_SUBPRIZE = {
                ...MOCK_STRAPI_SWEEPSTAKE,
                subprizes: [],
            };
            const MOCK_LINE_ITEM_NO_SUBPRIZE = {
                ...MOCK_CART.line_items[0],
                sweepstake: MOCK_SWEEPSTAKE_DATA_NO_SUBPRIZE,
                strapiData: MOCK_STRAPI_SWEEPSTAKE_NO_SUBPRIZE,
            };

            render(
                <CartLineItem
                    cart={MOCK_CART}
                    lineItem={MOCK_LINE_ITEM_NO_SUBPRIZE}
                    showDivider
                />,
            );

            const prizeTitles = screen.getByTestId(
                CartTestIds.CART_LINE_ITEM_TITLE,
            );

            expect(prizeTitles).toHaveTextContent(
                'en-US cart.lineItem.noteWithoutSubprizes',
            );
            expect(prizeTitles).not.toHaveTextContent(
                'en-US cart.lineItem.noteWithSubprizes',
            );
        });
    });
});

import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { LineItem, Status } from '@/api/orders';
import { MOCK_ORDERS } from '@/mocks/orders';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import { MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA } from '@/mocks/sweepstakeData';

import { OrderLineItem } from './OrderLineItem';
import { OrderLineItemTestIds } from './OrderLineItemTestIds';

const queryClient = new QueryClient();

const mockedUseSweepstakeById = jest.spyOn(
    require('@/hooks/useSweepstakeById'),
    'useSweepstakeById',
);

const mockedUseStrapiSweepstakeBySlug = jest.spyOn(
    require('@/hooks/useStrapiSweepstakeBySlug'),
    'useStrapiSweepstakeBySlug',
);

describe('OrderLineItem', (): void => {
    describe('when it has two subprizes', () => {
        beforeAll(() => {
            mockedUseSweepstakeById.mockReturnValue({
                data: MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
            });

            mockedUseStrapiSweepstakeBySlug.mockReturnValue({
                data: MOCK_STRAPI_SWEEPSTAKE,
            });
        });

        it('renders the component and its container', (): void => {
            render(
                <QueryClientProvider client={queryClient}>
                    <OrderLineItem
                        lineItem={Array.from(MOCK_ORDERS[0].line_items)[0]}
                        order={MOCK_ORDERS[0]}
                    />
                </QueryClientProvider>,
            );

            const orderLineItemContainer: HTMLElement = screen.getByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_CONTAINER,
            );

            expect(orderLineItemContainer).toBeInTheDocument();
        });

        it('renders the data information', (): void => {
            render(
                <QueryClientProvider client={queryClient}>
                    <OrderLineItem
                        lineItem={Array.from(MOCK_ORDERS[0].line_items)[0]}
                        order={MOCK_ORDERS[0]}
                    />
                </QueryClientProvider>,
            );

            const image: HTMLElement = screen.getByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_IMAGE,
            );

            expect(image).toBeInTheDocument();

            const numEntries: HTMLElement = screen.getByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_NUM_ENTRIES,
            );

            expect(numEntries).toHaveTextContent('cartOrder.entries');

            const quantity: HTMLElement = screen.getByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_QUANTITY,
            );

            expect(quantity).toHaveTextContent('cartOrder.quantity');

            const refundedLabel: HTMLElement = screen.queryByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_REFUNDED_LABEL,
            );

            expect(refundedLabel).not.toBeInTheDocument();

            const price: HTMLElement = screen.getByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_PRICE,
            );

            expect(price).toHaveTextContent('$1');

            const charity: HTMLElement = screen.getByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_CHARITY,
            );

            expect(charity).toHaveTextContent('en-US cartOrder.supporting');
        });

        it('renders the subprizes list with 2 subprizes', (): void => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            mockedUseSweepstakeById.mockReturnValue({
                data: {
                    ...MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                    subprizes: [
                        {
                            ...MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA
                                .subprizes[0],
                            close_date: tomorrow.toISOString(),
                        },
                        {
                            ...MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA
                                .subprizes[1],
                            close_date: tomorrow.toISOString(),
                        },
                    ],
                },
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <OrderLineItem
                        lineItem={Array.from(MOCK_ORDERS[0].line_items)[0]}
                        order={MOCK_ORDERS[0]}
                    />
                </QueryClientProvider>,
            );

            const subprizesContainer: HTMLElement = screen.queryByTestId(
                OrderLineItemTestIds.ORDER_LINE_ITEM_SUBPRIZES,
            );

            expect(subprizesContainer).toBeInTheDocument();
            expect(subprizesContainer.childNodes.length).toBe(
                MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA.subprizes.length,
            );
        });

        describe('when the line item is refunded', (): void => {
            it('renders the refunded label', (): void => {
                const refundedLineItem: LineItem = {
                    ...Array.from(MOCK_ORDERS[0].line_items)[0],
                    status: Status.Refunded,
                };

                render(
                    <QueryClientProvider client={queryClient}>
                        <OrderLineItem
                            lineItem={refundedLineItem}
                            order={MOCK_ORDERS[0]}
                        />
                    </QueryClientProvider>,
                );

                const refundedLabel: HTMLElement = screen.getByTestId(
                    OrderLineItemTestIds.ORDER_LINE_ITEM_REFUNDED_LABEL,
                );

                expect(refundedLabel).toBeInTheDocument();
            });
        });

        describe('when the line item has not subprizes', (): void => {
            it('renders no subprizes', (): void => {
                mockedUseSweepstakeById.mockReturnValue({
                    data: {
                        ...MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA,
                        subprizes: [],
                    },
                });

                render(
                    <QueryClientProvider client={queryClient}>
                        <OrderLineItem
                            lineItem={Array.from(MOCK_ORDERS[0].line_items)[0]}
                            order={MOCK_ORDERS[0]}
                        />
                    </QueryClientProvider>,
                );

                const subprizesContainer: HTMLElement = screen.queryByTestId(
                    OrderLineItemTestIds.ORDER_LINE_ITEM_SUBPRIZES,
                );

                expect(subprizesContainer).not.toBeInTheDocument();
            });
        });
    });
});

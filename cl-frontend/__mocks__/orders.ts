import {
    LineItem,
    Order,
    PaymentMethodCardBrandEnum,
    PaymentStatus,
    Status,
} from '@/api/orders';

const MOCK_LINE_ITEMS = new Set<LineItem>([
    {
        id: '7704cd9d-9c04-4d75-b62e-18d522b40dc7',
        created_at: '2022-07-19T18:06:46.642Z',
        order_id: '12dedc49-92c0-43c2-9dfd-3004a2c648d2',
        sweepstakes_id: '764c8337-264e-433f-83bd-d6755a2787b2',
        num_entries: 100,
        status: Status.Paid,
        amount: 100,
        quantity: 100,
        external_id: 'ewfwefwef',
    },
    {
        id: '7704cd9d-9c04-4d75-b62e-18d522b40dc1',
        created_at: '2022-07-19T18:06:46.6423',
        order_id: '12dedc49-92c0-43c2-9dfd-3004a2c648d2',
        sweepstakes_id: '764c8337-264e-433f-83bd-d6755a2787b2',
        num_entries: 200,
        status: Status.Paid,
        amount: 200,
        quantity: 100,
        external_id: 'ewfwefwef',
    },
]);

const MOCK_LINE_ITEMS_2 = new Set<LineItem>([
    {
        id: '7704cd9d-9c04-4d75-b62e-18d522b40dc7',
        created_at: '2022-07-19T18:06:46.642Z',
        order_id: '12dedc49-92c0-43c2-9dfd-3004a2c648d2',
        sweepstakes_id: '764c8337-264e-433f-83bd-d6755a2787b2',
        num_entries: 0,
        status: Status.Paid,
        amount: 0,
        quantity: 0,
        external_id: 'ewfwefwef',
    },
]);

export const MOCK_ORDERS: Order[] = [
    {
        id: '12dedc49-92c0-43c2-9dfd-3004a2c648d243',
        created_at: '2022-07-19T18:06:46.642Z',
        customer_id: '31dc1cc8-cd3e-4cb6-bf13-f8f44b55e0c4',
        payment_id: 'pi_3KqLnUIUEZG1MhZm1WOU1R1K',
        amount: 250000,
        currency: 'USD',
        line_items: MOCK_LINE_ITEMS,
        payment_status: PaymentStatus.Pending,
        payment_method: {
            type: 'card',
            card: {
                brand: PaymentMethodCardBrandEnum.Visa,
                last4: '4242',
            },
        },
        order_date: '2022-07-19T18:06:46.642Z',
        order_type: 'paid',
    },
    {
        id: '12dedc49-92c0-43c2-9dfd-3004a2c648d2',
        created_at: '2022-07-19T18:06:46.642Z',
        customer_id: '31dc1cc8-cd3e-4cb6-bf13-f8f44b55e0c4',
        payment_id: 'pi_3KqLnUIUEZG1MhZm1WOU1R1K',
        amount: 250000,
        currency: 'USD',
        line_items: MOCK_LINE_ITEMS_2,
        payment_status: PaymentStatus.Pending,
        payment_method: {
            type: 'card',
            card: {
                brand: PaymentMethodCardBrandEnum.Visa,
                last4: '4242',
            },
        },
        order_date: '2022-07-19T18:06:46.642Z',
        order_type: 'paid',
    },
];

import { CartStatusEnum } from '@/api/orders';
import { ICartStore, ICartStoreLineItem } from '@/types/api';

import { MOCK_STRAPI_SWEEPSTAKE } from './strapiSweepstake';
import { MOCK_SWEEPSTAKE_DATA } from './sweepstakeData';

export const LINE_ITEM_SAMPLE_1: ICartStoreLineItem = {
    id: '7704cd9d-9c04-4d75-b62e-18d522b40dc7',
    created_at: '2019-08-24T14:15:22Z',
    order_id: '12dedc49-92c0-43c2-9dfd-3004a2c648d2',
    sweepstakes_id: '764c8337-264e-433f-83bd-d6755a2787b2',
    num_entries: 550,
    quantity: 2,
    status: 'paid',
    amount: 250,
    external_id: '764c8337-264e-433f-83bd-fmwfwlfwf',
    sweepstake: MOCK_SWEEPSTAKE_DATA,
    strapiData: MOCK_STRAPI_SWEEPSTAKE,
};

export const LINE_ITEM_SAMPLE_2: ICartStoreLineItem = {
    id: '7704cd9d-9c04-4d75-b62e-18d522b40dc6',
    created_at: '2019-08-24T14:15:21Z',
    order_id: '12dedc49-92c0-43c2-9dfd-3004a2c648d1',
    sweepstakes_id: '764c8337-264e-433f-83bd-d6755a2787b1',
    num_entries: 200,
    quantity: 1,
    status: 'paid',
    amount: 100,
    external_id: '764c8337-264e-433f-83bd-fmwfwlfwg',
    sweepstake: MOCK_SWEEPSTAKE_DATA,
    strapiData: MOCK_STRAPI_SWEEPSTAKE,
};

export const MOCK_CART: ICartStore = {
    client_secret: 'wefwefwe0rw-feewfwewe',
    id: '12dedc49-92c0-43c2-9dfd-3004a2c648d2',
    total_amount: 500,
    status: CartStatusEnum.Open,
    line_items: [LINE_ITEM_SAMPLE_1],
};

export const MOCK_CART_WITH_ONE_CART_ITEM: ICartStore = {
    ...MOCK_CART,
    line_items: [LINE_ITEM_SAMPLE_2],
};

export const MOCK_CART_WITH_MULTIPLE_LINE_ITEMS: ICartStore = {
    ...MOCK_CART,
    line_items: [LINE_ITEM_SAMPLE_1, LINE_ITEM_SAMPLE_2],
};

export const MOCK_EMPTY_CART: ICartStore = {
    ...MOCK_CART,
    total_amount: 0,
    line_items: [],
};

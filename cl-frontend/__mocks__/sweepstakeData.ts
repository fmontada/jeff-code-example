import { SweepsStatus, Sweepstakes } from '@/api/sweepstakes';

/* eslint-disable camelcase */
export const MOCK_SWEEPSTAKE_DATA: Sweepstakes = {
    cause: 'Make a wish',
    draw_date: '2022-12-02T00:00:00Z',
    id: 'bbf7feee-acdb-414e-a228-88618893795b',
    prices: [
        {
            currency_code: 'usd',
            entries: 20,
            external_id: 'price_1L7ooND8BCBD5aCdp19DYYfc',
            payment_link_url: 'https://buy.stripe.com/test_fZe3g0d1Zbcw7F6eVo',
            price: 1000,
        },
        {
            currency_code: 'usd',
            entries: 125,
            external_id: 'price_1L7ooND8BCBD5aCdKvuu52UA',
            payment_link_url: 'https://buy.stripe.com/test_eVa8Akd1Z4O88Ja7sX',
            price: 2500,
        },
        {
            currency_code: 'usd',
            entries: 500,
            external_id: 'price_1L7ooND8BCBD5aCdvBuhCaE0',
            payment_link_url: 'https://buy.stripe.com/test_fZecQA0fdgwQe3uaFa',
            price: 5000,
        },
        {
            currency_code: 'usd',
            entries: 1200,
            external_id: 'price_1L7ooND8BCBD5aCddsnfJPb9',
            payment_link_url: 'https://buy.stripe.com/test_00g4k46DB2G05wY5kR',
            price: 10000,
        },
        {
            currency_code: 'usd',
            entries: 2000,
            external_id: 'price_1L7ooOD8BCBD5aCd7KhrKr6v',
            payment_link_url: 'https://buy.stripe.com/test_aEU3g06DBfsM7F63cK',
            price: 15000,
        },
    ],
    rules: 'qa sprinter rules',
    slug: 'qa-sprinter-van-2022',
    status: SweepsStatus.Open,
    title: 'QA Win a 2022 Mercedes® Sprinter Van with an $80,000 Eco-Friendly Conversion',
    winner_announce_date: '2023-12-02T10:00:00Z',
    grand_prize: {
        name: 'Mansion in Hawaii',
        open_date: '2020-01-01T00:00:00Z',
        close_date: '2020-10-01T15:00:00Z',
        winner: '3184bf53-bbbd-4f15-b8f1-4a9b080d8e11',
    },
    subprizes: [
        {
            id: '54e3783e-b16d-4af4-90c4-44d55aaefb8e',
            name: 'Porsche',
            open_date: '2020-01-01T00:00:00Z',
            close_date: '2020-01-08T00:00:00Z',
            winner: '28fa4128-d76a-4d42-9227-4ce6078c7d3f',
        },
        {
            id: 'c01eed35-6dd5-4e82-a3c8-380b50b9151d',
            name: 'Toyota Sienna Hybrid',
            open_date: '2030-12-25T00:00:00Z',
            close_date: '2030-12-31T00:00:00Z',
        },
    ],
    primary_tag: 'CARS',
    secondary_tag: 'LUXURY',
};

export const MOCK_SWEEPSTAKE_WINNER_ANNOUNCED_DATA = {
    ...MOCK_SWEEPSTAKE_DATA,
    slug: `${MOCK_SWEEPSTAKE_DATA.slug}-winner-announced`,
    status: SweepsStatus.WinnerAnnounced,
    title: `${MOCK_SWEEPSTAKE_DATA.title}-winner-announced`,
};

export const MOCK_SWEEPSTAKE_WINNER_PENDING_DATA = {
    ...MOCK_SWEEPSTAKE_DATA,
    slug: `${MOCK_SWEEPSTAKE_DATA.slug}-winner-pending`,
    status: SweepsStatus.WinnerPending,
    title: `${MOCK_SWEEPSTAKE_DATA.title}-winner-pending`,
};

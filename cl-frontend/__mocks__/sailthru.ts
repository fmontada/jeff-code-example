import { ISailthruUser } from '@/types/sailthru';

export const MOCK_SAILTHRU_USER: ISailthruUser = {
    keys: {
        sid: 'fwefewefjwefjwefjwefjwef93',
        cookie: 'wfwejfwefwef8wef8wef',
        email: 'testubgerwgferwfjew@gmail.com',
    },
    vars: {
        first_name: 'John',
        last_name: 'Doe',
        shopify_addresses: [
            {
                address1: '1829 Washington.',
                address2: '',
                city: 'Washington',
                company: null,
                country: 'United States',
                country_code: 'US',
                country_name: 'United States',
                customer_id: 9214912491221,
                default: true,
                first_name: 'John',
                id: 234234234234,
                last_name: 'Doe',
                name: 'John Doe',
                phone: '393939393',
                province: 'Washington',
                province_code: 'WA',
                zip: '30044',
            },
        ],
        shopify_created_at_date: '2020-10-16T06:21:44Z',
        shopify_imported_at_date: '2021-02-23T18:43:29.901835Z',
        shopify_note: null,
        shopify_phone: null,
        shopify_state: 'disabled',
        shopify_tags: 'house',
        shopify_updated_at_date: '2021-02-23T18:43:27Z',
        source: 'orlando_house_email_capture',
        House_Donor: true,
        Q42020OrlandoHouse_NondonorOnboarding: 'yes',
    },
    lists: {
        'TEST - External Donor list 111120': 'Tue, 10 Nov 2020 16:42:51 -0800',
    },
    engagement: 'disengaged',
    optout_email: 'none',
    sms_marketing_status: null,
    sms_transactional_status: null,
};

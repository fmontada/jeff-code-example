export interface ISailthruUserKeys {
    sid: string;
    cookie: string;
    email: string;
}

export interface ISailthruUserShopifyAddress {
    address1: string;
    address2: string;
    city: string;
    company: string;
    country: string;
    country_code: string;
    country_name: string;
    customer_id: any;
    default: boolean;
    first_name: string;
    id: any;
    last_name: string;
    name: string;
    phone: string;
    province: string;
    province_code: string;
    zip: string;
}

export interface ISailthruUserVars {
    first_name: string;
    last_name: string;
    shopify_addresses: ISailthruUserShopifyAddress[];
    shopify_created_at_date: string;
    shopify_imported_at_date: string;
    shopify_note?: any;
    shopify_phone?: any;
    shopify_state: string;
    shopify_tags: string;
    shopify_updated_at_date: string;
    source: string;
    [key: string]: any;
}

export interface ISailthruUser {
    keys: ISailthruUserKeys;
    vars: ISailthruUserVars;
    lists: Record<string, string>;
    // levels: https://getstarted.sailthru.com/audience/managing-users/user-engagement-levels/
    engagement:
        | 'engaged'
        | 'disengaged'
        | 'active'
        | 'passive'
        | 'new'
        | 'dormant'
        | 'hardbounce'
        | 'opt-out';
    optout_email: string;
    sms_marketing_status?: any;
    sms_transactional_status?: any;
}

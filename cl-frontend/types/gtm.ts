export interface IInitializeArgs {
    gtmId: string;
    dataLayer?:
        | IAddToCartTag
        | IRemoveFromCartTag
        | IViewItemTag
        | IUserIdTag
        | IPurchaseEcommerce
        | INulledEcommerce;
    dataLayerName?: string;
    events?: Record<string, any>;
    preview?: string;
    auth?: string;
}

export interface IUserIdTag {
    userId: string;
}

export interface INulledEcommerce {
    ecommerce: null;
}

export interface ICartItems {
    item_name: string;
    item_id: string;
    price: string;
    item_brand?: string;
    item_category?: string;
    item_category2?: string;
    item_category3?: string;
    item_category4?: string;
    item_variant?: string;
    item_list_name?: string;
    item_list_id?: string;
    index?: number;
    quantity: number;
}

export interface IRemoveFromCartTag {
    event: 'remove_from_cart';
    ecommerce: {
        items: ICartItems[];
    };
}

export interface IAddToCartTag {
    event: 'add_to_cart';
    ecommerce: {
        items: ICartItems[];
    };
}

export interface IViewItemTag {
    event: 'view_item';
    ecommerce: {
        items: ICartItems[];
    };
}

export interface IPurchaseEcommerce {
    event: 'purchase';
    ecommerce: {
        transaction_id: string;
        value: number;
        currency: string;
        items: ICartItems[];
    };
}

export type IDataLayerArgs = Pick<
    IInitializeArgs,
    'dataLayer' | 'dataLayerName'
>;

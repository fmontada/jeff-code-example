import { Cart, LineItem } from '@/api/orders';
import { SweepsStatus, Sweepstakes } from '@/api/sweepstakes';

import { IStrapiSweepstake } from './strapi';

export interface ICartPostMiddleware {
    external_id: string;
    quantity: number;
}

export interface ICartStoreLineItem extends LineItem {
    sweepstake?: Sweepstakes;
    strapiData?: IStrapiSweepstake;
}
export interface ICartStore extends Cart {
    line_items: ICartStoreLineItem[];
}

export interface IExperienceWithSweepstakeData {
    sweepstake_id: string;
    image: string;
    charity: string;
    description: string;
    entries: number;
    closeDate: string;
    status: SweepsStatus;
}

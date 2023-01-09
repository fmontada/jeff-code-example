import { Cart, LineItem } from '@/api/orders';
import { getStrapiSweepstakeBySlugQuery } from '@/queries/getStrapiSweepstakeBySlugQuery';
import { useCartStore } from '@/store/useCartStore';
import { ICartStore, ICartStoreLineItem } from '@/types/api';
import { getSweepstakesApi } from '@/utils/api';

async function saveNewLineItem(
    cartLineItem: LineItem,
    currentData: Map<string, ICartStoreLineItem>,
): Promise<ICartStoreLineItem> {
    try {
        const cachedData = currentData.get(cartLineItem.sweepstakes_id);
        if (cachedData) {
            return {
                ...cartLineItem,
                sweepstake: cachedData.sweepstake,
                strapiData: cachedData.strapiData,
            };
        }

        const sweepstakesApi = getSweepstakesApi();
        const { data: sweepstake } = await sweepstakesApi.getSweepstakesByID(
            cartLineItem.sweepstakes_id,
        );

        const strapiData = await getStrapiSweepstakeBySlugQuery({
            queryKey: ['', sweepstake.slug],
        });

        return {
            ...cartLineItem,
            sweepstake,
            strapiData,
        };
    } catch (error) {
        console.error(error);
    }
}

export async function appendStripeDataToCart(cart: Cart): Promise<ICartStore> {
    const storedCart = useCartStore.getState().cart;
    const currentData = new Map<string, ICartStoreLineItem>();

    if (storedCart) {
        for (const lineItem of storedCart.line_items) {
            currentData.set(lineItem.sweepstakes_id, lineItem);
        }
    }

    const promisesOfNewLineItems = cart.line_items.map((lineItem) =>
        saveNewLineItem(lineItem, currentData),
    );

    const newCart: ICartStore = { ...cart };
    newCart.line_items = await Promise.all(promisesOfNewLineItems);
    return newCart;
}

import { ICartStoreLineItem } from '@/types/api';
import { IDataLayerArgs } from '@/types/gtm';
import { formatCentsForGtm } from '@/utils/formatNumbers';

export enum GTM_EVENTS {
    ADD_TO_CART_OA_ID = 'addToCart',
    REMOVE_FROM_CART_OA_ID = 'removeFromCart',
}

export function snippetsDataLayer(
    dataLayer?: Record<string, any>,
    dataLayerName?: string,
): string {
    return `
      window.${dataLayerName} = window.${dataLayerName} || [];
      window.${dataLayerName}.push(${JSON.stringify(dataLayer)})`;
}

export function addDataScript(dataLayer: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.innerHTML = dataLayer;
    return script;
}

export function addDataLayer({
    dataLayer,
    dataLayerName = 'dataLayer',
}: IDataLayerArgs): void {
    if (!window.dataLayer) {
        return;
    }

    const existingDataLayer = window[dataLayerName];

    if (existingDataLayer) {
        return existingDataLayer.push(dataLayer);
    }

    const snippets = snippetsDataLayer(dataLayer, dataLayerName);
    const dataScript = addDataScript(snippets);

    document.head.insertBefore(dataScript, document.head.childNodes[0]);
}

export function convertToGtmLineItems(
    line_items:
        | Pick<
              ICartStoreLineItem,
              'sweepstake' | 'external_id' | 'amount' | 'quantity'
          >[]
        | undefined,
) {
    if (!line_items) {
        return [];
    }

    return line_items.map((lineItem) => {
        return {
            item_id: lineItem.sweepstake?.id,
            item_name: lineItem.sweepstake?.title,
            currency: 'USD',
            discount: 0,
            item_brand: 'Omaze',
            item_category: 'Sweepstake',
            item_variant: lineItem.external_id,
            price: formatCentsForGtm(lineItem.amount, lineItem.quantity),
            quantity: lineItem.quantity,
        };
    });
}

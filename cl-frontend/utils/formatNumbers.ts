export const { format: formatNumber } = new Intl.NumberFormat();

export function formatWithCurrency(value: number, currency: string = 'USD') {
    const intlNumberFormat = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
    });

    return intlNumberFormat.format(value).replace(/\D00(?=\D*$)/, '');
}

export function formatCentsWithCurrency(
    value: number,
    currency: string = 'USD',
) {
    return formatWithCurrency(value / 100, currency);
}

export function formatCentsForGtm(amount: number, quantity: number) {
    const unitPrice = amount / quantity;
    const priceInUsd = unitPrice / 100;
    const priceWithCents = String(priceInUsd.toFixed(2));
    return priceWithCents;
}
